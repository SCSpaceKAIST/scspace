import { IFileUploadPublicResponse, IFileUploadResponse } from "@scspace-depot/types/file";
import { useFormDataMutation } from "./api";

export function useFileAPI() {
    const uploadFile = useFormDataMutation<IFileUploadResponse>(
        "/file/upload"
    ).mutateAsync;

    const uploadPublicFile = useFormDataMutation<IFileUploadPublicResponse>(
        "/file/upload/public"
    ).mutateAsync;

    return { uploadFile, uploadPublicFile };
}