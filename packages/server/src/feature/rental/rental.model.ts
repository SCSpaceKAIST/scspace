import { IRental, IGoods } from '@scspace-depot/types/rental';
import { Rental, Goods, schema } from '@schema';

export class MRental implements IRental {
    id: IRental['id'];
    userId: IRental['userId'];
    organizationId: IRental['organizationId'];
    rentalWorkerId: IRental['rentalWorkerId'];
    returnWorkerId: IRental['returnWorkerId'];
    goodsId: IRental['goodsId'];
    count: IRental['count'];
    timeBorrow: IRental['timeBorrow'];
    timeDue: IRental['timeDue'];
    timeReturn: IRental['timeReturn'];
    certName: IRental['certName'];
    status: IRental['status'];

    constructor(data: IRental) {
        this.id = data.id;
        this.userId = data.userId;
        this.organizationId = data.organizationId;
        this.rentalWorkerId = data.rentalWorkerId;
        this.returnWorkerId = data.returnWorkerId;
        this.goodsId = data.goodsId;
        this.count = data.count;
        this.timeBorrow = data.timeBorrow;
        this.timeDue = data.timeDue;
        this.timeReturn = data.timeReturn;
        this.certName = data.certName;
        this.status = data.status;
    }

    static fromDB(rental: typeof Rental.$inferSelect): IRental {
        return {
            id: rental.id,
            userId: rental.userId,
            organizationId: rental.organizationId,
            rentalWorkerId: rental.rentalWorkerId,
            returnWorkerId: rental.returnWorkerId,
            goodsId: rental.goodsId,
            count: rental.count,
            timeBorrow: rental.timeBorrow,
            timeDue: rental.timeDue,
            timeReturn: rental.timeReturn,
            certName: rental.certName,
            status: rental.status,
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
