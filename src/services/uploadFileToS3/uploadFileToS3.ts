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

    const fileList = Array.isArray(files) ? files : [files];
    const fileObjList = Array.isArray(fileObjs) ? fileObjs : [fileObjs];

    try {
        if (isPublic) {
            const formData = new FormData();
            fileList.forEach((file) => formData.append("file", file));

            const response = await axios.post(
                `${requests.documentPreSigned}/public?count=${fileList.length}`,
                formData,
                {
                    headers: { ...headers },
                    onUploadProgress: (progressEvent: any) => {
                        const progress = Math.round(
                            (progressEvent.loaded / progressEvent.total) * 100
                        );
                        if (onProgress) onProgress(progress);
                    },
                }
            );

            const uploadedFiles: any[] = [];
            const payload = response?.data;
            const rows = Array.isArray(payload) ? payload : payload ? [payload] : [];

            rows.forEach((fileData: any, index: number) => {
                uploadedFiles.push({
                    key:
                        fileData.fileName ||
                        fileObjList[index]?.fileName ||
                        "Unknown file",
                    fileUrl: fileData.fileUrl,
                });
            });

            return uploadedFiles;
        }

        // Private chat/docs: get presigned PUT URLs, then upload bytes to S3.
        const presignedUrlsResponse = await axios.get(
            `${requests.documentPreSigned}/private`,
            {
                params: { count: fileList.length },
                headers,
            }
        );

        const presignedUrls = presignedUrlsResponse?.data;
        if (!presignedUrls || presignedUrls.length !== fileList.length) {
            throw new Error(
                "Mismatch between number of files and number of presigned URLs."
            );
        }

        const uploadedFiles: any[] = [];
        for (let index = 0; index < fileList.length; index++) {
            const file = fileList[index];
            const fileObj = fileObjList[index];
            const presignedUrl = presignedUrls[index].presignedUrl;
            const fileUrl = presignedUrls[index].fileUrl;

            // Presigned S3 URL must not include app Bearer token (global axios defaults add it).
            const uploadResponse = await fetch(presignedUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": fileObj?.mimeType || file.type || "application/octet-stream",
                },
            });
            if (!uploadResponse.ok) {
                throw new Error(`S3 upload failed with status ${uploadResponse.status}`);
            }
            if (onProgress) onProgress(100);

            uploadedFiles.push({
                key: fileObj?.fileName || file.name || "Unknown file",
                fileUrl,
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