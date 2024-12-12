'use client';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { FileUploadProps } from '@/services/interfaces/interface';
import GlobalLoader from '../GlobalLoader/GlobalLoader';
import { Icon } from '@iconify/react/dist/iconify.js';

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect,accept, label, showPreview, type}) => {
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loadingFile, setLoadingFile] = useState<boolean>(false);
    

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

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const fileArray: File[] = files ? Array.from(files) : [];

        if (fileArray.length > 0) {
            setLoadingFile(true);

            const fileObjs = fileArray.map(file => ({
                fileName: file.name,
                mimeType: file.type,
                fileSize: file.size / 1024,
            }));

            try {
                const uploadedFileIds = await onFileSelect(fileArray, fileObjs, (progress: number) => {
                    // console.log(`Upload progress: ${progress}%`);
                });

                if (uploadedFileIds.length > 0) {
                    // console.log('Uploaded file IDs:', uploadedFileIds);
                } else {
                    toast.error('No files uploaded successfully.');
                }

                // Handle preview
                if (showPreview) {
                    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
                    const imagePreviews = imageFiles.map(file => URL.createObjectURL(file));
                    setPreview(imagePreviews[0]);
                }
            } catch (err) {
                console.warn(err);
                toast.error('Something went wrong while uploading the files, please try again.');
            } finally {
                setLoadingFile(false);
            }
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
            {type==="msg" && <label htmlFor="file-input"><Icon  className='attach-icon' icon="fluent:attach-16-regular"/></label>}
            {type==="task" && <label htmlFor="file-input" className="btn bg-black text-light fs-12">
              {loadingFile ? (
                    <>
                    <span className="text-white">Loading...</span>
                    {loadingFile && <GlobalLoader/>}
                    </>
                ) : selectedFile ? (
                    selectedFile.name
                ) : (
                    label
                )}
            </label>}

            {showPreview && preview && (
                <div className="preview-container">
                    <img src={preview} alt="Preview" className="preview-image" />
                </div>
            )}
        </div>
    );
};

export default FileUpload;
