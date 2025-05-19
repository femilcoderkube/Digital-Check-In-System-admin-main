import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FeelingForm from "../../components/feelingForm/feelingForm";
import CommonLayout from "../../components/commonLayout/CommonLayout";
import { getById, putCall } from "../../utils/api";

const EditFeeling = () => {
  const { id } = useParams();
  const [feelingData, setFeelingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeeling = async () => {
      setIsLoading(true);
      try {
        const response = await getById(
          "/admin/getSecondaryFeelingByID?secondary_feeling_id",
          id,
          false
        );
        
        console.log("Fetched feeling data:", response);
        console.log("Data structure:", {
          name: response?.data?.name,
          color_code: response?.data?.color_code,
          icon: response?.data?.icon,
          primary_feeling_id: response?.data?.primary_feeling_id,
          status: response?.data?.status
        });
        
        // Check if data exists and properly format it
        if (response && response.data) {
          // Format the data if needed
          const formattedData = {
            ...response.data,
            // Make sure primary_feeling_id is a string value (not an object)
            primary_feeling_id: 
              typeof response.data.primary_feeling_id === 'object' && response.data.primary_feeling_id?._id 
                ? response.data.primary_feeling_id._id 
                : response.data.primary_feeling_id
          };
          
          console.log("Formatted data:", formattedData);
          setFeelingData(formattedData);
        } else {
          console.log("No data returned from API");
          setFeelingData({});
        }
      } catch (error) {
        console.error("Error fetching feeling data:", error);
        setFeelingData({});
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchFeeling();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      console.log("Updating feeling with ID:", id, "Data:", formData);
      
      // Use the correct update endpoint based on your API
      const response = await putCall(
        `/admin/updateSecondaryFeeling?secondary_feeling_id=${id}`,
        formData
      );
      
      console.log("Update response:", response);
      
      if (response && response.success) {
        navigate("/feeling-list"); // Redirect after successful update
      } else {
        console.error("Failed to update feeling:", response);
      }
    } catch (error) {
      console.error("Error updating feeling:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonLayout title="Edit Feeling" colSize="col-lg-8">
      {/* Only render the form when data is loaded */}
      {!isLoading && feelingData && (
        <FeelingForm
          onSubmit={handleSubmit}
          editFeelingData={feelingData}
          isEdit={true}
          isLoading={isLoading}
        />
      )}
      {isLoading && <div className="text-center">Loading feeling data...</div>}
    </CommonLayout>
  );
};

export default EditFeeling; 