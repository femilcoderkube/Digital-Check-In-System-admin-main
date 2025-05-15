import React from "react";

const CommonLayout = ({ title, children, colSize = "col-lg-12" }) => {
  return (
    <section className="section">
      <div className="row">
        <div className={colSize}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{title}</h5>
              <div className="App">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommonLayout;
