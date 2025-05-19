import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommonView from "../../components/commonView/CommonView";
import { getById, getCall } from "../../utils/api";

const ViewGuidance = () => {
  const { id } = useParams();
  const [guidanceData, setGuidanceData] = useState({});
  const [primaryFeeling, setPrimaryFeeling] = useState({});
  const [secondaryFeeling, setSecondaryFeeling] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
        
        console.log("Guidance response:", response);
        
        if (response?.data) {
          setGuidanceData(response.data);
          
          // Fetch primary feeling details if we have an ID
          if (response.data.primary_feeling_id) {
            try {
              const primaryResponse = await getById(
                "/admin/getPrimaryFeelingByID?primary_feeling_id",
                response.data.primary_feeling_id,
                false
              );
              if (primaryResponse?.data) {
                setPrimaryFeeling(primaryResponse.data);
              }
            } catch (error) {
              console.error("Error fetching primary feeling:", error);
            }
          }
          
          // Fetch secondary feeling details if we have an ID
          if (response.data.secondary_feeling_id) {
            try {
              const secondaryResponse = await getById(
                "/admin/getSecondaryFeelingByID?secondary_feeling_id",
                response.data.secondary_feeling_id,
                false
              );
              if (secondaryResponse?.data) {
                setSecondaryFeeling(secondaryResponse.data);
              }
            } catch (error) {
              console.error("Error fetching secondary feeling:", error);
            }
          }
        } else {
          setGuidanceData({});
        }
      } catch (error) {
        console.error("Error fetching guidance data:", error);
        setGuidanceData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuidance();
  }, [id]);

  const {
    title,
    description,
    profile_photo,
    createdAt,
  } = guidanceData;

  // Format the createdAt date to show only YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Extract YYYY-MM-DD part
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  console.log(guidanceData)
  const data = [
    { key: "Title", value: title || "N/A" },
    { key: "Primary Feeling", value: guidanceData.primary_feeling_id?.name || "N/A" },
    { key: "Secondary Feeling", value: guidanceData.secondary_feeling_id?.name || "N/A" },
    { key: "Description", value: description || "N/A" },
  ];

  return (
    <CommonView
      title="Guidance Details"
      image={profile_photo}
      name={title}
      data={data}
      isLoading={isLoading}
    />
  );
};

export default ViewGuidance;