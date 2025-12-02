import { requests } from "@/services/requests/requests";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const contactUs = async (contact:any): Promise<any> => {
    const response = await axios.post(requests.contactUs , contact);
    return response.data
}

export const useContactUs = () => {
    return useMutation({
        mutationFn: contactUs,
    });
};