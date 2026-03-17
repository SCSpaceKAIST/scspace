import {
    Injectable,
    Inject,
    NotFoundException,
} from '@nestjs/common';
import { DBAsyncProvider } from 'src/db/db.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import {
    schema,
    Rental,
    Goods,
    User,
} from '@schema';
import {
    eq,
    and,
    SQL,
    gt,
    lt,
    desc,
    or,
    gte,
    lte,
    count,
    ne,
    asc,
} from 'drizzle-orm';
import {
    IRentalCreate,
    IRentalUpdate,
    IGoodsCreate,
    IGoodsUpdate,
    IGoodsFilter,
    IGoodsAvailabilityCheck,
} from '@scspace-depot/types/rental';
import { getNow } from '@scspace-server/common/utils';
import { IDataResponse } from '@scspace-depot/types/common/common.type';
import { MAX_RENTAL_LIMIT } from "@scspace-depot/consts/rental.const"

@Injectable()
export class RentalRepository {
    constructor(
        @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>
    ) { }

    // Rental CRUD operations
    async createRental(rental: IRentalCreate): Promise<number> {
        const result = await this.db.insert(Rental).values({
            ...rental,
            timeReturn: 0,
            timeConfirm: 0,
            certName: "Certificate Name",
        });
        return result[0].insertId;
    }

    async fetchRentalById(id: number): Promise<typeof Rental.$inferSelect | null> {
        const result = await this.db.select().from(Rental).where(eq(Rental.id, id));
        return result[0] || null;
    }

    async fetchRentalsByUserId(
        userId: number,
        isActive?: boolean,
        limit: number = 50,
        offset: number = 0
    ): Promise<IDataResponse<typeof Rental.$inferSelect[]>> {
        const whereClause: SQL[] = [eq(Rental.userId, userId)];

        if (isActive !== undefined) {
            if (isActive) {
                whereClause.push(eq(Rental.timeReturn, 0));
            } else {
                whereClause.push(ne(Rental.timeReturn, 0));
            }
        }

        const [data, [countResult]] = await Promise.all([
            this.db
                .select()
                .from(Rental)
                .where(and(...whereClause))
                .orderBy(desc(Rental.timeBorrow))
                .limit(limit)
                .offset(offset),
            this.db
                .select({ count: count() })
                .from(Rental)
                .where(and(...whereClause))
        ]);

        return {
            data,
            count: countResult.count
        };
    }

    async fetchAllRentals(
        limit: number = 50,
        offset: number = 0
    ): Promise<IDataResponse<typeof Rental.$inferSelect[]>> {
        const [data, [countResult]] = await Promise.all([
            this.db
                .select()
                .from(Rental)
                .orderBy(desc(Rental.timeBorrow))
                .limit(limit)
                .offset(offset),
            this.db.select({ count: count() }).from(Rental)
        ]);

        return {
            data,
            count: countResult.count
        };
    }

    async updateRental(id: number, updates: IRentalUpdate): Promise<void> {
        await this.db.update(Rental).set(updates).where(eq(Rental.id, id));
    }

    //rental Cert URI update
    async updateRentalCert (id:number, filename : string) : Promise <void> {
        await this.db.update(Rental).set({certName : filename}).where(eq(Rental.id, id));
    }

    async returnRental(id: number, timeReturn: number): Promise<void> {
        await this.db.update(Rental).set({ timeReturn }).where(eq(Rental.id, id));
    }

    async confirmReturn(id: number, timeConfirm: number): Promise<void> {
        await this.db.update(Rental).set({ timeConfirm }).where(eq(Rental.id, id));
    }

    async deleteRental(id: number): Promise<void> {
        await this.db.delete(Rental).where(eq(Rental.id, id));
    }

    // Goods CRUD operations
    async createGoods(goods: IGoodsCreate): Promise<number> {
        const result = await this.db.insert(Goods).values({
            ...goods,
            countNow: goods.countAll, // countNow를 countAll과 같은 값으로 설정
        });
        return result[0].insertId;
    }

    async fetchGoodsById(id: number): Promise<typeof Goods.$inferSelect | null> {
        const result = await this.db.select()
            .from(Goods)
            .where(eq(Goods.id, id));
        return result[0] || null;
    }

    async fetchAllGoods(): Promise<typeof Goods.$inferSelect[]> {
        return await this.db.select()
            .from(Goods)
            .orderBy(asc(Goods.name));
    }

