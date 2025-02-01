import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import DicomViewer from './DicomViewer';

const DicomTable = ({ dicoms }) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Patient Name</TableCell>
                    <TableCell>Birth Date</TableCell>
                    <TableCell>Series Description</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {dicoms.map((dicom) => (
                    <TableRow key={dicom.id}>
                        <TableCell>{dicom.patientName}</TableCell>
                        <TableCell>{dicom.birthDate}</TableCell>
                        <TableCell>{dicom.seriesDescription}</TableCell>
                        <TableCell>
                            <Button href={dicom.filePath} download variant="contained">Download</Button>
                            <DicomViewer filePath={dicom.filePath} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default DicomTable;