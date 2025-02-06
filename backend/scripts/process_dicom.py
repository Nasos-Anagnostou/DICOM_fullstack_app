import pydicom
import sys
import json

def process_dicom(file_path):
    try:
        ds = pydicom.dcmread(file_path)

        metadata = {
            "patientName": str(ds.PatientName) if "PatientName" in ds else "Unknown",
            "birthDate": str(ds.PatientBirthDate) if "PatientBirthDate" in ds else "N/A",
            "seriesDescription": str(ds.SeriesDescription) if "SeriesDescription" in ds else "N/A"
        }

        print(json.dumps(metadata))  # ✅ Outputs JSON metadata
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    process_dicom(sys.argv[1])
