import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";
import * as cornerstoneTools from "cornerstone-tools"; // ✅ Import cornerstone tools
import { Dialog, DialogTitle } from "@mui/material";

// ✅ Assign external libraries to cornerstone
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.init(); // ✅ Initialize cornerstone tools

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

    useEffect(() => {
        if (!selectedImage) return;

        // ✅ Ensure that the viewer exists before loading the image
        setTimeout(() => {
            const element = dicomViewerRef.current;

            if (!element) {
                console.error("❌ DICOM Viewer element not found!");
                return;
            }

            console.log("📡 Loading image into viewer:", selectedImage);
            cornerstone.enable(element);

            // ✅ Build imageId for Cornerstone
            const imageId = `wadouri:http://localhost:4000${selectedImage}`;
            console.log("📡 Fetching Image:", imageId); // 🔹 Debugging log

            // ✅ Load and display the DICOM image
            cornerstone.loadImage(imageId).then((image) => {
                console.log("✅ Image Loaded:", image);

                const viewport = cornerstone.getDefaultViewportForImage(element, image);

                // 🔹 Apply auto windowing based on image pixel intensity
                viewport.voi.windowWidth = image.maxPixelValue - image.minPixelValue;
                viewport.voi.windowCenter = (image.maxPixelValue + image.minPixelValue) / 2;

                cornerstone.displayImage(element, image, viewport);

                // ✅ Enable Windowing Adjustments
                cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
                cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 1 });

            }).catch((error) => {
                console.error("❌ Error loading DICOM image:", error);
            });
        }, 500); // 🔹 Add small delay to ensure the modal is fully open
    }, [selectedImage]); // 🔹 Runs whenever `selectedImage` changes

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
                                        onClick={() => setSelectedImage(file.filePath)}
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
                ></div>
            </Dialog>
        </div>
    );
};

export default DicomTable;
