import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommonView from "../../components/commonView/CommonView";
import { getById } from "../../utils/api";
import CommonTable from "../../components/commonTable/CommonTable";

const ViewKids = () => {
  const { id } = useParams();
  const [kidsData, setKidsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchKids = async () => {
      setIsLoading(true);
      try {
        const response = await getById(
          "/admin/getSecondaryKidsByID?secondary_Kids_id",
          id,
          false
        );
        console.log('====================================');
        console.log(response, "Response data");
        console.log('====================================');
        
        // Set the data directly from the response
        if (response && response.data) {
          setKidsData(response.data);
        } else {
          setKidsData({});
        }
      } catch (error) {
        console.log("Error fetching Kids data", error);
        setKidsData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchKids();
  }, [id]);

  // Extract properties directly from kidsData
  const { 
    name, 
    icon, 
    color_code, 
    secondary_Kidss = [] 
  } = kidsData;

  const data = [
    { key: "Kids Name", value: name || "N/A" },
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
        title="Primary Kids Details"
        image={icon}
        name={name}
        data={data}
        isLoading={isLoading}
      />
      
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Secondary Kidss</h5>
          {secondary_Kidss && secondary_Kidss.length > 0 ? (
            <CommonTable
              columns={secondaryColumns}
              data={secondary_Kidss}
              isLoading={isLoading}
            />
          ) : (
            <p>No secondary Kidss found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewKids; 