import { diskStorage } from 'multer';
import { extname, basename } from 'path';
import { PRIVATE_FOLDER, PUBLIC_FOLDER } from "@scspace-depot/consts/file.const";

export const privateStorage = diskStorage({
    destination: PRIVATE_FOLDER, // 저장 폴더
    filename: (req, file, cb) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const nameWithoutExt = basename(file.originalname, extname(file.originalname));
        const unique = (new Date()).toISOString().replace('T', '-').replaceAll(':', '-').replace('Z', '').replace('.', '-') + '_' + nameWithoutExt;
        cb(null, `${unique}${extname(file.originalname)}`);
    },
});

export const publicStorage = diskStorage({
    destination: PUBLIC_FOLDER, // 저장 폴더
    filename: (req, file, cb) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const nameWithoutExt = basename(file.originalname, extname(file.originalname));
        const unique = (new Date()).toISOString().replace('T', '-').replaceAll(':', '-').replace('Z', '').replace('.', '-') + '_' + nameWithoutExt;
        cb(null, `${unique}${extname(file.originalname)}`);
    },
});
