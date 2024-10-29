export interface FileUploadProps {
    onFileSelect: (file: File, fileObj: any, onProgress: any | null) => Promise<number>;
    accept?: string;
    label?: string;
    showPreview?: boolean;
}