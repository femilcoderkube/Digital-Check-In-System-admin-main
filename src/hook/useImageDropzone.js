import { useState } from "react";
import { useDropzone } from "react-dropzone";

const useImageDropzone = (formik, fieldName, setErrorMessage) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      const selectedFile = acceptedFiles[0];

     
      setErrorMessage("");

      if (selectedFile) {
        if (selectedFile.type.startsWith("image/")) {
          formik.setFieldValue(fieldName, selectedFile);
          setFile(selectedFile);
          setPreviewImage(URL.createObjectURL(selectedFile));
        } else {
          setPreviewImage(null);
          formik.setFieldValue(fieldName, null);
          setErrorMessage("Only image files are accepted.");
        }
      } else if (rejectedFiles.length > 0) {
        setPreviewImage(null);
        formik.setFieldValue(fieldName, null); 
        setErrorMessage("Only image files are accepted.");
      }
    },
    multiple: false,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "image/svg": [],
      "image/heif": [],
      "image/heic": [],
      "image/webp": [],
    },
  });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    previewImage,
    file,
    setPreviewImage,
    setFile,
  };
};

export default useImageDropzone;

