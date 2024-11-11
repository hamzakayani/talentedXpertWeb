'use client'
import { FileUploadProps } from '@/services/interfaces/interface';
import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify';

const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    accept = 'image/*,application/pdf',
    label = 'Upload File',
    showPreview = false,
    // setAttachmentError
}) => {
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const validateFile = (file: File) => {
        const fileSize = file.size / 1024;
        if (fileSize > 2000) {
            toast.error('File size exceeds 2 MB');
            return false;
        }

        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!['pdf', 'doc', 'docx'].includes(extension || '')) {
            toast.error('File must be a doc, docx, or pdf');
            return false;
        }

        return true;
    };

    // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (!file) return;

    //     if (validateFile(file)) {
    //         setSelectedFile(file);
    //         if (showPreview && file.type.startsWith('image/')) {
    //             const fileURL = URL.createObjectURL(file);
    //             setPreview(fileURL);
    //         }
    //         try {
    //             const fileObj = { fileName: file.name, mimeType: file.type, fileSize: file.size / 1024 };
    //             const res = await onFileSelect(file, fileObj, null);
    //             if (res <= 0) {
    //                 toast.error('Something went wrong while uploading the file, please try again');
    //             }
    //         } catch (err) {
    //             console.warn(err);
    //         }
    //     }
    // };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;    
        const fileArray: File[] = files ? Array.from(files) : [];
    
        if (fileArray.length > 0) {
            const fileObjs = fileArray.map(file => ({
                fileName: file.name,
                mimeType: file.type,
                fileSize: file.size / 1024
            }));
    
            try {
                const uploadedFileIds = await onFileSelect(fileArray, fileObjs, (progress: number) => {
                    console.log(`Upload progress: ${progress}%`);
                });
    
                if (uploadedFileIds.length > 0) {
                    console.log('Uploaded file IDs:', uploadedFileIds);
                } else {
                    toast.error('No files uploaded successfully.');
                }
            } catch (err) {
                console.warn(err);
                toast.error('Something went wrong while uploading the files, please try again.');
            }
        }
    }; 
    
    const handleClick = (event: any) => {
        if (hiddenFileInput.current != null) {
            hiddenFileInput.current.click();
        }
    };

    return (
        <div className="file-upload-wrapper">
            <input
                hidden
                type="file"
                id="file-input"
                accept={accept}
                onChange={handleFileChange}
                className="file-input"
                multiple
            />
            <label htmlFor="file-input" className="btn bg-black text-light fs-12">
                {selectedFile ? selectedFile.name : label}
            </label>

            {showPreview && preview && (
                <div className="preview-container">
                    <img src={preview} alt="Preview" className="preview-image" />
                </div>
            )}
        </div>
    );
};

export default FileUpload;

