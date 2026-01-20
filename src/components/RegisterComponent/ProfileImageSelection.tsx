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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!validateFile(file)) {
        return;
      }

      setIsUploading(true);

      try {
        // Prepare data for S3 upload
        const files = [file];
        const fileObjs = [
          {
            fileName: file.name,
            mimeType: file.type,
            fileSize: file.size / 1024,
          },
        ];

        const uploadedFiles = await uploadFileToS3(
          files,
          fileObjs,
          () => {},
          true
        );

        if (!uploadedFiles || uploadedFiles.length === 0) {
          toast.error("Failed to upload image. Please try again.");
          return;
        }

        const uploadedFile = uploadedFiles[0];

        // Optional extra validation using returned key
        if (getFileType(uploadedFile.key) !== "image") {
          toast.error("Please select an image file (PNG, JPEG, GIF, or WEBP)");
          return;
        }

        setDocuments(uploadedFile);

        // Set form value so backend receives { key, fileUrl }
        setValue("profilePicture", uploadedFile, { shouldValidate: true });

        // Use S3 URL as preview
        setSelectedImage(uploadedFile.fileUrl);
      } catch (error) {
        console.warn("Error uploading profile image:", error);
        toast.error("Something went wrong while uploading. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    // If image was uploaded we already set profilePicture via handleImageUpload
    // Just move to the next step
    setActiveStep(activeStep + 1);
  };

  const handleSkip = () => {
    // Don't set any value when skipping
    setActiveStep(activeStep + 1);
  };

  // Kept for potential future use with FileUpload component
  const handleFileSelect = async (
    files: File[],
    fileObjs: any[],
    onProgress: (progress: number) => void
  ): Promise<any[]> => {
    const uploadedFiles = files
      ? await uploadFileToS3(files, fileObjs, onProgress, true)
      : [];
    if (!uploadedFiles.length || getFileType(uploadedFiles[0]?.key) !== "image") {
      toast.error("Please select an image file (PNG, JPEG, GIF, or WEBP)");
      return [];
    } else {
      setDocuments(uploadedFiles[0]);
      setValue("profilePicture", uploadedFiles[0], { shouldValidate: true });
      setSelectedImage(uploadedFiles[0].fileUrl);
      return uploadedFiles;
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
