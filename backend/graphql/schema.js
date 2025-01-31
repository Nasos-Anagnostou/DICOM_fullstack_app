// backend/graphql/schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Dicom {
        id: ID!
        patientName: String
        birthDate: String
        seriesDescription: String
        filePath: String
    }
    
    type Query {
        getDicoms: [Dicom]
    }

    type Mutation {
        addDicom(patientName: String, birthDate: String, seriesDescription: String, filePath: String): Dicom
    }
`;

module.exports = typeDefs;
