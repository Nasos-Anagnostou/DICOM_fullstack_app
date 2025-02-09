import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";
import {
    Dialog,
    DialogTitle,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

// ✅ Ensure cornerstone is properly set up
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

// ✅ Configure the DICOM image loader
cornerstoneWADOImageLoader.configure({
    beforeSend: (xhr) => {
        xhr.setRequestHeader("Accept", "application/dicom");
    }
});

const DicomTable = ({ refreshTrigger }) => {
    const [files, setFiles] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [confirmClear, setConfirmClear] = useState(false);
    const dicomViewerRef = useRef(null); // ✅ Reference to the viewer element

    useEffect(() => {
        fetchFiles();
    }, [refreshTrigger]);

    // ✅ Fetch DICOM Files from Backend
    const fetchFiles = async () => {
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
    };

    // ✅ Clear Table (Deletes from DB & Filesystem)
    const clearTable = async () => {
        try {
            const response = await axios.post("http://localhost:4000/graphql", {
                query: `
                    mutation {
                        clearDicomFiles {
                            message
                        }
                    }
                `,
            });

            console.log("🗑 Clearing files response:", response.data);
            alert(response.data.data.clearDicomFiles.message);
            setFiles([]); // ✅ Clear frontend table
        } catch (error) {
            console.error("❌ Error clearing files:", error);
            alert("Failed to clear DICOM files.");
        } finally {
            setConfirmClear(false); // Close confirmation dialog
        }
    };

    // ✅ Load & Display DICOM Image
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

    // ✅ Load Image When Selected
    useEffect(() => {
        if (selectedImage) {
            console.log("🟢 Attempting to load image:", selectedImage);
            loadDicomImage();
        }
    }, [selectedImage]);

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", my: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                DICOM Files
            </Typography>

            {/* 🗑 Clear Table Button with Confirmation */}
            <Button 
                variant="contained" 
                color="error" 
                onClick={() => setConfirmClear(true)} 
                sx={{ display: "block", mx: "auto", my: 2 }}>
                🗑 Clear Table
            </Button>

            <Dialog open={confirmClear} onClose={() => setConfirmClear(false)}>
                <DialogTitle>
                    <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
                    Confirm Clear Table
                </DialogTitle>
                <Box p={2} textAlign="center">
                    <Typography>Are you sure you want to delete all files?</Typography>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={clearTable} 
                        sx={{ mt: 2 }}>
                        Yes, Delete All
                    </Button>
                </Box>
            </Dialog>

            {files.length === 0 ? (
                <Typography variant="h6" align="center" color="textSecondary">
                    No DICOM files found. Please upload a file.
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell><b>Filename</b></TableCell>
                                <TableCell><b>Patient Name</b></TableCell>
                                <TableCell><b>Birth Date</b></TableCell>
                                <TableCell><b>Series Description</b></TableCell>
                                <TableCell><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {files.map((file) => (
                                <TableRow key={file.id} hover>
                                    <TableCell>{file.filename}</TableCell>
                                    <TableCell>{file.patientName || "N/A"}</TableCell>
                                    <TableCell>{file.birthDate || "N/A"}</TableCell>
                                    <TableCell>{file.seriesDescription || "N/A"}</TableCell>
                                    <TableCell>
                                        <IconButton href={`http://localhost:4000${file.filePath}`} download>
                                            <DownloadIcon color="primary" />
                                        </IconButton>
                                        <IconButton onClick={() => setSelectedImage(file.filePath)}>
                                            <VisibilityIcon color="action" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* 🖼️ DICOM Image Viewer */}
            <Dialog open={Boolean(selectedImage)} onClose={() => setSelectedImage(null)}>
                <DialogTitle>DICOM Image Preview</DialogTitle>
                <Box 
                    id="dicomImageViewer" 
                    ref={dicomViewerRef} 
                    sx={{ width: 512, height: 512, backgroundColor: "black", mx: "auto", p: 2 }}
                >
                    <Typography align="center" color="white">
                        {selectedImage ? "Loading DICOM..." : "No Image Loaded"}
                    </Typography>
                </Box>
            </Dialog>
        </Box>
    );
};

export default DicomTable;
