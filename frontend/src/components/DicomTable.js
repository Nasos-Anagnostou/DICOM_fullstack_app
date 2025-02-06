import React, { useEffect, useState } from "react";
import axios from "axios";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import { Dialog, DialogTitle } from "@mui/material";

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;

const DicomTable = ({ refreshTrigger }) => {
    const [files, setFiles] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

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
                    `,
                });

                if (response.data.data && response.data.data.getDicomFiles) {
                    setFiles(response.data.data.getDicomFiles);
                } else {
                    setFiles([]);
                }
            } catch (error) {
                console.error("Error fetching DICOM files:", error);
            }
        }
        fetchFiles();
    }, [refreshTrigger]);

    const loadDicomImage = (imageId) => {
        const element = document.getElementById("dicomImageViewer");
        cornerstone.loadImage(imageId).then((image) => {
            const viewport = cornerstone.getDefaultViewportForImage(element, image);
            cornerstone.displayImage(element, image, viewport);
        });
    };

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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file) => (
                            <tr key={file.id}>
                                <td>{file.filename}</td>
                                <td>{file.patientName || "N/A"}</td>
                                <td>{file.birthDate || "N/A"}</td>
                                <td>{file.seriesDescription || "N/A"}</td>
                                <td>
                                    {/* Download Button */}
                                    <a href={`http://localhost:4000${file.filePath}`} download>
                                        <button>Download</button>
                                    </a>

                                    {/* View Image Button */}
                                    <button
                                        onClick={() => {
                                            setSelectedImage(file.filePath);
                                            loadDicomImage(`wadouri:http://localhost:4000${file.filePath}`);
                                        }}
                                    >
                                        View Image
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* DICOM Image Viewer Modal */}
            <Dialog open={Boolean(selectedImage)} onClose={() => setSelectedImage(null)}>
                <DialogTitle>DICOM Image Preview</DialogTitle>
                <div id="dicomImageViewer" style={{ width: "512px", height: "512px", backgroundColor: "black" }}></div>
            </Dialog>
        </div>
    );
};

export default DicomTable;
