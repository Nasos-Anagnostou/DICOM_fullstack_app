import React from 'react';

const FileUpload = ({ handleFileChange, handleUpload }) => {
    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;