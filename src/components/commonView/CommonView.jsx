import React from "react";

const CommonView = ({ title, image, name, data, user, isLoading }) => {
  return (
    <>
      <div className="pageTitle">
        <h1>{title}</h1>
      </div>
      <section className="section profile">
        <div className="row">
          <div className="col-xl-4 mb-4">
            <div className="card" style={{ height: "100%" }}>
              <div className="card-body pt-4 d-flex flex-column align-items-center justify-content-center">
                {isLoading === "loading" ? (
                  "Loading..."
                ) : image ? (
                  <img
                    src={image}
                    alt="Card"
                    className={user ? "rounded-circle" : ""}
                    height={user ? 100 : undefined}
                    width={user ? 100 : "100%"}
                  />
                ) : user ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="136"
                    height="134"
                    fill="currentColor"
                    className="bi bi-person-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path
                      fillRule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                    />
                  </svg>
                ) : (
                  "N/A"
                )}

                <h6>
                  {isLoading === "loading" ? "Loading..." : name || "N/A"}
                </h6>
              </div>
            </div>
          </div>
          <div className="col-xl-8 mb-4">
            <div
              className="card"
              style={{ height: "100%", marginBottom: "0px" }}
            >
              <div className="card-body">
                <div className="tab-content pt-2">
                  <div className="tab-pane fade show active profile-overview pt-3">
                    {data?.map(({ key, value }, idx) => (
                      <div className="row" key={idx}>
                        <div className="col-lg-2 col-md-4 label">{key}</div>
                        <div className="col-lg-10 col-md-8">
                          {isLoading === "loading"
                            ? "Loading..."
                            : value || "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CommonView;
