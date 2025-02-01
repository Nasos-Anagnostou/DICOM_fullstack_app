import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from 'axios';
import { FileUpload, DicomTable } from './components';

const App = () => {
    const [dicoms, setDicoms] = useState([]);
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchDicoms();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:4000/upload', formData);
            await axios.post('http://localhost:4000/graphql', {
                query: `
                    mutation {
                        addDicom(patientName: "${response.data.patientName}", birthDate: "${response.data.birthDate}", seriesDescription: "${response.data.seriesDescription}", filePath: "${response.data.filePath}") {
                            id
                        }
                    }
                `
            });
            fetchDicoms();
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const fetchDicoms = async () => {
        const response = await axios.post('http://localhost:4000/graphql', {
            query: `query { getDicoms { id, patientName, birthDate, seriesDescription, filePath } }`
        });
        setDicoms(response.data.data.getDicoms);
    };

    return (
        <Container>
            <Typography variant="h4">DICOM Uploader</Typography>
            <FileUpload handleFileChange={handleFileChange} handleUpload={handleUpload} />
            <DicomTable dicoms={dicoms} />
        </Container>
    );
};

export default App;
