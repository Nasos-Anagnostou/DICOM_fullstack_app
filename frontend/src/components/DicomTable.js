import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser"; // ✅ Import dicomParser
import { Dialog, DialogTitle } from "@mui/material";

// ✅ Assign dicomParser to cornerstoneWADOImageLoader
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

const DicomTable = ({ refreshTrigger }) => {
    const [files, setFiles] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const dicomViewerRef = useRef(null); // ✅ Reference to the viewer element

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
        const element = dicomViewerRef.current; // ✅ Get the viewer element

        if (!element) {
            console.error("❌ DICOM Viewer element not found!");
            return;
        }

        // ✅ Enable the element for Cornerstone
        if (!cornerstone.getEnabledElement(element)) {
            cornerstone.enable(element);
        }

        const dicomUrl = `wadouri:http://localhost:4000${imageId}`;
        console.log("🟢 Fetching DICOM from:", dicomUrl);

        // ✅ Load and display the image
        cornerstone.loadImage(dicomUrl)
            .then((image) => {
                console.log("✅ DICOM Image Loaded:", image);
                const viewport = cornerstone.getDefaultViewportForImage(element, image);
                
                // 🔹 Apply default window leveling (Adjust brightness/contrast)
                viewport.voi.windowWidth = image.windowWidth || 400;   // Contrast adjustment
                viewport.voi.windowCenter = image.windowCenter || 40;   // Brightness adjustment
                
                cornerstone.displayImage(element, image, viewport);
            })
            .catch((error) => {
                console.error("❌ Error loading DICOM image:", error);
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
                                            const dicomPath = `wadouri:http://localhost:4000${file.filePath}`;
                                            console.log("🟢 Fetching DICOM from:", dicomPath);
                                            setSelectedImage(file.filePath);
                                            loadDicomImage(dicomPath);
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
                <div 
                    id="dicomImageViewer" 
                    ref={dicomViewerRef} // ✅ Assign the reference
                    style={{ width: "512px", height: "512px", backgroundColor: "black" }}
                >
                    <p style={{ color: "white", textAlign: "center" }}>
                        {selectedImage ? "Loading DICOM..." : "No Image Loaded"}
                    </p>
                </div>
            </Dialog>
        </div>
    );
};

export default DicomTable;
