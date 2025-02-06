const DicomFile = require('../models/DicomFile');

const resolvers = {
    Query: {
        getDicomFiles: async () => {
            const files = await DicomFile.findAll();
            console.log("📡 Fetching DICOM Files from Database:", files);
            return files;
        }
    },
    Mutation: {
        uploadDicomFile: async (_, { filename, patientName, birthDate, seriesDescription, filePath }) => {
            console.log("📤 Uploading new DICOM File:", { filename, patientName, birthDate, seriesDescription, filePath });
            return await DicomFile.create({ filename, patientName, birthDate, seriesDescription, filePath });
        }
    }
};

module.exports = resolvers;
