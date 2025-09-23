import { UserAuthBinaryEnum } from "../enums/user.enum";

const isUser = (auth: number): boolean => {
    return Boolean(auth & UserAuthBinaryEnum.USER) || isManager(auth);
}

const isManager = (auth: number): boolean => {
    return Boolean(auth & UserAuthBinaryEnum.MANAGER) || isAdmin(auth);
}

const isAdmin = (auth: number): boolean => {
    return Boolean(auth & UserAuthBinaryEnum.ADMIN);
}

const isWorker = (auth: number): boolean => {
    return Boolean(auth & UserAuthBinaryEnum.WORKER);
}

const isPasspinMaster = (auth: number): boolean => {
    return Boolean(auth & UserAuthBinaryEnum.PASSPIN_MASTER);
}

const isBasicUser = (auth: number): boolean => {
    return auth === UserAuthBinaryEnum.USER;
}

export const UserUtils = {
    isBasicUser,
    isUser,
    isManager,
    isAdmin,
    isWorker,
    isPasspinMaster
};
