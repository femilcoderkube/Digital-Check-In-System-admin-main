import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GuidanceForm from "../../components/guidanceform/GuidanceForm";
import CommonLayout from "../../components/commonLayout/CommonLayout";
import { postCall } from "../../utils/api";

const AddGuidance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      console.log("Adding guidance with values:", values);
      const response = await postCall("/guidance/createGuidance", values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.success) {
        navigate("/guidance-list");
      } else {
        console.log("Failed to add guidance");
      }
    } catch (error) {
      console.log("Something went wrong while adding guidance", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonLayout title="Add Guidance" colSize="col-lg-8">
      <GuidanceForm onSubmit={handleSubmit} isLoading={isLoading} />
    </CommonLayout>
  );
};

export default AddGuidance;