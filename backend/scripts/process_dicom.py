import pydicom
import sys
import json

def process_dicom(file_path):
    ds = pydicom.dcmread(file_path)
    
    data = {
        "patientName": str(ds.PatientName),
        "birthDate": str(ds.PatientBirthDate),
        "seriesDescription": str(ds.SeriesDescription)
    }

    print(json.dumps(data))

if __name__ == "__main__":
    file_path = sys.argv[1]
    process_dicom(file_path)
