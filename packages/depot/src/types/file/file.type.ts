export interface IFile {
    originalName: string;
    filename: string;
    size: number;
    mimetype: string;
}

export type IFilePublic = IFile & {
    url: string;
};

export interface IFileUploadResponse {
    success: boolean;
    files: IFile[];
}

export interface IFileUploadPublicResponse {
    success: boolean;
    files: IFilePublic[];
}
