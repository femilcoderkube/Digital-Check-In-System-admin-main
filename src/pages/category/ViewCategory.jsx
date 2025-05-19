import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommonView from "../../components/commonView/CommonView";
import { getById } from "../../utils/api";

const ViewCategory = () => {
  const { id } = useParams();
  const [categoryData, setCategoryData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const response = await getById(
          "/admin/getPrimaryFeelingByID?primary_feeling_id",
          id,
          false
        );
        setCategoryData(response?.data || {}); // Set the response data
        console.log("res", response);
      } catch (error) {
        console.log("Error fetching category data", error);
        setCategoryData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const { name, icon, color_code, status, createdAt } = categoryData;

  const data = [
    { key: "Category Name", value: name || "N/A" },
    { key: "Color Code", value: color_code || "N/A" },
    { key: "Status", value: status || "N/A" },
  ];

  return (
    <CommonView
      title="Category Details"
      image={icon} // Use 'icon' as the image
      name={name} // Use 'name' for the name prop
      data={data} // Pass the key-value pairs
      isLoading={isLoading}
    />
  );
};

export default ViewCategory;
