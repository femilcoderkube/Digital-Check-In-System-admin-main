import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryForm from "../../components/categoryForm/categoryForm"; // Adjust the path if needed
import CommonLayout from "../../components/commonLayout/CommonLayout";
import { getById, putCall } from "../../utils/api";

const EditCategory = () => {
  const { id } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (categoryData) {
      console.log("categoryData", categoryData);
    }
  }, [categoryData]);

  const navigate = useNavigate();

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
      } catch (error) {
        console.log("Error fetching category data", error);
        setCategoryData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      // Simulate updating category (replace with actual API call)
      console.log("Updating category with ID:", id, "Data:", formData);
      const response = await putCall(
        `/admin/updatePrimaryFeeling?primary_feeling_id=${id}`,
        formData
      );
      console.log("res", response);
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
