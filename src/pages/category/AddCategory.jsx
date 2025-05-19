import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryForm from "../../components/categoryForm/categoryForm";
import CommonLayout from "../../components/commonLayout/CommonLayout";
import { postCall } from "../../utils/api";

const AddCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      console.log("Adding category with values:", values);

      // Simulate API call
      // Example: await api.addCategory(values);
      const response = await postCall("/admin/createPrimaryFeeling", values);

      if (response.success) {
        navigate("/category-list"); // navigate to category listing page
      } else {
        console.log("Failed to add category");
      }
    } catch (error) {
      console.log("Something went wrong while adding category", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonLayout title="Add Category" colSize="col-lg-8">
      <CategoryForm onSubmit={handleSubmit} isLoading={isLoading} />
    </CommonLayout>
  );
};

export default AddCategory;
