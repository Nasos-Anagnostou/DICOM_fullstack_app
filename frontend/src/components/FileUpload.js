import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Box, Typography } from '@mui/material';

const FileUpload = ({ handleFileChange, handleUpload }) => {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => handleFileChange({ target: { files: acceptedFiles } })
    });

    return (
        <Box {...getRootProps()} sx={{ border: '2px dashed #ccc', padding: 2, textAlign: 'center', cursor: 'pointer' }}>
            <input {...getInputProps()} />
            <Typography>Drag and drop DICOM files here, or click to select files</Typography>
            <Button variant="contained" onClick={handleUpload} sx={{ marginTop: 2 }}>Upload</Button>
        </Box>
    );
};

export default FileUpload;