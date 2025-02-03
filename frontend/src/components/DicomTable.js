import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DicomTable = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        async function fetchFiles() {
            try {
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

                if (response.data.data && response.data.data.getDicomFiles) {
                    setFiles(response.data.data.getDicomFiles);
                } else {
                    setFiles([]); // Ensure it's an empty array if nothing is returned
                }
            } catch (error) {
                console.error("Error fetching DICOM files:", error);
            }
        }
        fetchFiles();
    }, []);

    return (
        <div>
            <h2>DICOM Files</h2>
            {files.length === 0 ? (
                <p>No DICOM files found. Please upload a file.</p>
            ) : (
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
            )}
        </div>
    );
};

export default DicomTable;
