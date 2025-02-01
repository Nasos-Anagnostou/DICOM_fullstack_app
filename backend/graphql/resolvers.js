const { Dicom } = require('../models');

const resolvers = {
    Query: {
        getDicoms: async () => await Dicom.findAll()
    },
    Mutation: {
        addDicom: async (_, { patientName, birthDate, seriesDescription, filePath }) => {
            return await Dicom.create({ patientName, birthDate, seriesDescription, filePath });
        }
    }
};

module.exports = resolvers;