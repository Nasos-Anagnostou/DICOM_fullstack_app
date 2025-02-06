import React, { useState } from 'react';
import UploadComponent from './components/UploadComponent';
import DicomTable from './components/DicomTable';

function App() {
    const [refreshTable, setRefreshTable] = useState(false);

    return (
        <div>
            <h1>DICOM Viewer</h1>
            <UploadComponent onUploadSuccess={() => setRefreshTable(prev => !prev)} />
            <DicomTable refreshTrigger={refreshTable} />
        </div>
    );
}

export default App;
