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
} from '@schema';
import {
    eq,
    and,
    SQL,
    lt,
    desc,
    or,
    count,
    ne,
    asc, inArray,
} from "drizzle-orm";
import {
    IRentalCreate,
    IRentalUpdate,
    IGoodsCreate,
    IGoodsUpdate,
    IGoodsAvailabilityCheck,
} from '@scspace-depot/types/rental';
import { getNow } from '@scspace-server/common/utils';
import { IDataResponse } from '@scspace-depot/types/common/common.type';
import { MAX_RENTAL_LIMIT, MAX_RENTAL_LIMIT_ORGANIZATION } from "@scspace-depot/consts/rental.const";
import { RentalStatusEnum } from "@scspace-depot/enums/rental.enum";

@Injectable()
export class RentalRepository {
    constructor(
        @Inject(DBAsyncProvider) private readonly db: MySql2Database<typeof schema>,
    ) { }

    // Rental CRUD operations
    async createRental(rental: IRentalCreate): Promise<number> {
        const result = await this.db.insert(Rental).values({
            ...rental,
            timeReturn: 0, //not returned
            certName: "Certificate Path Here Soon",
        });
        return result[0].insertId;
    }

    async fetchRentalById(id: number): Promise<typeof Rental.$inferSelect | null> {
        const result = await this.db.select().from(Rental).where(eq(Rental.id, id));
        return result[0] || null;
    }

