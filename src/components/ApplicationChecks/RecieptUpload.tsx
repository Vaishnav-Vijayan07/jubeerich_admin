import React, { useRef, useState } from "react";
import { showErrorAlert, showSuccessAlert } from "../../constants";
import { refreshData } from "../../redux/countryReducer";
import { useDispatch } from "react-redux";
import axios from "axios";

type Props = {
  application_id: string;
};

const FileUpload = ({ application_id }: Props) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<any>(null);

  const handleButtonClick = () => {
    fileInputRef?.current?.click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      alert("Please select a PDF file");
      event.target.value = null;
    }
  };

  const handleUploadReciept = async () => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("application_reciept", selectedFile);
    }

    try {
      const { data } = await axios.patch(`/application_receipt/${application_id}`, formData);
      if (data?.status) {
        showSuccessAlert(data?.message);
        setSelectedFile(null);
        dispatch(refreshData());
      } else {
        showErrorAlert(data?.message);
      }
    } catch (error) {
      showErrorAlert(error);
    }
  };

  return (
    <div className="bg-light p-1 rounded d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-3">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" style={{ display: "none" }} />
        <button className="btn btn-primary bt-sm" onClick={handleButtonClick}>
        Add Receipt
        </button>
        {selectedFile && <span className="text-dark me-2">{selectedFile.name}</span>}
      </div>

      {selectedFile && (
        <button className="btn btn-success bt-sm" onClick={handleUploadReciept}>
          Save
        </button>
      )}
    </div>
  );
};

export default FileUpload;
