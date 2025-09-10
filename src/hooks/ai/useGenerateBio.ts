import { useMutation } from "@tanstack/react-query";
import { requests } from "@/services/requests/requests";
import axios from "axios";

interface GenerateBioPayload {
    prompt: string;
}

const bio = async (payload: GenerateBioPayload):Promise<any> => {
    const response = await axios.post(`${requests.createBio}`, payload);
    return response;
};

export const useGenerateBio = () => {
    return useMutation({
        mutationFn: bio,
    });
};