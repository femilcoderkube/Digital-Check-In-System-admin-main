import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommonView from "../../components/commonView/CommonView";

const ViewCard = () => {
  const { id } = useParams();
  const [cardData, setCardData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const { image, name, bank_name, network_type, type, benefits } = cardData;

  const data = [
    { key: "Card Name", value: name },
    { key: "Bank Name", value: bank_name },
    { key: "Network Type", value: network_type },
    { key: "Card Type", value: type },
    {
      key: "Benefits",
      value: benefits ? (
        <div dangerouslySetInnerHTML={{ __html: benefits }} />
      ) : (
        "N/A"
      ),
    },
  ];

  return (
    <CommonView
      title="Card details"
      image={image}
      name={name}
      data={data}
      isLoading={isLoading}
    />
  );
};

export default ViewCard;
