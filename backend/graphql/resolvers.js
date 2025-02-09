const DicomFile = require("../models/DicomFile");
const fs = require("fs");
const path = require("path");

const resolvers = {
    Query: {
        getDicomFiles: async () => await DicomFile.findAll(),
    },
    Mutation: {
        uploadDicomFile: async (_, { filename, patientName, birthDate, seriesDescription, filePath }) => {
            return await DicomFile.create({ filename, patientName, birthDate, seriesDescription, filePath });
        },

        // ✅ Delete all DICOM files from DB & filesystem
        clearDicomFiles: async () => {
            try {
                // 1️⃣ Get all file paths from DB
                const files = await DicomFile.findAll();

                // 2️⃣ Delete files from the uploads folder
                files.forEach((file) => {
                    const fullPath = path.join(__dirname, "../uploads", file.filename);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                        console.log(`🗑 Deleted file: ${fullPath}`);
                    }
                });

                // 3️⃣ Delete all records from DB
                await DicomFile.destroy({ where: {} });

                return { message: "All DICOM files cleared successfully!" };
            } catch (error) {
                console.error("❌ Error clearing files:", error);
                return { message: "Error clearing DICOM files." };
            }
        }
    }
};

module.exports = resolvers;
