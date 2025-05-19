import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommonView from "../../components/commonView/CommonView";
import { getById } from "../../utils/api";
import CommonTable from "../../components/commonTable/CommonTable";

const ViewFeeling = () => {
  const { id } = useParams();
  const [feelingData, setFeelingData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFeeling = async () => {
      setIsLoading(true);
      try {
        const response = await getById(
          "/admin/getSecondaryFeelingByID?secondary_feeling_id",
          id,
          false
        );
        console.log('====================================');
        console.log(response, "Response data");
        console.log('====================================');
        
        // Set the data directly from the response
        if (response && response.data) {
          setFeelingData(response.data);
        } else {
          setFeelingData({});
        }
      } catch (error) {
        console.log("Error fetching feeling data", error);
        setFeelingData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeeling();
  }, [id]);

  // Extract properties directly from feelingData
  const { 
    name, 
    icon, 
    color_code, 
    secondary_feelings = [] 
  } = feelingData;

  const data = [
    { key: "Feeling Name", value: name || "N/A" },
    { key: "Color Code", value: color_code || "N/A" },
  ];

  const secondaryColumns = [
    {
      key: "name",
      label: "Name",
      render: (item) => item.name,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => item.status,
    },
    {
      key: "icon",
      label: "Icon",
      render: (item) => (
        item.icon ? (
          <img 
            src={item.icon} 
            alt={item.name} 
            style={{ width: "40px", height: "40px" }} 
          />
        ) : (
          "No Icon"
        )
      ),
    },
  ];

  return (
    <>
      <CommonView
        title="Feeling Details"
        image={icon}
        name={name}
        data={data}
        isLoading={isLoading}
      />
      
      
    </>
  );
};

export default ViewFeeling; 