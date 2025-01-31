from flask import Flask, request, jsonify
import pydicom
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_dicom():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    
    ds = pydicom.dcmread(filepath)
    metadata = {
        "patientName": str(ds.PatientName),
        "birthDate": str(ds.PatientBirthDate),
        "seriesDescription": str(ds.SeriesDescription),
        "filePath": filepath
    }
    return jsonify(metadata)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)