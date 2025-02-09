import pydicom
import json
import sys

file_path = sys.argv[1]

try:
    # ✅ Force read DICOM
    dicom_data = pydicom.dcmread(file_path, force=True)

    metadata = {
        "patientName": dicom_data.PatientName if "PatientName" in dicom_data else "Unknown",
        "birthDate": dicom_data.PatientBirthDate if "PatientBirthDate" in dicom_data else "N/A",
        "seriesDescription": dicom_data.SeriesDescription if "SeriesDescription" in dicom_data else "N/A"
    }

    print(json.dumps(metadata))

except Exception as e:
    print(json.dumps({"error": str(e)}))