    //isActive << when the rental is currently not returned.
    async fetchRentalsByUserId(
        userId: number,
        isActive?: boolean,
        onlyIndividual? : boolean,
        limit: number = 50,
        offset: number = 0
    ): Promise<IDataResponse<typeof Rental.$inferSelect[]>> {
        const whereClause: SQL[] = [eq(Rental.userId, userId)];

        if (isActive !== undefined) {
            if (isActive) {
                whereClause.push(eq(Rental.status, RentalStatusEnum.RENTED));
            } else {
                whereClause.push(ne(Rental.status, RentalStatusEnum.RENTED,));
            }
        }

        //if true, only fetch rentals belonging to individual.
        if (onlyIndividual != undefined) {
            if (onlyIndividual) {
                whereClause.push(eq(Rental.organizationId, 1))
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

    async fetchRentalsByOrganizationId(
        organizationId: number,
        isActive?: boolean,
        limit: number = 50,
        offset: number = 0
    ): Promise<IDataResponse<typeof Rental.$inferSelect[]>> {
        const whereClause: SQL[] = [eq(Rental.organizationId, organizationId)];

        if (isActive !== undefined) {
            if (isActive) {
                whereClause.push(eq(Rental.status, RentalStatusEnum.RENTED));
            } else {
                whereClause.push(ne(Rental.status, RentalStatusEnum.RENTED));
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

    async fetchRentalsFull(
        userId: number,
        orgIds: number[], //orgId 직접 fetch해서 넘겨줘야함 !
        isActive?: boolean,
        limit: number = 50,
        offset: number = 0
    ): Promise<IDataResponse<typeof Rental.$inferSelect[]>> {

        // orgId = 1 제거
        const filteredOrgIds = orgIds.filter(id => id !== 1);

        // organization 조건
        // filteredOrgIds가 빈 배열이면 inArray 생성 불가능 -> 알아서 스킵하도록 undefined
        const orgCondition =
            filteredOrgIds.length > 0
                ? inArray(Rental.organizationId, filteredOrgIds)
                : undefined;

        // where 조건 구성
        const whereClause: SQL[] = [
            or(
                eq(Rental.userId, userId),
                orgCondition
            )
        ];

        // isActive 필터
        if (isActive !== undefined) {
            if (isActive) {
                whereClause.push(eq(Rental.status, RentalStatusEnum.RENTED));
            } else {
                whereClause.push(ne(Rental.status, RentalStatusEnum.RENTED));
            }
        }

        // 병렬 조회
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

    //return rental
    async returnRental(id: number, timeReturn: number, returnWorkerId : number): Promise<void> {
        await this.db.update(Rental).set({ timeReturn, returnWorkerId }).where(eq(Rental.id, id));
    }

    //delete rental
    async deleteRental(id: number): Promise<void> {
        await this.db.delete(Rental).where(eq(Rental.id, id));
    }

    // *** Goods CRUD operations ***
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
        return this.db.select()
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
        const { goodsId, count: requestedCount} = check;

        // 해당 물품 정보 조회
        const goods = await this.fetchGoodsById(goodsId);
        if (!goods) {
            throw new NotFoundException('Goods not found');
        }

        //로직 단순화 : countNow와 비교만 하면 됨. 예약 대여제가 없기 때문에..
        return goods.countNow < requestedCount;
    }


    // 각 상황별로 분리된 검사 함수들

    //rental 최대 개수 제한 - USER
    async checkRentalLimit(userId: number): Promise<boolean> {
        const countRental = await this.db
            .select({ totalCount: count() })
            .from(Rental)
            .where(and(
                eq(Rental.userId, userId),
                eq(Rental.status, RentalStatusEnum.RENTED)
            ))
            .then(res => res[0]?.totalCount || 0);

        return countRental < MAX_RENTAL_LIMIT;
    }

    async checkRentalLimitByOrganization(organizationId: number): Promise<boolean> {
        const countRental = await this.db
            .select({ totalCount: count() })
            .from(Rental)
            .where(and(
                eq(Rental.organizationId, organizationId),
                eq(Rental.status, RentalStatusEnum.RENTED)
            ))
            .then(res => res[0]?.totalCount || 0);

        return countRental < MAX_RENTAL_LIMIT_ORGANIZATION;
    }

    //현재 overdue 존재 여부 - 개인일 경우 orgId = 1
    async checkCurrentOverdue(userId: number, orgId: number): Promise<boolean> {
        const now = getNow();
        const overdueCount = await this.db
            .select({ totalCount: count() })
            .from(Rental)
            .where(and(
                eq(Rental.userId, userId),
                eq(Rental.status, RentalStatusEnum.RENTED),  // 아직 반납하지 않음
                lt(Rental.timeDue, now)    // 기한이 지남
            ))
            .then(res => res[0]?.totalCount || 0);

        if (orgId === 1) return overdueCount === 0;

        const overdueCountByOrg = await this.db
            .select({ totalCount: count() })
            .from(Rental)
            .where(and(
                eq(Rental.organizationId, orgId),
                eq(Rental.status, RentalStatusEnum.RENTED),
                lt(Rental.timeDue, now)
            ))
            .then(res => res[0]?.totalCount || 0);

        return overdueCount === 0 && overdueCountByOrg === 0;
    }

    /**
     * @deprecated - Confirm 절차 삭제됨
     */
    // async checkUnconfirmedOverdueReturns(userId: number): Promise<boolean> {
    //     const unconfirmedOverdueCount = await this.db
    //         .select({ totalCount: count() })
    //         .from(Rental)
    //         .where(and(
    //             eq(Rental.userId, userId),
    //             gt(Rental.timeReturn, 0),   // 반납은 했음
    //             // eq(Rental.timeConfirm, 0),  // @deprecated "timeConfirm"
    //             lt(Rental.timeDue, Rental.timeReturn)  // 연체된 반납 (due < return)
    //         ))
    //         .then(res => res[0]?.totalCount || 0);
    //
    //     return unconfirmedOverdueCount === 0;
    // }

    /**
     * @deprecated
     * 현재 overdue 중에만 신규 대여 불가
     * 향후 보증금 받으면 또 바뀔 예정
     */
    // async checkUserOverduePenalty(userId: number): Promise<boolean> {
    //     const now = getNow();
    //
    //     // User 테이블에서 timeOverdue 확인
    //     const userResult = await this.db
    //         .select({ timeOverdue: User.timeOverdue })
    //         .from(User)
    //         .where(eq(User.id, userId))
    //         .limit(1);
    //
    //     if (userResult.length === 0) {
    //         return false; // 사용자를 찾을 수 없음
    //     }
    //
    //     const user = userResult[0];
    //
    //     // timeOverdue가 0이거나 현재 시간이 timeOverdue를 지났으면 대여 가능
    //     return user.timeOverdue === 0 || now > user.timeOverdue;
    // }

    // Get overdue rentals
    async getOverdueRentals(): Promise<typeof Rental.$inferSelect[]> {
        const now = getNow();
        return this.db
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
