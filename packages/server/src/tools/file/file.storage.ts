import { diskStorage } from 'multer';
import { extname, basename } from 'path';
import crypto from 'crypto';
import { PRIVATE_FOLDER, PUBLIC_FOLDER } from "@scspace-depot/consts/file.const";

export const privateStorage = diskStorage({
    destination: PRIVATE_FOLDER, // 저장 폴더
    filename: (req, file, cb) => {
        const nameWithoutExt = basename(file.originalname, extname(file.originalname));
        const unique = (new Date()).toISOString().replace('T', '-').replaceAll(':', '-').replace('Z', '') + '_' + nameWithoutExt;
        cb(null, `${unique}${extname(file.originalname)}`);
    },
});

export const publicStorage = diskStorage({
    destination: PUBLIC_FOLDER, // 저장 폴더
    filename: (req, file, cb) => {
        const nameWithoutExt = basename(file.originalname, extname(file.originalname));
        const unique = (new Date()).toISOString().replace('T', '-').replaceAll(':', '-').replace('Z', '') + '_' + nameWithoutExt;
        cb(null, `${unique}${extname(file.originalname)}`);
    },
});
