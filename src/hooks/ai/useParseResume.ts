import { requests } from "@/services/requests/requests";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface ResumeParsePayload {
  fileUrl: string;
}

interface ResumeParseResponse {
    data: {
        result: {
            file: string;
            parsed_data: any;
        };
        error?: { message: string };
    };
}

const parseResume = async (payload: ResumeParsePayload): Promise<ResumeParseResponse> => {
    const response = await axios.post(`${requests.cvParser}`, payload);
    return response.data;
};

export const useParseResume = () => {
    return useMutation({
        mutationFn: parseResume,
    });
};