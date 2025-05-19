import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonLayout from "../../components/commonLayout/CommonLayout";
import { postCall } from "../../utils/api";
import KidsFeelingForm from "../../components/kidsFeelingForm/kidsFeelingForm";

const AddKidsFeeling = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      console.log("Adding kids with values:", values);

      // API call to create kids
      const response = await postCall("/admin/createSecondarykids", values);

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
    <CommonLayout title="Add kids Feeling" colSize="col-lg-8">
      <KidsFeelingForm onSubmit={handleSubmit} isLoading={isLoading} />
    </CommonLayout>
  );
};

export default AddKidsFeeling; 