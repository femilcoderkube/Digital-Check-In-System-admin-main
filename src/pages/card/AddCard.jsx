import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardForm from "../../components/cardForm/cardForm";
import CommonLayout from "../../components/commonLayout/CommonLayout";

const AddCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Simulate an API call to add a card
      console.log("Adding card with values:", values);
      // Here you would typically call your API to add the card
      // const response = await api.addCard(values);
      // Simulate successful response
      const response = { success: true }; // Mock response

      if (response.success) {
        navigate("/card-list");
      } else {
        console.log("Failed to add card");
      }
    } catch (error) {
      console.log("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonLayout title="Add Card" colSize="col-lg-8">
      <CardForm onSubmit={handleSubmit} isLoading={isLoading} />
    </CommonLayout>
  );
};

export default AddCard;
