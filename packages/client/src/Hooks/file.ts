import { IFileUploadPublicResponse, IFileUploadResponse } from "@scspace-depot/types/file";
import { useFormDataMutation } from "./api";

export function useFileAPI() {
    const uploadFile = useFormDataMutation<IFileUploadResponse>(
        "/file/upload",
        'POST'
    ).mutateAsync;

    const uploadPublicFile = useFormDataMutation<IFileUploadPublicResponse>(
        "/file/upload/public",
        'POST'
    ).mutateAsync;

    return { uploadFile, uploadPublicFile };
}