import React, { useEffect, useState } from "react";
import StatCard from "../../components/commonHomeCard/StatCard";

const Home = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulate an API call to fetch dashboard data
        console.log("Fetching dashboard data...");
        // Here you would typically call your API to get the dashboard data
        // const response = await api.getDashboard();
        // Simulate successful response
        const response = {
          banks: 10,
          cards: 50,
          outlets: 20,
          users: 100,
          offers: 5,
        }; // Mock response
        setData(response);
      } catch (error) {
        console.log("Error fetching dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <div className="pageTitle">
        <h1>Dashboard</h1>
        <section className="section dashboard">
          <div className="row">
            {/* Left side columns */}
            <div className="col-lg-12">
              <div className="row">
                {/* Bank Card */}
                <StatCard
                  title="Total Banks"
                  icon="bi bi-bank2"
                  value={isLoading ? "Loading..." : data.banks}
                  ClassName="revenue-card home-card"
                  setNavigate="/bank-list"
                />
                {/* End Sales Bank */}

                <StatCard
                  title="Total Cards"
                  icon="bi-credit-card"
                  value={isLoading ? "Loading..." : data.cards}
                  ClassName="sales-card home-card"
                  setNavigate="/card-list"
                />

                <StatCard
                  title="Total Outlets"
                  icon="bi-compass-fill"
                  value={isLoading ? "Loading..." : data.outlets}
                  ClassName="customers-card home-card"
                  setNavigate="/outlet-list"
                />
                <StatCard
                  title="Total Users"
                  icon="bi-people-fill"
                  value={isLoading ? "Loading..." : data.users}
                  ClassName="customers-card home-card"
                  setNavigate="/user-list"
                />
                <StatCard
                  title="Total Offers"
                  icon="bi-megaphone"
                  value={isLoading ? "Loading..." : data.offers}
                  ClassName="revenue-card home-card"
                  setNavigate="/offer-list"
                />
              </div>
            </div>
            {/* End Left side columns */}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
