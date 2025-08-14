interface CapacityResponse {
    success: boolean;
    message: string;
    data: {
        canStart: boolean;
        reason?: string;
        tokenBalance: number;
        activeJobs: number;
        availableTokens: number;
    };
    statusCode: number;
}

export async function checkAnalysisCapacity(sessionId: string): Promise<CapacityResponse> {
    const { default: axios } = await import("axios");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "";
    const endpoint = `${baseUrl}/v2/analyze/capacity`;

    try {
        const response = await axios.get(endpoint, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionId}`,
            },
        });

        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Failed to check analysis capacity"
        );
    }
}
