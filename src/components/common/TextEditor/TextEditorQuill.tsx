import React from 'react'
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const TextEditorQuill: React.FC<any> = ({ value, onChange, className, style, placeholder }) => {
    return (
        <div style={{height: 'auto'}}>
            <ReactQuill
                value={value}
                onChange={onChange}
                className={`${className}`}
                style={style}
                theme="snow"
                placeholder={placeholder}
            />
        </div>
    )
}

export default TextEditorQuill