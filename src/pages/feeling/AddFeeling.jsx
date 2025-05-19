import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeelingForm from "../../components/feelingForm/feelingForm";
import CommonLayout from "../../components/commonLayout/CommonLayout";
import { postCall } from "../../utils/api";

const AddFeeling = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      console.log("Adding feeling with values:", values);

      // API call to create feeling
      const response = await postCall("/admin/createSecondaryFeeling", values);

      if (response.success) {
        navigate("/feeling-list"); // Navigate to feeling list page
      } else {
        console.log("Failed to add feeling");
      }
    } catch (error) {
      console.log("Something went wrong while adding feeling", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonLayout title="Add Feeling" colSize="col-lg-8">
      <FeelingForm onSubmit={handleSubmit} isLoading={isLoading} />
    </CommonLayout>
  );
};

export default AddFeeling; 