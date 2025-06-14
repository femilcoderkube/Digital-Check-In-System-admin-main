import React, { useEffect, useState } from "react";
import StatCard from "../../components/commonHomeCard/StatCard";
import { getCall } from "../../utils/api";

const Home = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const response = await getCall("/admin/dashboard");
        setData(response?.data || {});
      } catch (error) {
        console.log("Error fetching dashboard data", error);
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
            <div className="col-lg-12">
              <div className="row">
                <StatCard
                  title="Total Kids"
                  icon="bi-people-fill"
                  value={isLoading ? "Loading..." : data.totalUsers}
                  ClassName="customers-card home-card"
                  setNavigate="/kids-list"
                />

                <StatCard
                  title="Total Primary Feelings"
                  icon="bi-emoji-smile"
                  value={isLoading ? "Loading..." : data.totalPrimaryFeelings}
                  ClassName="revenue-card home-card"
                  setNavigate="/category-list"
                />

                <StatCard
                  title="Total Secondary Feelings"
                  icon="bi-emoji-heart-eyes"
                  value={isLoading ? "Loading..." : data.totalSecondaryFeelings}
                  ClassName="sales-card home-card"
                  setNavigate="/feeling-list"
                />

                <StatCard
                  title="Total Users Feelings"
                  icon="bi-emoji-dizzy"
                  value={isLoading ? "Loading..." : data.totalUsersFeelings}
                  ClassName="customers-card home-card"
                  // setNavigate="/kids-list"
                />

                <StatCard
                  title="Total Guidance"
                  icon="bi-chat-square-text"
                  value={isLoading ? "Loading..." : data.totalGuidance}
                  ClassName="revenue-card home-card"
                  setNavigate="/guidance-list"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
