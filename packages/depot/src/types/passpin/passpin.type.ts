//space's passpin
export interface IPasspinSpace {
    spaceId : number;
    currentPin : IPasspin;
    previousPin : IPasspin | null;
    changedAt : number;
}


//same with db's schema - single passpin
export interface IPasspin {
    id : number;
    spaceId : number;
    pin : string;
    status : number;
    timeCreated : number;
}
