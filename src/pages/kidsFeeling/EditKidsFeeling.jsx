import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommonLayout from "../../components/commonLayout/CommonLayout";
import { getById, putCall } from "../../utils/api";
import KidsForm from "../../components/kidsForm/kidsForm";
import KidsFeelingForm from "../../components/kidsFeelingForm/kidsFeelingForm";

const EditKids = () => {
  const { id } = useParams();
  const [kidsData, setkidsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchkids = async () => {
      setIsLoading(true);
      try {
        const response = await getById(
          "/admin/getSecondarykidsByID?secondary_kids_id",
          id,
          false
        );
        
        console.log("Fetched kids data:", response);
        console.log("Data structure:", {
          name: response?.data?.name,
          color_code: response?.data?.color_code,
          icon: response?.data?.icon,
          primary_kids_id: response?.data?.primary_kids_id,
          status: response?.data?.status
        });
        
        // Check if data exists and properly format it
        if (response && response.data) {
          // Format the data if needed
          const formattedData = {
            ...response.data,
            // Make sure primary_kids_id is a string value (not an object)
            primary_kids_id: 
              typeof response.data.primary_kids_id === 'object' && response.data.primary_kids_id?._id 
                ? response.data.primary_kids_id._id 
                : response.data.primary_kids_id
          };
          
          console.log("Formatted data:", formattedData);
          setkidsData(formattedData);
        } else {
          console.log("No data returned from API");
          setkidsData({});
        }
      } catch (error) {
        console.error("Error fetching kids data:", error);
        setkidsData({});
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchkids();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      console.log("Updating kids with ID:", id, "Data:", formData);
      
      // Use the correct update endpoint based on your API
      const response = await putCall(
        `/admin/updateSecondarykids?secondary_kids_id=${id}`,
        formData
      );
      
      console.log("Update response:", response);
      
      if (response && response.success) {
        navigate("/kids-list"); // Redirect after successful update
      } else {
        console.error("Failed to update kids:", response);
      }
    } catch (error) {
      console.error("Error updating kids:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonLayout title="Edit kids" colSize="col-lg-8">
      {/* Only render the form when data is loaded */}
      {!isLoading && kidsData && (
        <KidsFeelingForm
          onSubmit={handleSubmit}
          editkidsData={kidsData}
          isEdit={true}
          isLoading={isLoading}
        />
      )}
      {isLoading && <div className="text-center">Loading kids data...</div>}
    </CommonLayout>
  );
};

export default EditKids; 