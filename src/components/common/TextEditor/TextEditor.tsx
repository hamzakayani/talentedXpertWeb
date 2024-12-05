import React from 'react'
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const TextEditor: React.FC<any> = ({ value, setValue, className, style, placeholder }) => {
    return (
        <div className={`${className}`} style={style}>
            <ReactQuill
                value={value}
                onChange={(value) => setValue(value)}                  
                theme="snow"
                placeholder={placeholder}
            />
        </div>
    )
}

export default TextEditor