import { IFileUploadPublicResponse, IFileUploadResponse } from "@scspace-depot/types/file";
import { useFormDataMutation } from "./api";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export function useFileAPI() {
    const uploadFile = useFormDataMutation<IFileUploadResponse>(
        "/file/upload",
        'POST'
    ).mutateAsync;

    const uploadPublicFile = useFormDataMutation<IFileUploadPublicResponse>(
        "/file/upload/public",
        'POST'
    ).mutateAsync;

    const downloadFile = async (param: {
        filename: string;
        displayName?: string;
        isPublic?: boolean;
    }): Promise<void> => {
        const res = await fetch(
            `${baseUrl}/file/download?${new URLSearchParams(Object.entries(param).map(([k, v]) => [k, v.toString()]))}`,
            {
                method: 'GET',
                credentials: 'include',
            }
        );

        if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = param.displayName ?? param.filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } else {
            throw new Error('파일 다운로드 실패: ' + res.status);
        }
    }

    return { uploadFile, uploadPublicFile, downloadFile };
}