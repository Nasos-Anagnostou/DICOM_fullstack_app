# DICOM Fullstack App

## Overview
The **DICOM Fullstack App** is a full-stack web application designed to manage, process, and visualize DICOM (Digital Imaging and Communications in Medicine) files. It includes both backend and frontend components, offering a seamless experience for users working with medical imaging data.

## Features
- 📂 **DICOM File Upload & Storage**: Upload, store, and manage DICOM images securely.
- 🖼 **DICOM Viewer**: Render and visualize medical images in the browser.
- 📊 **Metadata Extraction**: Retrieve and display essential metadata from DICOM files.
- 🔄 **Processing & Analysis**: Perform basic DICOM image manipulations and analyses.
- 🔒 **Authentication & Authorization**: Secure user access with role-based authentication.

## Tech Stack
### **Frontend** (React + Vite)
- React.js (Vite-based setup)
- TypeScript
- TailwindCSS
- DICOMweb.js (for DICOM handling)

### **Backend** (Node.js + Express)
- Node.js + Express.js
- MongoDB (for storing user and image metadata)
- DICOMweb API integration
- Authentication (JWT-based)

### **Other Tools**
- Docker (for containerized deployment)
- GitHub Actions (CI/CD pipeline)

## Installation & Setup
### **1. Clone the Repository**
```sh
git clone https://github.com/Nasos-Anagnostou/DICOM_fullstack_app.git
cd DICOM_fullstack_app
```

### **2. Backend Setup**
```sh
cd backend
npm install
npm start  # Starts the backend server
```

### **3. Frontend Setup**
```sh
cd ../frontend
npm install
npm run dev  # Starts the frontend development server
```

## Usage
1. Open the frontend at `http://localhost:3000`
2. Upload DICOM files and visualize them using the built-in viewer.
3. Perform basic manipulations and extract metadata from images.

## Contributing
We welcome contributions! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to your branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License. See `LICENSE` for details.

## Contact
For issues or feature requests, please open an issue on GitHub or contact [Nasos-Anagnostou](https://github.com/Nasos-Anagnostou).

---
🚀 Happy Coding! 🚀

