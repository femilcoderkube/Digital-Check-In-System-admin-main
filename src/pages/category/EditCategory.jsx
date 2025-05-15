import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryForm from "../../components/categoryForm/categoryForm"; // Adjust the path if needed
import CommonLayout from "../../components/commonLayout/CommonLayout";

const EditCategory = () => {
  const { id } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate fetching category by ID (replace with actual API call)
        console.log("Fetching category data for ID:", id);
        const response = {
          data: {
            id,
            photoTitle: "Nature",
            photoDescription: "Beautiful scenery of nature.",
            photoFile: null // Assume file is not sent back, or handle differently
          }
        };
        setCategoryData(response.data);
      } catch (error) {
        console.error("Error fetching category data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      // Simulate updating category (replace with actual API call)
      console.log("Updating category with ID:", id, "Data:", formData);
      // await api.updateCategory(id, formData);
      navigate("/category-list"); // Redirect after successful update
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonLayout title="Edit Category" colSize="col-lg-8">
      <CategoryForm
        onSubmit={handleSubmit}
        editCategoryData={categoryData}
        isEdit={true}
        isLoading={isLoading}
      />
    </CommonLayout>
  );
};

export default EditCategory;
