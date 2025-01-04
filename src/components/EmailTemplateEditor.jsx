// src/components/EmailTemplateEditor.jsx
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from 'react-bootstrap';

const EmailTemplateEditor = ({ initialContent = '', onSave, onCancel }) => {
    const [content, setContent] = useState(initialContent);

    const handleChange = (value) => {
        setContent(value);
    };

    const handleSave = () => {
        onSave(content);
    };

    const modules = {
       toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
          ],
      };


      const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
      ];
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Email Template Editor</h2>
            <ReactQuill
                theme="snow"
                value={content}
                onChange={handleChange}
                modules={modules}
                formats={formats}
               style={{height: '500px'}}
            />
            <div className="mt-4 flex justify-end space-x-2">
                <Button variant="primary" onClick={handleSave}>Save Template</Button>
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
            </div>
        </div>
    );
};

export default EmailTemplateEditor;