import React from "react";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";

const StatisticCard = ({ title, icon, value, ClassName,setNavigate }) => {
  const navigate=useNavigate()
  return (
    <div className="col-lg-4 col-md-6 col-sm-12" onClick={()=>navigate(setNavigate)}>
      <div className={`card info-card ${ClassName}`}>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <div className="d-flex align-items-center">
            <div
              className={`card-icon rounded-circle d-flex align-items-center justify-content-center `}
              style={{ width: "60px", height: "60px" }}
            >
              <i className={`bi ${icon} `} style={{ fontSize: "24px" }}></i>
            </div>
            <div className="ps-3 ps-xl-5">
              <h6>
                <CountUp start={0} end={value || 0} duration={2.5} />
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticCard;
