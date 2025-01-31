import React, { useState } from 'react';
import { Container, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from 'axios';

const App = () => {
    const [dicoms, setDicoms] = useState([]);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post('http://localhost:5001/upload', formData);
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
            <input type="file" onChange={handleFileChange} />
            <Button onClick={handleUpload} variant="contained" color="primary">Upload</Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Patient Name</TableCell>
                        <TableCell>Birth Date</TableCell>
                        <TableCell>Series Description</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dicoms.map((dicom) => (
                        <TableRow key={dicom.id}>
                            <TableCell>{dicom.patientName}</TableCell>
                            <TableCell>{dicom.birthDate}</TableCell>
                            <TableCell>{dicom.seriesDescription}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
};

export default App;
