import React, { useState } from 'react'

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    label?: string;
    showPreview?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    accept = 'image/*,application/pdf',
    label = 'Upload File',
    showPreview = false,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
            onFileSelect(file);

            // Generate image preview if required
            if (showPreview) {
                const fileURL = URL.createObjectURL(file);
                setPreview(fileURL);
            }
        }
    };

    return (
        <div className="file-upload-wrapper">
            <input hidden
                type="file"
                id="file-input"
                accept={accept}
                onChange={handleFileChange}
                className="file-input"
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

