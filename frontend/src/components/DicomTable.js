import React from 'react';

const DicomTable = ({ dicoms }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Patient Name</th>
                    <th>Birth Date</th>
                    <th>Series Description</th>
                </tr>
            </thead>
            <tbody>
                {dicoms.map((dicom) => (
                    <tr key={dicom.id}>
                        <td>{dicom.patientName}</td>
                        <td>{dicom.birthDate}</td>
                        <td>{dicom.seriesDescription}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DicomTable;