import { diskStorage } from 'multer';
import { extname } from 'path';

export const fileStorage = diskStorage({
    destination: './uploads/files', // 저장 폴더
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${unique}${extname(file.originalname)}`);
    },
});