import { diskStorage } from 'multer';
import { extname } from 'path';
import { PRIVATE_FOLDER, PUBLIC_FOLDER } from "@scspace-depot/consts/file.const";

export const privateStorage = diskStorage({
    destination: PRIVATE_FOLDER, // 저장 폴더
    filename: (req, file, cb) => {
        const unique = (new Date()).toISOString().replace('T', '-').replaceAll(':', '-').replace('Z', '') + '_' + file.filename;
        cb(null, `${unique}${extname(file.originalname)}`);
    },
});

export const publicStorage = diskStorage({
    destination: PUBLIC_FOLDER, // 저장 폴더
    filename: (req, file, cb) => {
        const unique = crypto.randomUUID();
        cb(null, `${unique}${extname(file.originalname)}`);
    },
});