const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type DicomFile {
        id: ID!
        filename: String!
        patientName: String
        birthDate: String
        seriesDescription: String
        filePath: String!
        createdAt: String
        updatedAt: String
    }

    type Query {
        getDicomFiles: [DicomFile]
    }

    type Mutation {
        uploadDicomFile(
            filename: String!,
            patientName: String,
            birthDate: String,
            seriesDescription: String,
            filePath: String
        ): DicomFile

        clearDicomFiles: ClearResponse
    }

    type ClearResponse {
        message: String
    }
`;

module.exports = typeDefs;
