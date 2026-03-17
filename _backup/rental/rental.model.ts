import { IRental, IGoods } from '@scspace-depot/types/rental';
import { Rental, Goods, schema } from '@schema';

export class MRental implements IRental {
    id: IRental['id'];
    userId: IRental['userId'];
    goodsId: IRental['goodsId'];
    count: IRental['count'];
    timeBorrow: IRental['timeBorrow'];
    timeDue: IRental['timeDue'];
    timeReturn: IRental['timeReturn'];
    timeConfirm: IRental['timeConfirm'];
    certName: IRental['certName'];

    constructor(data: IRental) {
        this.id = data.id;
        this.userId = data.userId;
        this.goodsId = data.goodsId;
        this.count = data.count;
        this.timeBorrow = data.timeBorrow;
        this.timeDue = data.timeDue;
        this.timeReturn = data.timeReturn;
        this.timeConfirm = data.timeConfirm;
        this.certName = data.certName;
    }

    static fromDB(rental: typeof Rental.$inferSelect): IRental {
        return {
            id: rental.id,
            userId: rental.userId,
            goodsId: rental.goodsId,
            count: rental.count,
            timeBorrow: rental.timeBorrow,
            timeDue: rental.timeDue,
            timeReturn: rental.timeReturn,
            timeConfirm: rental.timeConfirm,
            certName: rental.certName,
        };
    }
}

export class MGoods implements IGoods {
    id: IGoods['id'];
    name: IGoods['name'];
    description: IGoods['description'];
    countAll: IGoods['countAll'];
    countNow: IGoods['countNow'];
    imageURI: IGoods['imageURI'];

    constructor(data: IGoods) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.countAll = data.countAll;
        this.countNow = data.countNow;
        this.imageURI = data.imageURI;
    }

    static fromDB(goods: typeof Goods.$inferSelect): IGoods {
        return {
            id: goods.id,
            name: goods.name,
            description: goods.description,
            countAll: goods.countAll,
            countNow: goods.countNow,
            imageURI: goods.imageURI,
        };
    }
}
