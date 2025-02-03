import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DicomTable = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        async function fetchFiles() {
            const response = await axios.post("http://localhost:4000/graphql", {
                query: `
                    {
                        getDicomFiles {
                            id
                            filename
                            patientName
                            birthDate
                            seriesDescription
                            filePath
                        }
                    }
                `
            });            
            setFiles(response.data.data.getDicomFiles);
        }
        fetchFiles();
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <th>Filename</th>
                    <th>Patient Name</th>
                    <th>Birth Date</th>
                    <th>Series Description</th>
                </tr>
            </thead>
            <tbody>
                {files.map(file => (
                    <tr key={file.id}>
                        <td>{file.filename}</td>
                        <td>{file.patientName}</td>
                        <td>{file.birthDate}</td>
                        <td>{file.seriesDescription}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DicomTable;
