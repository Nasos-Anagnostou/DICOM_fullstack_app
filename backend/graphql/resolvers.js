const DicomFile = require('../models/DicomFile');

const resolvers = {
    Query: {
        getDicomFiles: async () => await DicomFile.findAll()
    },
    Mutation: {
        uploadDicomFile: async (_, { filename, patientName, birthDate, seriesDescription, filePath }) => {
            return await DicomFile.create({ filename, patientName, birthDate, seriesDescription, filePath });
        }
    }
};

module.exports = resolvers;
