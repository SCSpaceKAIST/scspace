// Table: goods
export interface IGoods {
    id: number;
    name: string;
    description: string | null;
    countAll: number;
    countNow: number;
    imageURI: string | null; // string -> string | null로 수정
}

export type IGoodsCreate = Omit<IGoods, "id" | "countNow">;

export type IGoodsUpdate = Partial<Omit<IGoods, "id">>;

// 물품 재고 업데이트
export type IGoodsStockUpdate = {
    id: number;
    countNow: number;
};

// 물품 검색 필터
export type IGoodsFilter = {
    name?: string;
    available?: boolean; // countNow > 0인 것만
    limit?: number;
    offset?: number;
};
