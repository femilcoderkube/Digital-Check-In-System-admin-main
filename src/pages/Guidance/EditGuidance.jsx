import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GuidanceForm from "../../components/guidanceform/GuidanceForm";

import CommonLayout from "../../components/commonLayout/CommonLayout";
import { getById, putCall } from "../../utils/api";

const EditGuidance = () => {
  const { id } = useParams();
  const [guidanceData, setGuidanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (guidanceData) {
      console.log("guidanceData", guidanceData);
    }
  }, [guidanceData]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuidance = async () => {
      setIsLoading(true);
      try {
        const response = await getById(
          "/guidance/getGuidanceByID?guidance_id",
          id,
          false,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setGuidanceData(response?.data || {});
      } catch (error) {
        console.log("Error fetching guidance data", error);
        setGuidanceData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuidance();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      console.log("Updating guidance with ID:", id, "Data:", formData);
      const response = await putCall(
        `/guidance/updateGuidance?guidance_id=${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("res", response);
      navigate("/guidance-list");
    } catch (error) {
      console.error("Error updating guidance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonLayout title="Edit Guidance" colSize="col-lg-8">
      <GuidanceForm
        onSubmit={handleSubmit}
        editGuidanceData={guidanceData}
        isEdit={true}
        isLoading={isLoading}
      />
    </CommonLayout>
  );
};

export default EditGuidance;