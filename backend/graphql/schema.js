const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type DicomFile {
        id: ID!
        filename: String!
        patientName: String
        birthDate: String
        seriesDescription: String
        filePath: String
    }

    type Query {
        getDicomFiles: [DicomFile]
    }

    type Mutation {
        uploadDicomFile(filename: String!, patientName: String, birthDate: String, seriesDescription: String, filePath: String!): DicomFile
    }
`;

module.exports = typeDefs;
