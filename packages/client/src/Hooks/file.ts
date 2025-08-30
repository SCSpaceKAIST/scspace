import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IFileUploadPublicResponse, IFileUploadResponse } from "@scspace-depot/types/file";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const useFileSender = <ResponseType>(endpoint: string) => {
    const queryClient = useQueryClient();

    return useMutation<
        ResponseType,
        Error,
        FormData
    >({
        mutationFn: async (formData: FormData) => {
            const res = await fetch(`${baseUrl}${endpoint}`, {
                method: "POST",
                credentials: "include",
                body: formData
            });

            if (!res.ok) {
                let errorMessage = res.statusText;

                try {
                    const errorData = await res.json();
                    errorMessage = errorData.message || errorData.error || res.statusText;
                    console.log(errorData, errorMessage);
                } catch (parseError) {
                    console.log("JSON parsing fail");
                }

                throw new Error(errorMessage);
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [endpoint] });
        },
    });
}

export function useFileAPI() {
    const uploadFile = useFileSender<IFileUploadResponse>("/file/upload").mutateAsync;

    const uploadPublicFile = useFileSender<IFileUploadPublicResponse>("/file/upload/public").mutateAsync;

    return { uploadFile, uploadPublicFile };
}