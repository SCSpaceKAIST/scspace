import { IUser } from "../user";
import { IGoods } from "./goods.type";

// Table: rental
export interface IRental {
    id: number;
    userId: number;
    goodsId: number;
    count: number;
    timeBorrow: number;
    timeDue: number;
    timeReturn: number;
    timeConfirm: number;
}

export type IRentalAll = IRental & {
    user: IUser;
    goods: IGoods;
};

export type IRentalCreate = Pick<
    IRental,
    "userId" | "goodsId" | "count"
>;

export type IRentalCreateClient = Omit<
    IRentalCreate,
    "userId"
>;

export type IRentalUpdate = Partial<Omit<
    IRental,
    "id" | "userId" | "goodsId"
>> & {
    id: number;
};

// 반납 처리
export type IRentalReturn = {
    id: number;
    timeReturn: number;
};

// 반납 확인 처리
export type IRentalConfirm = {
    id: number;
    timeConfirm: number;
};

// 대여 가능 여부 체크
export type IGoodsAvailabilityCheck = {
    goodsId: number;
    count: number;
    timeBorrow: number;
    timeDue: number;
};

// 사용자 대여 현황 조회
export type IUserRentalStatus = {
    userId: number;
    isActive?: boolean; // true면 현재 대여중인 것만, false면 모든 대여 기록
};
