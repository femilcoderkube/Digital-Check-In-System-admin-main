import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CardForm from "../../components/cardForm/cardForm";
import CommonLayout from "../../components/commonLayout/CommonLayout";

const EditCard = () => {
  const { id } = useParams();
  const [cardData, setCardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate an API call to fetch card data by ID
        console.log("Fetching card data for ID:", id);
        // Here you would typically call your API to get the card data
        // const response = await api.getCardById(id);
        // Simulate successful response
        const response = { data: { id, name: "Sample Card", bank_name: "Sample Bank", network_type: "Visa", type: "Credit", benefits: "Some benefits" } }; // Mock response
        setCardData(response.data);
      } catch (error) {
        console.log("Error fetching card data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      // Simulate an API call to update the card
      console.log("Updating card with ID:", id, "and data:", formData);
      // Here you would typically call your API to update the card
      // await api.updateCard({ id, formData });
      navigate("/card-list");
    } catch (error) {
      console.log("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonLayout title="Edit Card" colSize="col-lg-8">
      <CardForm
        onSubmit={handleSubmit}
        editCardData={cardData}
        isEdit={true}
        isLoading={isLoading}
      />
    </CommonLayout>
  );
};

export default EditCard;
