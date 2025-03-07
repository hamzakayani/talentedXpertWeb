'use client';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { FileUploadProps } from '@/services/interfaces/interface';
import GlobalLoader from '../GlobalLoader/GlobalLoader';
import { Icon } from '@iconify/react/dist/iconify.js';
import Image from 'next/image';
import ImageFallback from '../ImageFallback/ImageFallback';
import { dataURLToBlob } from '@/services/utils/util';
import CropImgModal from '../Modals/CropImageModal';

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, accept, label, showPreview, type, documents }) => {
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loadingFile, setLoadingFile] = useState<boolean>(false);

    const [showCropModal, setShowCropModal] = useState<boolean>(false);
    const [fileMetadata, setFileMetadata] = useState<{ fileName: string, mimeType: string } | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
        if (!files) return;

        const fileArray: File[] = Array.from(files);

        // const fileArray: File[] = files ? Array.from(files) : [];

        if (fileArray.length > 0) {
            setLoadingFile(true);

            const fileObjs = fileArray.map(file => ({
                fileName: file.name,
                mimeType: file.type,
                fileSize: file.size / 1024,
            }));

            if (type === 'img') {
                setFileMetadata(fileObjs[0]);
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.result && typeof reader.result === 'string') {
                        setSelectedImage(reader?.result);
                        setShowCropModal(true);
                    }
                };
                reader.readAsDataURL(files[0]);
                setLoadingFile(false);
                event.target.value = '';
            } else {
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
                    event.target.value = '';
                }
            }
        }
    };

    const handleClick = (event: any) => {
        if (hiddenFileInput.current != null) {
            hiddenFileInput.current.click();
        }
    };

    const handleCropComplete = async (croppedImage: string) => {
        if (!fileMetadata) return;

        const blob = dataURLToBlob(croppedImage);

        const file = new File([blob], fileMetadata.fileName, { type: fileMetadata.mimeType });

        const fileObj = {
            fileName: file.name,
            mimeType: file.type,
            fileSize: file.size, // Size in bytes
        };

        try {
            const uploadedFileIds = await onFileSelect([file], [fileObj], (progress: number) => {
                // console.log(`Upload progress: ${progress}%`);
            });

            if (uploadedFileIds.length > 0) {
                // console.log('Uploaded file IDs:', uploadedFileIds);
            } else {
                toast.error('No files uploaded successfully.');
            }

            // Handle preview
            if (showPreview) {
                const imageFiles = [file].filter(f => f.type.startsWith('image/'));
                const imagePreviews = imageFiles.map(file => URL.createObjectURL(file));
                setPreview(imagePreviews[0]);
            }
        } catch (err) {
            console.warn(err);
            toast.error('Something went wrong while uploading the files, please try again.');
        } finally {
            setLoadingFile(false);
        }
    };

    return (
        <div className={` ${type !== "img" ? "file-upload-wrapper d-grid" : ""}`}>
            <input
                hidden
                type="file"
                id={`file-input-${type}`}
                accept={accept}
                onChange={(event) => handleFileChange(event)}
                className="file-input"
                multiple
                ref={hiddenFileInput}
            />
            {type === 'img' &&
                <label htmlFor={`file-input-${type}`} className=' cursor'>
                    <ImageFallback
                        src={documents?.fileUrl || "/assets/images/uploadimg.svg"}
                        alt="img"
                        accept={accept}
                        className="img-fluid ribbon-img img-round img-cover "
                        width={100}
                        height={100}
                        style={{
                            color: 'none',
                            border: '1px solid'
                        }}
                    />
                </label>
            }
            {type === "msg" && <label htmlFor={`file-input-${type}`} ><Icon className='attach-icon' icon="fluent:attach-16-regular" /></label>}
            {type === "task" && <button type='button' className="btn bg-dark text-light fs-12" onClick={(event) => handleClick(event)}>
                {
                    loadingFile ? (
                        <>
                            <span className="text-white">Loading...</span>
                            {loadingFile && <GlobalLoader />}
                        </>
                    ) :
                        selectedFile ? (
                            selectedFile.name
                        ) : (
                            label
                        )}
            </button>}

            {showPreview && preview && (
                <div className="preview-container">
                    <img src={preview} alt="Preview" className="preview-image" />
                </div>
            )}
            
            {showCropModal && selectedImage &&
                <CropImgModal 
                    imageSrc={selectedImage}
                    onCropComplete={handleCropComplete}
                    onClose={() => {
                        setShowCropModal(false)
                        setSelectedImage(null)
                        setFileMetadata(null)
                    }}
                    aspect={1 / 1}
                    isOpen={showCropModal}
                    width={86}
                    height={86}
                /> 
            }

            {type !== "task" && loadingFile && <GlobalLoader />}
        </div>
    );
};

export default FileUpload;
