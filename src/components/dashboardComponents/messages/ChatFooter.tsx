import FileUpload from "@/components/common/upload/FileUpload";
import { uploadFileToS3 } from "@/services/uploadFileToS3/uploadFileToS3";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const ChatFooter = ({
  documents,
  setDocuments,
  toSend,
  setToSend,
  handleKeyDown,
  handleSend,
}: any) => {
  const handleFileSelect = async (
    files: File[],
    fileObjs: any[],
    onProgress: (progress: number) => void
  ): Promise<number[]> => {
    const uploadedFileIds = files
      ? await uploadFileToS3(files, fileObjs, onProgress, false)
      : 0;
    const temp: any = [...documents, ...uploadedFileIds];
    setDocuments(temp);

    return uploadedFileIds;
  };

  return (
    <div className="d-flex mt-auto mb-2">
      <div className="typing-area d-flex align-items-center w-100">
        <div className="chat-area-actions d-flex flex-column w-100 bg-white rounded-3 p-0" style={{ minHeight: '40px' }}>
          {/* File attachments displayed above the input */}
          {documents?.length > 0 && (
            <div className="document-chips d-flex gap-2 mb-2 flex-wrap w-100 px-2">
              {documents.map((doc: any, index: number) => (
                <div
                  key={index}
                  className="d-flex align-items-center bg-dark text-white rounded-pill px-3 py-1"
                >
                  <span className="me-2 fs-12">{doc?.key}</span>
                  <Icon
                    icon="gridicons:cross-small"
                    className="cursor-pointer"
                    style={{ color: "white", cursor: "pointer" }}
                    onClick={() => {
                      const updatedDocs = documents.filter(
                        (_: any, i: any) => i !== index
                      );
                      setDocuments(updatedDocs);
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Input row with consistent alignment */}
          <div className="d-flex align-items-center w-100" style={{ height: '40px' }}>
            {/* Clear text button */}
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: "40px" }}
            >
              {/* {toSend !== "" && (
                <Icon
                  className="cross-icon cursor-pointer"
                  icon="gridicons:cross-small"
                  onClick={() => setToSend("")}
                  width={24}
                  height={24}
                  style={{
                    color: "grey",
                    cursor: "pointer",
                  }}
                />
              )} */}
            </div>

            {/* File upload button */}
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: "40px" }}
            >
              <FileUpload
                onFileSelect={handleFileSelect}
                label="Upload File"
                accept="/*"
                type="msg"
              />
            </div>

            {/* Text input area */}
            <div
              style={{ height: '40px' }}
              className="flex-grow-1 d-flex align-items-center"
            >
              <input
                type="text"
                className="w-100"
                style={{ 
                  border: "none", 
                  outline: "none",
                  height: '40px',
                  padding: '0 8px',
                  background: 'transparent'
                }}
                placeholder="Write a message"
                value={toSend}
                onKeyDown={handleKeyDown}
                onChange={(e) => setToSend(e.target.value)}
              />
            </div>

            {/* Send button */}
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: "40px" }}
            >
              <Icon
                style={{ cursor: "pointer", marginRight: '20px' }}
                className="send-icon cursor-pointer"
                icon="bi:send"
                width={24}
                height={24}
                onClick={handleSend}
              />
            </div>

            {/* Voice icon */}
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: "40px" }}
            >
              <Icon 
                icon="icon-park-outline:voice" 
                width={24} 
                height={24} 
                style={{ cursor: "pointer", }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatFooter;
