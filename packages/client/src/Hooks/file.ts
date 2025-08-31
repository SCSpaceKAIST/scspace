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

    const downloadFile = async (filename: string) => {
        return await fetch(
            // `/file/download?filename=${encodeURIComponent(filename)}`, 임시 << 일단해봄
            `/file/download?filename=${filename}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            }
        ).then(r => r.json());
    }

    return { uploadFile, uploadPublicFile, downloadFile };
}