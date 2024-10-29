import axios from 'axios';
import { toast } from 'react-toastify';
import { requests } from '../requests/requests';


export const uploadFileToS3 = async (file: any, fileObj: any, onProgress: ((progress: number) => void ) | null): Promise<any> => {
    const token = localStorage.getItem('authorization');

    const headers = {
        'Authorization': `Bearer ` + token
    };

    return axios.post(`${requests.documentPreSigned}`, fileObj, { 
        headers,        
        onUploadProgress: (progressEvent: any) => {
            // Handle upload progress if needed
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        } 
    })
        .then(response => {
                return response?.data?.data
            }).then(result => { 

                const headers = {
                    'Content-Type': fileObj?.mimeType
                };
                return axios.put(`${result?.presignedUrl}`, file, { 
                    headers,      
                    onUploadProgress: (progressEvent:any) => {
                        // Handle upload progress if needed
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        onProgress !== null && onProgress(progress)
                    } 
                })
                
                .then(res => {
                        fileObj = { ...fileObj, fileName: result?.fileName, fileDescriptor: result?.filedescriptor };
                        return fileObj
                    }).then(res2 => {
                        const headers = {
                            'Authorization': `Bearer ` + token
                        };
                        return axios.post(`${requests.documentPostSigned}`, fileObj, { 
                            headers,        
                            onUploadProgress: (progressEvent:any) => {
                                // Handle upload progress if needed
                                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                                // onProgress !== null && onProgress(progress)
                            } 
                        }).then(res3 => {
                            const fileRes = res3?.data ? res3?.data?.data : {}
                            return fileRes?.id
                    })
                }).catch(err => {
                    console.warn(err);
                    toast.error(err ? err : 'Something went wrong, please try again')
                });
    });

}