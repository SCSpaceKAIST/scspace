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
        // return await fetch(
        //     `/file/download?filename=${encodeURIComponent(filename)}`,
        //     {
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         credentials: 'include',
        //     }
        // ).then(r => r.json());
        const res = await fetch(
            `/file/download?filename=${encodeURIComponent(filename)}`,
            {
                method: 'GET',
                credentials: 'include',
            }
        );

        if (!res.ok) throw new Error("Download failed");

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;

        document.body.appendChild(a);

        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
    }

    return { uploadFile, uploadPublicFile, downloadFile };
}