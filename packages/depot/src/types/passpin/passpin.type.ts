//space's passpin
export interface IPasspinSpace {
    spaceId : number;
    currentPin : IPasspin;
    nextPin : IPasspin
    // changedAt: number;
}


//same with db's schema - single passpin
//사실 timeCreated가 굳이 있어야 하나 싶긴 함 지금 로직에선
export interface IPasspin {
    id : number;
    spaceId : number;
    timeCreated : number;
    pin : string;
    status : number;
}

// export interface IPasspinChange {
//     pastPin : IPasspin; //old
//     newPin : IPasspin; //now use
//     changedAt : number;
// }


export interface IPasspinChangeResponse {
    success : boolean;
    spaceId : number;
    retiredPin : IPasspin; //outdated pin (status 0 => -1)
    promotedPin : IPasspin; //now using pin (status 1 => 0)
    createdNextPin: IPasspin;   //created next pin (new status 1)
}

