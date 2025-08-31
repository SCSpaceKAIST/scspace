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
    certName: string;
}

export type IRentalAll = IRental & {
    user: IUser;
    goods: IGoods;
};

export type IRentalCreate = Pick<
    IRental,
    "userId" | "goodsId" | "count" | "timeBorrow" | "timeDue"
>;

export type IRentalCreateClient = Pick<
    IRentalCreate,
    "count" | "goodsId"
>;

export type IRentalUpdate = Partial<Pick<
    IRental,
    "timeReturn" | "timeConfirm"
>> & {
    id: number;
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
