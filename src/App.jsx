import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { AiFillCloseCircle, AiOutlineMenu } from "react-icons/ai";
import Home from "./pages/Home";
import Login from "./pages/Login";
import logo from "./assets/logo.jpg";
import ListRos from "./pages/ROS/ListRos";
import AddRos from "./pages/ROS/AddRos";
import UpdateRos from "./pages/ROS/UpdateRos";
import ListDataFlex from "./pages/DataFlex/ListDataFlex";
import AddDataFlex from "./pages/DataFlex/AddDataFlex";
import UpdateDataFlex from "./pages/DataFlex/UpdateDataFlex";
import AddUser from "./pages/User/AddUser";
import ListUser from "./pages/User/ListUser";
import ListCrewRef from "./pages/CrewRef/ListCrewRef";
import AddCrewRef from "./pages/CrewRef/AddCrewRef";
import UpdateCrewRef from "./pages/CrewRef/UpdateCrewRef";
import ListFaq from "./pages/Faq/ListFaq";
import AddFaq from "./pages/Faq/AddFaq";
import UpdateFaq from "./pages/Faq/UpdateFaq";
import axios from "axios";
import PayReport from "./pages/Pay-Report/PayReport";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("dashboard");
  const [notActive, setNotActive] = useState(false);
  const currentUser = localStorage.getItem("uid");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const [ml, setML] = useState(false);
  console.log(name);

  const fetchUsers = () => {
    try {
      axios
        .get(
          `https://crew-backend-staging.vercel.app/api/user/me/${currentUser}`
        )
        .then((res) => {
          if (res.data.success == true) {
            console.log(res.data);
            if (res.data.user.isActive == false) {
              setNotActive(true);
              localStorage.setItem("isActive", false);
              navigate("/login");
            } else if (res.data.user.isActive == true) {
              setNotActive(false);
              localStorage.setItem("isActive", true);
            }
          } else if (res.data.success == false) {
            localStorage.clear();
            navigate("/login");
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.success == false) {
            localStorage.clear();
            navigate("/login");
          }
        })
        .finally(() => {});
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  console.log(currentUser);
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser]);
  useEffect(() => {
    if (location.pathname == "") {
      setActiveLink("dashboard");
    }
  }, [location.pathname]);

  const setMl = () => {
    if (window.innerWidth < 1023) {
      if (ml == false) {
        setML(true);
      } else {
        setML(false);
      }
    }
  };
  return (
    <>
      {currentUser && notActive == false ? (
        <section className="bg-gray-100 dark:bg-gray-900">
          <aside
            className={
              ml
                ? "fixed top-0 z-10 ml-[0] flex h-screen w-full flex-col justify-between border-r bg-white px-6 pb-3 transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%] dark:bg-gray-800 dark:border-gray-700"
                : "fixed top-0 z-10 ml-[-100%] flex h-screen w-full flex-col justify-between border-r bg-white px-6 pb-3 transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%] dark:bg-gray-800 dark:border-gray-700"
            }
          >
            <div className=" overflow-y-auto z-60 h-[90vh] overflow-x-hidden">
              <div className="-mx-6 z-60 px-6 py-4">
                {window.innerWidth < 1023 && (
                  <div className="flex items-center justify-between">
                    <h5
                      onClick={() => setMl()}
                      className="z-60 flex justify-end text-2xl font-medium text-gray-600 lg:block dark:text-white"
                    >
                      <AiFillCloseCircle />
                    </h5>
                    <button
                      onClick={handleLogout}
                      className="group flex items-center space-x-4 rounded-md px-4 py-5    text-black  "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="group-hover:text-gray-700 dark:group-hover:text-white">
                        Logout
                      </span>
                    </button>
                  </div>
                )}
                <h2 className="font-semibold text-xl mt-3">
                  Crew Schedule <span>©</span>
                </h2>
              </div>

              <div className="mt-8 text-center">
                <img
                  src={logo}
                  alt="admin"
                  className="m-auto h-10 w-10 rounded-md object-cover lg:h-28 lg:w-28"
                />
                <h5 className="mt-4 hidden text-xl font-semibold text-gray-600 lg:block dark:text-gray-300">
                  Crew Schedule
                </h5>
                <span className="hidden text-gray-400 lg:block">{role}</span>
              </div>

              <ul className="mt-8 space-y-2 tracking-wide">
                {(role == "Super_Admin" || role == "Manager") && (
                  <>
                    <li
                      onClick={() => {
                        setActiveLink("Crew Schedule Dashboard");
                        navigate("/");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="dashboard"
                        className={
                          activeLink == "Crew Schedule Dashboard"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">
                          Crew Schedule Dashboard
                        </span>
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        setActiveLink("user");
                        navigate("/list-user");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="user"
                        className={
                          activeLink == "user"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">User</span>
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        setActiveLink("ros");
                        navigate("/list-ros");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="ros"
                        className={
                          activeLink == "ros"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">
                          Add Crew to ROS
                        </span>
                      </a>
                    </li>
                    <li
                      onClick={() => {
                        setActiveLink("payreport");
                        navigate("/pay-report");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="payreport"
                        className={
                          activeLink == "payreport"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Pay Report</span>
                      </a>
                    </li>
                    {/* <li
                      onClick={() => {
                        setActiveLink("data-flex");
                        navigate("/list-dataflex");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="data-flex"
                        className={
                          activeLink == "data-flex"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Data Flex</span>
                      </a>
                    </li> */}
                    {/* <li
                      onClick={() => {
                        setActiveLink("crew-ref");
                        navigate("/list-crewref");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="crew-ref"
                        className={
                          activeLink == "crew-ref"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Crew Ref</span>
                      </a>
                    </li> */}
                    {/* <li
                      onClick={() => {
                        setActiveLink("faq");
                        navigate("/list-faq");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="faq"
                        className={
                          activeLink == "faq"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Faq</span>
                      </a>
                    </li> */}
                  </>
                )}
                {role == "Crew" && (
                  <>
                    <li
                      onClick={() => {
                        setActiveLink("dashboard");
                        navigate("/");
                        setMl();
                      }}
                    >
                      <a
                        href="#"
                        aria-label="dashboard"
                        className={
                          activeLink == "dashboard"
                            ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                            : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                        }
                      >
                        <svg
                          className="-ml-1 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                            className="dark:fill-slate-600 fill-current text-cyan-400"
                          ></path>
                          <path
                            d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                            className="fill-current text-cyan-200 group-hover:text-cyan-300"
                          ></path>
                          <path
                            d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                            className="fill-current group-hover:text-sky-300"
                          ></path>
                        </svg>
                        <span className="-mr-1 font-medium">Dashboard</span>
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="-mx-6 md:flex hidden items-center justify-between border-t px-6 pt-4 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gray-600 dark:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="group-hover:text-gray-700 dark:group-hover:text-white">
                  Logout
                </span>
              </button>
            </div>
          </aside>
          <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
            <div
              className={
                window.innerWidth < 768
                  ? " sticky md:z-50 top-0 h-16 border-b bg-white dark:bg-gray-800 dark:border-gray-700 lg:py-2.5"
                  : "sticky  md:z-50 top-0 h-16 border-b bg-white dark:bg-gray-800 dark:border-gray-700 lg:py-2.5"
              }
            >
              <div className="flex items-center justify-between space-x-4 px-4 2xl:container h-full">
                <h5
                  hidden
                  className="text-2xl font-medium text-gray-600 lg:block dark:text-white"
                >
                  {activeLink.toLocaleUpperCase()}
                </h5>
                <h5
                  onClick={() => setMl()}
                  className="text-2xl lg:hidden font-medium text-gray-600  dark:text-white"
                >
                  <AiOutlineMenu />
                </h5>
                <div className="flex space-x-4"></div>
              </div>
            </div>

            <div className="px-6 pt-6 bg-white">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/list-ros" element={<ListRos />} />
                <Route path="/add-ros" element={<AddRos />} />
                <Route path="/update-ros/:id" element={<UpdateRos />} />
                <Route path="/list-dataflex" element={<ListDataFlex />} />
                <Route path="/add-dataflex" element={<AddDataFlex />} />
                <Route
                  path="/update-dataflex/:id"
                  element={<UpdateDataFlex />}
                />
                <Route path="/add-user" element={<AddUser />} />
                <Route path="/list-user" element={<ListUser />} />
                <Route path="/list-crewref" element={<ListCrewRef />} />
                <Route path="/add-crewref" element={<AddCrewRef />} />
                <Route path="/update-crewref/:id" element={<UpdateCrewRef />} />
                <Route path="/list-faq" element={<ListFaq />} />
                <Route path="/add-faq" element={<AddFaq />} />
                <Route path="/update-faq/:id" element={<UpdateFaq />} />
                <Route path="/pay-report" element={<PayReport />} />
              </Routes>
            </div>
          </div>
        </section>
      ) : (
        <>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </>
      )}
    </>
  );
};

export default App;
