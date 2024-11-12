import axios from 'axios';
import { toast } from 'react-toastify';
import { requests } from '../requests/requests';
import { count } from 'console';


// export const uploadFileToS3 = async (file: any, fileObj: any, onProgress: ((progress: number) => void ) | null): Promise<any> => {
//     const token = localStorage.getItem('authorization');

//     const headers = {
//         'Authorization': `Bearer ` + token
//     };

//     return axios.post(`${requests.documentPreSigned}`, fileObj, { 
//         headers,        
//         onUploadProgress: (progressEvent: any) => {
//             // Handle upload progress if needed
//             const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
//         } 
//     })
//         .then(response => {
//                 return response?.data?.data
//             }).then(result => { 

//                 const headers = {
//                     'Content-Type': fileObj?.mimeType
//                 };
//                 return axios.put(`${result?.presignedUrl}`, file, { 
//                     headers,      
//                     onUploadProgress: (progressEvent:any) => {
//                         // Handle upload progress if needed
//                         const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
//                         onProgress !== null && onProgress(progress)
//                     } 
//                 })
                
//                 .then(res => {
//                         fileObj = { ...fileObj, fileName: result?.fileName, fileDescriptor: result?.filedescriptor };
//                         return fileObj
//                     }).then(res2 => {
//                         const headers = {
//                             'Authorization': `Bearer ` + token
//                         };
//                         return axios.post(`${requests.documentPostSigned}`, fileObj, { 
//                             headers,        
//                             onUploadProgress: (progressEvent:any) => {
//                                 // Handle upload progress if needed
//                                 const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
//                                 // onProgress !== null && onProgress(progress)
//                             } 
//                         }).then(res3 => {
//                             const fileRes = res3?.data ? res3?.data?.data : {}
//                             return fileRes?.id
//                     })
//                 }).catch(err => {
//                     console.warn(err);
//                     toast.error(err ? err : 'Something went wrong, please try again')
//                 });
//     });

// }

export const uploadFileToS3 = async (files: any, fileObjs: any, onProgress: ((progress: number) => void ) | null, isPublic: boolean): Promise<any> => {
    const token = localStorage.getItem('authorization');

    const headers = {
        'Authorization': `Bearer ` + token
    };

    try {
        // const params = fileObjs.map((fileObj) => ({
        //     fileName: fileObj.fileName,
        //     mimeType: fileObj.mimeType,
        // }));

        const presignedUrlsResponse = await axios.get(
            `${requests.documentPreSigned}${isPublic ? '/public' : '/private'}`,
            {
                params: { count: files?.length },
                headers,        
                onUploadProgress: (progressEvent: any) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                }
            }
        );

        const presignedUrls = presignedUrlsResponse?.data;

        if (!presignedUrls || presignedUrls.length !== files.length) {
            throw new Error('Mismatch between number of files and number of presigned URLs.');
        }

        const uploadPromises = files.map((file:any, index:number) => {
            const presignedUrl = presignedUrls[index].presignedUrl;
            const fileObj = fileObjs[index];

            return axios.put(presignedUrl, file, {
                headers: {
                    'Content-Type': fileObj.mimeType,
                },
                onUploadProgress: (progressEvent: any) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    onProgress && onProgress(progress); // Track progress if provided
                },
            })
            .then((res) => {

                return {
                    ...fileObj,
                    fileName: presignedUrls[index].fileName,
                    fileDescriptor: presignedUrls[index].fileDescriptor,
                };
            })
            .catch((err) => {
                console.warn(err);
                toast.error(err?.message || 'Something went wrong while uploading the file, please try again');
                throw err;
            });
        });

        console.log("uploaded::", uploadPromises)

        // const uploadedFiles = await Promise.all(uploadPromises);

        // const postFilePromises = uploadedFiles.map((fileObj) => {
        //     return axios.post(
        //         `${requests.documentPostSigned}`,
        //         fileObj,
        //         { headers }
        //     );
        // });

        // const postResponses = await Promise.all(postFilePromises);

        // return postResponses.map((res) => res?.data?.data?.id);
    } catch (err:any) {
        console.warn(err);
        toast.error(err?.message || 'Something went wrong, please try again');
        throw err;
    }

}