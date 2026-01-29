import axios from 'axios';
import { toast } from 'react-toastify';
import { requests } from '../requests/requests';

export const uploadFileToS3 = async (files: any, fileObjs: any, onProgress: ((progress: number) => void ) | null, isPublic: boolean): Promise<any> => {
    const token = localStorage.getItem('accessToken');

    const headers = {
        'Authorization': `Bearer ` + token
    };

    // File size validation - 5MB limit
    const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
    
    // Check file sizes before proceeding
    const filesToCheck = Array.isArray(files) ? files : [files];
    for (const file of filesToCheck) {
        if (file.size > maxFileSize) {
            toast.error('Your file size is exceed 5MB');
            throw new Error('File size exceeds 5MB limit');
        }
    }

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
    
    // Handle both single file and array of files
    if (Array.isArray(files)) {
        files.forEach((file) => {
            formData.append('file', file);
        });
    } else {
        formData.append('file', files);
    }
    try {

        const response = isPublic ? await axios.post(
            `${requests.documentPreSigned}${isPublic ? '/public' : '/private'}?count=${Array.isArray(files) ? files.length : 1}`,
            formData,
            {
                headers: {
                    ...headers,
                },        
                onUploadProgress: (progressEvent: any) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    if (onProgress) onProgress(progress);
                }
            }
        ): await axios.get(
            `${requests.documentPreSigned}${isPublic ? '/public' : '/private'}`,
            {
                params: { count: files?.length },
                headers,        
                onUploadProgress: (progressEvent: any) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                }
            }
        );

        console.log('File upload response:', response);
        const uploadedFiles:any[] = [];

        if(response?.data?.length > 0) {
            response?.data.forEach((fileData: any, index: number) => {
                // Use fileName from API response if available, otherwise use original file name from fileObjs
                const fileName = fileData.fileName || fileObjs[index]?.fileName || 'Unknown file';
                uploadedFiles.push({
                    key: fileName,
                    fileUrl: fileData.fileUrl
                });
            });
        } else if (response?.data && !Array.isArray(response?.data)) {
            // Handle single file response (non-array)
            const fileData = response.data;
            const fileName = fileData.fileName || fileObjs[0]?.fileName || 'Unknown file';
            uploadedFiles.push({
                key: fileName,
                fileUrl: fileData.fileUrl
            });
        }

        return uploadedFiles;
    } catch (err:any) {
        console.warn(err);
        if (err?.message && err.message.includes('File size exceeds 5MB limit')) {
            throw err; // Re-throw without showing another toast
        }
        toast.error(err?.message || 'Something went wrong, please try again');
        throw err;
    }
}