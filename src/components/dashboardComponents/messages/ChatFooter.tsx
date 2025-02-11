import FileUpload from '@/components/common/upload/FileUpload'
import { uploadFileToS3 } from '@/services/uploadFileToS3/uploadFileToS3'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import React from 'react'

const ChatFooter = ({documents, setDocuments, toSend,setToSend, handleKeyDown, handleSend}:any) => {

    const handleFileSelect = async (files: File[], fileObjs: any[], onProgress: (progress: number) => void): Promise<number[]> => {
        const uploadedFileIds = files ? await uploadFileToS3(files, fileObjs, onProgress, false) : 0
        const temp: any = [...documents, ...uploadedFileIds];
        setDocuments(temp)

        return uploadedFileIds;

    }
    return (
        <div className='d-flex mt-5'>
            <div className='typing-area d-flex align-items-center w-100'>
                <div className="chat-area-actions d-flex align-items-center w-100">
                    {/* <Icon className='attach-icon' icon="fluent:attach-16-regular"/> */}
                    <FileUpload onFileSelect={handleFileSelect} label="Upload File" accept='image/*,application/pdf' type="msg" />

                    {documents?.length > 0 && documents.map((doc: any) => (
                        <Link key={doc?.key} className={'file'} href={doc?.fileUrl} target='_blank'>
                            {doc?.key}
                        </Link>))}

                    <textarea
                        className="chat-area-input w-100 px-5 pt-2"
                        rows={2}
                        placeholder="Write a message"
                        value={toSend}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setToSend(e.target.value)}

                    />
                    {toSend!=='' && <Icon className='cross-icon' icon="gridicons:cross-small" onClick={()=> setToSend('')}  />}
                    <Icon className='send-icon' icon="bi:send" onClick={handleSend} />

                </div>
            </div>
            <div className='voice-icon m-2'>
                <Icon icon="icon-park-outline:voice" />
            </div>
        </div>
    )
}

export default ChatFooter
