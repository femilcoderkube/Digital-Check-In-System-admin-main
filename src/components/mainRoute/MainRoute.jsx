import React, { useEffect, useState } from "react";
import logo from "../../assets/img/logo.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import PrivateRoute from "../../routes/privateRoute/PrivateRoute";
import { getById } from "../../utils/api";

const MainRoute = ({ children }) => {
  // hooks
  const navigate = useNavigate();
  const userid = JSON.parse(localStorage.getItem("adminData"));
  console.log("userid", userid);
  // state hooks
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState(null); // State to hold user data

  // Simulate fetching user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getById(
          "/admin/getProfile?admin_id",
          userid?._id,
          false
        );
        console.log("response", response?.data);
        if (response?.data) {
          setUser(response?.data);
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("adminData");
        navigate("/login");
        console.log("err", error);
      }
    };
    if (userid?._id) {
      fetchData();
    }
  }, [userid?._id]);

  const isMobileView = () => window.innerWidth <= 768;

  const handleToggle = () => {
    if (isMobileView()) {
      setIsActive((prev) => !prev);
    }
  };
  const handleToggle2 = () => {
    setIsActive((prev) => !prev);
  };

  const handleLogout = () => {
    // Dummy implementation
    console.log("User logged out");
    localStorage.removeItem("token");
    localStorage.removeItem("adminData");
    // Optionally navigate to login page if needed
    navigate("/login");
  };

  const handleRouteChange = () => {
    // Clear the search query from local storage
    localStorage.setItem("searchQuery", "");
  };
  return (
    <PrivateRoute>
      <div className={isActive ? "toggle-sidebar" : ""}>
        <header
          id="header"
          className="header fixed-top d-flex align-items-center"
        >
          <div className="d-flex align-items-center justify-content-between">
            <Link to="/" className="logo d-flex align-items-center">
              <img src={logo} alt="" />
              <span className="d-none d-lg-block">
                Digital Check In System Admin
              </span>
            </Link>
            <i
              className="bi bi-list toggle-sidebar-btn"
              onClick={handleToggle2}
            ></i>
          </div>

          <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center">
              <li className="nav-item dropdown pe-3">
                <Link
                  className="nav-link nav-profile d-flex align-items-center pe-0"
                  to="#"
                  data-bs-toggle="dropdown"
                >
                  {user?.profile_photo ? (
                    <img
                      src={user.profile_photo}
                      alt="Profile"
                      className="rounded-circle"
                      width={30}
                      height={30}
                    />
                  ) : (
                    <img
                      src={logo}
                      alt="Profile"
                      className="rounded-circle"
                      width="auto"
                      height={50}
                    />
                  )}
                  <span className="d-none d-md-block dropdown-toggle ps-2">
                    {user?.first_name}
                  </span>
                </Link>

                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile custom-inset">
                  <li className="dropdown-header">
                    <h6>
                      {user?.first_name} {user?.last_name}
                    </h6>
                    <span>{user?.email}</span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center"
                      to="/profile"
                    >
                      <i className="bi bi-person"></i>
                      <span>My Profile</span>
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center"
                      to="#"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Sign Out</span>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </header>

        <aside className="sidebar">
          <ul className="sidebar-nav" id="sidebar-nav">
            {[
              { to: "/", icon: "bi-grid", label: "Dashboard" },
              // { to: "/card-list", icon: "bi-credit-card", label: "Cards" },
              { to: "/category-list", icon: "bi-tags", label: "Category" },
              { to: "/feeling-list", icon: "bi-tags ", label: "Feeling" },
              { to: "/guidance-list", icon: "bi-tags", label: "Guidance" },
              { to: "/kids-list", icon: "bi-tags", label: "Kids" },
            ].map(({ to, icon, label }) => (
              <li className="nav-item" onClick={handleToggle} key={to}>
                <NavLink
                  className="nav-link collapsed"
                  to={to}
                  onClick={handleRouteChange}
                  activeclassname="active"
                >
                  <i className={`bi ${icon}`}></i>
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}

            {/* Removed dummy data */}
          </ul>
        </aside>

        <main id="main" className="main">
          {children}
        </main>
        <footer id="footer" className="footer">
          <div className="copyright">
            &copy; Copyright{" "}
            <strong>
              <span>Digital Check In System</span>
            </strong>
            . All Rights Reserved
          </div>
          <div className="credits"></div>
        </footer>
      </div>
    </PrivateRoute>
  );
};

export default MainRoute;
