export function getErrorMessage(error: unknown, fallback = "다시 시도해주세요"): string {
    if (error instanceof Error && error.message.trim()) {
        return error.message;
    }

    if (typeof error === "object" && error !== null) {
        const candidate = error as {
            message?: unknown;
            error?: unknown;
            response?: { data?: { message?: unknown; error?: unknown } };
        };

        const nestedMessage = candidate.response?.data?.message;
        if (typeof nestedMessage === "string" && nestedMessage.trim()) {
            return nestedMessage;
        }

        const nestedError = candidate.response?.data?.error;
        if (typeof nestedError === "string" && nestedError.trim()) {
            return nestedError;
        }

        if (typeof candidate.message === "string" && candidate.message.trim()) {
            return candidate.message;
        }

        if (typeof candidate.error === "string" && candidate.error.trim()) {
            return candidate.error;
        }
    }

    return fallback;
}
