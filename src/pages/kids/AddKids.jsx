import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonLayout from "../../components/commonLayout/CommonLayout";
import { postCall } from "../../utils/api";
import KidsForm from "../../components/kidsForm/kidsForm";

const AddKids = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      console.log("Adding kids with values:", values);

      // API call to create kids
      const response = await postCall("/kids/createKids", values);

      if (response.success) {
        navigate("/kids-list"); // Navigate to kids list page
      } else {
        console.log("Failed to add kids");
      }
    } catch (error) {
      console.log("Something went wrong while adding kids", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonLayout title="Add kids" colSize="col-lg-8">
      <KidsForm onSubmit={handleSubmit} isLoading={isLoading} />
    </CommonLayout>
  );
};

export default AddKids; 