    async updateGoods(id: number, updates: IGoodsUpdate): Promise<void> {
        await this.db.update(Goods).set(updates).where(eq(Goods.id, id));
    }

    async updateGoodsStock(id: number, countNow: number): Promise<void> {
        await this.db.update(Goods).set({ countNow }).where(eq(Goods.id, id));
    }

    async deleteGoods(id: number): Promise<void> {
        await this.db.delete(Goods).where(eq(Goods.id, id));
    }

    // Availability check
    async checkGoodsAvailability(check: IGoodsAvailabilityCheck): Promise<boolean> {
        const { goodsId, count: requestedCount, timeBorrow, timeDue } = check;

        // 해당 물품 정보 조회
        const goods = await this.fetchGoodsById(goodsId);
        if (!goods) {
            throw new NotFoundException('Goods not found');
        }

        // 현재 사용 가능한 수량 확인
        if (goods.countNow < requestedCount) {
            return false;
        }

        // 해당 기간 동안 겹치는 대여가 있는지 확인
        const overlappingRentals = await this.db
            .select({ totalCount: count() })
            .from(Rental)
            .where(
                and(
                    eq(Rental.goodsId, goodsId),
                    eq(Rental.timeReturn, 0), // 아직 반납되지 않은 것들
                    or(
                        and(
                            gte(Rental.timeBorrow, timeBorrow),
                            lt(Rental.timeBorrow, timeDue)
                        ),
                        and(
                            gt(Rental.timeDue, timeBorrow),
                            lte(Rental.timeDue, timeDue)
                        ),
                        and(
                            lte(Rental.timeBorrow, timeBorrow),
                            gte(Rental.timeDue, timeDue)
                        )
                    )
                )
            );

        const conflictingCount = overlappingRentals[0]?.totalCount || 0;
        const availableCount = goods.countAll - conflictingCount;

        return availableCount >= requestedCount;
    }

    // 각 상황별로 분리된 검사 함수들
    async checkRentalLimit(userId: number): Promise<boolean> {
        const countRental = await this.db
            .select({ totalCount: count() })
            .from(Rental)
            .where(and(
                eq(Rental.userId, userId),
                eq(Rental.timeReturn, 0)
            ))
            .then(res => res[0]?.totalCount || 0);

        return countRental < MAX_RENTAL_LIMIT;
    }

    async checkCurrentOverdue(userId: number): Promise<boolean> {
        const now = getNow();
        const overdueCount = await this.db
            .select({ totalCount: count() })
            .from(Rental)
            .where(and(
                eq(Rental.userId, userId),
                eq(Rental.timeReturn, 0),  // 아직 반납하지 않음
                lt(Rental.timeDue, now)    // 기한이 지남
            ))
            .then(res => res[0]?.totalCount || 0);

        return overdueCount === 0;
    }

    async checkUnconfirmedOverdueReturns(userId: number): Promise<boolean> {
        const unconfirmedOverdueCount = await this.db
            .select({ totalCount: count() })
            .from(Rental)
            .where(and(
                eq(Rental.userId, userId),
                gt(Rental.timeReturn, 0),   // 반납은 했음
                eq(Rental.timeConfirm, 0),  // 아직 관리자 확인 안됨
                lt(Rental.timeDue, Rental.timeReturn)  // 연체된 반납 (due < return)
            ))
            .then(res => res[0]?.totalCount || 0);

        return unconfirmedOverdueCount === 0;
    }

    async checkUserOverduePenalty(userId: number): Promise<boolean> {
        const now = getNow();

        // User 테이블에서 timeOverdue 확인
        const userResult = await this.db
            .select({ timeOverdue: User.timeOverdue })
            .from(User)
            .where(eq(User.id, userId))
            .limit(1);

        if (userResult.length === 0) {
            return false; // 사용자를 찾을 수 없음
        }

        const user = userResult[0];

        // timeOverdue가 0이거나 현재 시간이 timeOverdue를 지났으면 대여 가능
        return user.timeOverdue === 0 || now > user.timeOverdue;
    }

    // Get overdue rentals
    async getOverdueRentals(): Promise<typeof Rental.$inferSelect[]> {
        const now = getNow();
        return await this.db
            .select()
            .from(Rental)
            .where(
                and(
                    eq(Rental.timeReturn, 0),
                    lt(Rental.timeDue, now)
                )
            );
    }
}
