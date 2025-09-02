import axios from 'axios';
import { toast } from 'react-toastify';
import { requests } from '../requests/requests';

export const uploadFileToS3 = async (files: any, fileObjs: any, onProgress: ((progress: number) => void ) | null, isPublic: boolean): Promise<any> => {
    const token = localStorage.getItem('accessToken');

    const headers = {
        'Authorization': `Bearer ` + token
    };

    // try {
    //     const presignedUrlsResponse = await axios.get(
    //         `${requests.documentPreSigned}${isPublic ? '/public' : '/private'}`,
    //         {
    //             params: { count: files?.length },
    //             headers,        
    //             onUploadProgress: (progressEvent: any) => {
    //                 const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
    //             }
    //         }
    //     );

    //     const presignedUrls = presignedUrlsResponse?.data;

    //     if (!presignedUrls || presignedUrls?.length !== files?.length) {
    //         throw new Error('Mismatch between number of files and number of presigned URLs.');
    //     }

    //     const uploadedFiles = [];

    //     // Using a for...of loop to handle async operations one by one
    //     for (let index = 0; index < files.length; index++) {
    //         console.log('Uploading file', index + 1, 'of', files[index]);
    //         const file = files[index];
    //         const fileObj = fileObjs[index];
    //         const presignedUrl = presignedUrls[index].presignedUrl;
    //         const fileUrl = presignedUrls[index].fileUrl;

    //         try {
    //             const response = await axios.put(presignedUrl, file, {
    //                 headers: {
    //                     'Content-Type': fileObj.mimeType, // The file mime type must match
    //                 },
    //                 onUploadProgress: (progressEvent: any) => {
    //                     const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
    //                     if (onProgress) onProgress(progress); // Update progress if provided
    //                 },
    //             });

    //             // Add file info to uploadedFiles array
    //             uploadedFiles.push({
    //                 // ...fileObj,
    //                 key: fileObj.fileName,
    //                 fileUrl: fileUrl
    //             });
                
    //         } catch (err: any) {
    //             console.warn(err);
    //             toast.error(err?.message || 'Something went wrong while uploading the file, please try again');
    //             throw err; // Stop further uploads if one fails
    //         }
    //     }

    //     return uploadedFiles;
    // } catch (err:any) {
    //     console.warn(err);
    //     toast.error(err?.message || 'Something went wrong, please try again');
    //     throw err;
    // }

    /* new logic for upload file into S3 bucket */
    
    const formData = new FormData();
    if(files?.length > 0) {
        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }
    }
    
    try {

        const response = await axios.post(
            `${requests.documentPreSigned}${isPublic ? '/public' : '/private'}?count=${files?.length}`,
            formData,
            {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data',
                },        
                onUploadProgress: (progressEvent: any) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    if (onProgress) onProgress(progress);
                }
            }
        );

        console.log('File upload response:', response);
        const uploadedFiles:any[] = [];

        if(response?.data?.length > 0) {
            response?.data.forEach((fileData: any, index: number) => {
                uploadedFiles.push({
                    key: fileData.fileName,
                    fileUrl: fileData.fileUrl
                });
            });
        }

        return uploadedFiles;
    } catch (err:any) {
        console.warn(err);
        toast.error(err?.message || 'Something went wrong, please try again');
        throw err;
    }
}