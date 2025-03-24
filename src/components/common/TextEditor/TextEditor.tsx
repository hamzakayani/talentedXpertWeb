import React, { useEffect, useRef } from 'react'
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const TextEditor: React.FC<any> = ({ value, setValue, className, style, placeholder }) => {
    const quillRef = useRef<ReactQuill | null>(null);

    useEffect(() => {
        if (quillRef.current) {
            const quill = quillRef.current.getEditor(); 
            const quillContainer = quill.root; 

            const observer = new MutationObserver((mutations) => {
                console.log('DOM Mutations detected:', mutations);
            });

            const config = { childList: true, subtree: true };
            observer.observe(quillContainer, config); 

            // Clean up observer on component unmount
            return () => {
                observer.disconnect();
            };
        }
    }, []);

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        ['link'],
      
        // [{ 'header': 5 }, { 'header': 6 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
      
        ['clean']                                         // remove formatting button
    ]

    const modules = {
        toolbar: toolbarOptions
    };

    return (
        <div className={`${className}`} style={{ ...style }}>
            <ReactQuill
                ref={quillRef}
                value={value}
                onChange={(value) => setValue(value)}                  
                theme="snow"
                // modules={modules} 
                placeholder={placeholder}
                style={{ height: '100%', color: '#fff' }}
            />
        </div>
    )
}

export default TextEditor