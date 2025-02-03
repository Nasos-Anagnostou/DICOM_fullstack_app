import React, { useState } from "react";
import axios from "axios";

const UploadComponent = () => {
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);

    // 🔹 Prevent default behavior when dragging over
    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(true);
    };

    // 🔹 Prevent default drop behavior and capture the file
    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);

        if (event.dataTransfer.files.length > 0) {
            setFile(event.dataTransfer.files[0]); // Set the dropped file
        }
    };

    // 🔹 Handle file selection via "Choose File" button
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // 🔹 Upload File to Backend
    const handleUpload = async () => {
        if (!file) {
            alert("Please select or drop a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:4000/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("File uploaded successfully!");
            console.log(response.data);
        } catch (error) {
            console.error("Upload error:", error);
            alert("File upload failed.");
        }
    };

    return (
        <div 
            style={{
                width: "400px",
                height: "200px",
                border: dragging ? "2px dashed blue" : "2px dashed gray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                margin: "20px auto",
                cursor: "pointer"
            }}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
        >
            <input
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="fileInput"
            />
            <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                {file ? file.name : "Drag & Drop a DICOM file here or Click to Select"}
            </label>
            <button onClick={handleUpload} disabled={!file}>Upload</button>
        </div>
    );
};

export default UploadComponent;
