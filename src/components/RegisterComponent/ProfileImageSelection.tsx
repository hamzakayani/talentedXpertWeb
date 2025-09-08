import { HugeiconsIcon } from '@hugeicons/react'
import { Camera01Icon } from '@hugeicons/core-free-icons'
import React, { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { getFileType } from '@/services/utils/util'
import { uploadFileToS3 } from '@/services/uploadFileToS3/uploadFileToS3'
import FileUpload from '../common/upload/FileUpload'

interface ProfileImageSelectionProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
  setValue: (name: any, value: any, options?: any) => void;
  watch: (name: any) => any;
}

export default function ProfileImageSelection({ activeStep, setActiveStep, setValue, watch }: ProfileImageSelectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<any>({});

  const validateFile = (file: File) => {
    const fileSize = file.size / 1024; // Convert to KB
    if (fileSize > 2000) { // 2MB limit
      toast.error("File size exceeds 2 MB");
      return false;
    }

    const fileObj = {
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size / 1024,
    };

    if (getFileType(fileObj.fileName) !== "image") {
      toast.error("Please select an image file (PNG, JPEG, GIF, or WEBP)");
      return false;
    }

    return true;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!validateFile(file)) {
        return;
      }

      setIsUploading(true);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);

      // Simulate upload ID
      const fileId = Math.random() * 1000;
      setUploadedFileId(fileId);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    // Only set the value if an image is selected
    if (selectedImage && uploadedFileId) {
      setValue('profilePicture', {
        key: uploadedFileId.toString(),
        fileUrl: selectedImage
      }, { shouldValidate: true });

      // setValue('profilePicture', documents, { shouldValidate: true });
    }
    setActiveStep(activeStep + 1);
  };

  const handleSkip = () => {
    // Don't set any value when skipping
    setActiveStep(activeStep + 1);
  };

  const handleFileSelect = async (
    files: File[],
    fileObjs: any[],
    onProgress: (progress: number) => void
  ): Promise<number[]> => {
    const uploadedFileId = files
      ? await uploadFileToS3(files, fileObjs, onProgress, true)
      : 0;
    if (getFileType(uploadedFileId[0]?.key) !== "image") {
      toast.error("Please select an image file (PNG, JPEG, GIF, or WEBP)");
      return [];
    } else {
      setDocuments(uploadedFileId[0]);
      setValue("profilePicture", uploadedFileId[0]);
      return uploadedFileId;
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-5 mx-auto">
            <h2 className="text-center mb-5 text-medium">Set your profile picture</h2>
            <div className="d-flex flex-column align-items-center mb-5">
              {/* <FileUpload
                onFileSelect={handleFileSelect}
                label="Upload File"
                accept="image/*"
                type="profileImg"
                documents={documents}
              /> */}
              <div
                style={{
                  width: 170,
                  height: 170,
                  borderRadius: 100,
                  border: '1px solid #B0B0B0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                onClick={handleImageClick}
              >
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Profile preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                  />
                ) : (
                  <div className="d-flex flex-column align-items-center">
                    <HugeiconsIcon
                      icon={Camera01Icon}
                      className=""
                      style={{
                        cursor: "pointer",
                        color: "#B0B0B0",
                      }}
                      size={60}
                    />
                    <p className="mb-0 fw-medium mt-2" style={{ fontSize: '13px' }}>
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="d-none"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <button
                type="button"
                className="btn btn-black"
                style={{ width: '35%' }}
                onClick={handleSave}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Save'}
              </button>
              <button
                type="button"
                className="btn btn-outline-dark"
                style={{ width: '35%' }}
                onClick={handleSkip}
                disabled={isUploading}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
