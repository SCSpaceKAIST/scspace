import { UserAuthBinaryEnum } from "../enums/user.enum";

export const isAdmin = (auth: number) => {
    return (auth & UserAuthBinaryEnum.ADMIN) === UserAuthBinaryEnum.ADMIN;
}

export const isManager = (auth: number) => {
    return (auth & UserAuthBinaryEnum.MANAGER) === UserAuthBinaryEnum.MANAGER;
}

export const isWorker = (auth: number) => {
    return (auth & UserAuthBinaryEnum.WORKER) === UserAuthBinaryEnum.WORKER;
}

export const isPasspinMaster = (auth: number) => {
    return (auth & UserAuthBinaryEnum.PASSPIN_MASTER) === UserAuthBinaryEnum.PASSPIN_MASTER;
}

export const isUser = (auth: number) => {
    return (auth & UserAuthBinaryEnum.USER) === UserAuthBinaryEnum.USER;
}
