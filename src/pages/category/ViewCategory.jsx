import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommonView from "../../components/commonView/CommonView";

const ViewCategory = () => {
  const { id } = useParams();
  const [categoryData, setCategoryData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        // Simulate API call to fetch category by ID
        console.log("Fetching category data for ID:", id);
        // Replace with real API call: const response = await api.getCategoryById(id);
        const response = {
          data: {
            id,
            photoTitle: "Nature",
            photoDescription: "Photos of natural landscapes, forests, and wildlife.",
            image: "https://via.placeholder.com/150", // if you have an image
          },
        };
        setCategoryData(response.data);
      } catch (error) {
        console.log("Error fetching category data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const { image, photoTitle, photoDescription } = categoryData;

  const data = [
    { key: "Category Title", value: photoTitle },
    { key: "Description", value: photoDescription },
  ];

  return (
    <CommonView
      title="Category Details"
      image={image}
      name={photoTitle}
      data={data}
      isLoading={isLoading}
    />
  );
};

export default ViewCategory;
