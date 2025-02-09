import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";
import { Dialog, DialogTitle } from "@mui/material";

// ✅ Ensure cornerstone is properly set up
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

// ✅ Configure the image loader
cornerstoneWADOImageLoader.configure({
    beforeSend: (xhr) => {
        xhr.setRequestHeader("Accept", "application/dicom");
    }
});

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

    const loadDicomImage = () => {
        if (!selectedImage) return;

        setTimeout(() => {
            const element = dicomViewerRef.current;

            if (!element) {
                console.error("❌ DICOM Viewer element not found!");
                return;
            }

            console.log("✅ DICOM Viewer element found:", element);

            // ✅ Ensure the element is enabled before loading the image
            cornerstone.disable(element);
            cornerstone.enable(element);
            console.log("✅ Cornerstone re-enabled on element.");

            const dicomUrl = `wadouri:http://localhost:4000${selectedImage}`;
            console.log("🟢 Fetching DICOM from:", dicomUrl);

            cornerstone.loadImage(dicomUrl)
                .then((image) => {
                    console.log("✅ DICOM Image Loaded Successfully:", image);
                    const viewport = cornerstone.getDefaultViewportForImage(element, image);
                    cornerstone.displayImage(element, image, viewport);
                })
                .catch((error) => {
                    console.error("❌ Error loading DICOM image:", error);
                    console.error("🔴 Possible Causes: Invalid file path or unsupported DICOM format.");
                });
        }, 500);
    };

    useEffect(() => {
        if (selectedImage) {
            console.log("🟢 Attempting to load image:", selectedImage);
            loadDicomImage();
        }
    }, [selectedImage]);

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
                                    <a href={`http://localhost:4000${file.filePath}`} download>
                                        <button>Download</button>
                                    </a>
                                    <button onClick={() => setSelectedImage(file.filePath)}>
                                        View Image
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* DICOM Image Viewer */}
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
