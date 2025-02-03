import React from 'react';
import UploadComponent from './components/UploadComponent';
import DicomTable from './components/DicomTable';

function App() {
    return (
        <div>
            <h1>DICOM Viewer</h1>
            <UploadComponent />
            <DicomTable />
        </div>
    );
}

export default App;
