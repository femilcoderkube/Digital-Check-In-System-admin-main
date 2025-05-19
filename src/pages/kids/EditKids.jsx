import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommonLayout from "../../components/commonLayout/CommonLayout";
import { getById, putCall } from "../../utils/api";
import KidsForm from "../../components/kidsForm/kidsForm";

const EditKids = () => {
  const { id } = useParams();
  const [kidsData, setKidsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKids = async () => {
      setIsLoading(true);
      try {
        const response = await getById(
          "/kids/getKidsByID?kid_id",
          id,
          false
        );
        
        console.log("Fetched kids data:", response);
        console.log("Data structure:", {
          username: response?.data?.username,
          first_name: response?.data?.first_name,
          last_name: response?.data?.last_name
        });
        
        // Check if data exists and properly format it
        if (response && response.data) {
          // Format the data if needed
          // const formattedData = {
          //   ...response.data,
          //   // Make sure primary_kids_id is a string value (not an object)
          //   primary_kids_id: 
          //     typeof response.data.primary_kids_id === 'object' && response.data.primary_kids_id?._id 
          //       ? response.data.primary_kids_id._id 
          //       : response.data.primary_kids_id
          // };
          
          console.log("Formatted data:", response?.data);
          setKidsData(response?.data);
        } else {
          console.log("No data returned from API");
          setKidsData({});
        }
      } catch (error) {
        console.error("Error fetching kids data:", error);
        setKidsData({});
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchKids();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      console.log("Updating kids with ID:", id, "Data:", formData);
      
      // Use the correct update endpoint based on your API
      const response = await putCall(
        `/kids/updateKids?kid_id=${id}`,
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
        <KidsForm
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