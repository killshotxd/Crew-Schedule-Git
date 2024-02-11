import { useEffect, useState } from "react";
import { Timeline } from "vis-timeline/standalone";
import axios from "axios";
import "vis-timeline/styles/vis-timeline-graph2d.css";
import { ColorRing } from "react-loader-spinner";
import toast, { Toaster } from "react-hot-toast";
import img from "../assets/colour.jpg";
import { IoIosInformationCircleOutline } from "react-icons/io";

const Home = () => {
  const [ros, setRos] = useState(null);
  const [showName, setShowName] = useState(null);
  const [showNameDropDown, setShowNameDropDown] = useState(null);
  const [crewRef, setCrewRef] = useState(null);
  const [crewRefDropDown, setCrewRefDropDown] = useState(null);
  const [itemDetailDrop, setItemDetailDrop] = useState(null);
  const [loading, setLoading] = useState(null);
  const [crewRefQuery, setCrewRefQuery] = useState("");
  const [showNameQuery, setShowNameQuery] = useState("");
  const [tierNameQuery, setTierNameQuery] = useState("");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("name");
  const fetchShowName = () => {
    setLoading(true);
    try {
      axios
        .get(`https://crew-backend-staging.vercel.app/api/dataflex/fetch`)
        .then((res) => {
          console.log("ShowNames", res.data.data);
          if (res.data.success) {
            setShowName(res.data.data);
            setShowNameDropDown(res.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
    } catch (error) {
      console.log(error);
    }
  };
  const fetchRos = () => {
    setLoading(true);
    try {
      axios
        .get(`https://crew-backend-staging.vercel.app/api/ros/list-all`)
        .then((res) => {
          console.log("ros Data", res.data.ros);
          if (res.data.success) {
            setLoading(false);
            setRos(res.data.ros);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchFaqSheetData = () => {
    try {
      axios
        .get(`https://crew-backend-staging.vercel.app/api/dataflex/faqsheet`)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setItemDetailDrop(res.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {});
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCrewRefSheetData = () => {
    setLoading(true);

    try {
      axios
        .get(
          `https://crew-backend-staging.vercel.app/api/dataflex/nick-tier
          `
        )
        .then((res) => {
          console.log("crewRef", res.data.data);
          if (res.data.success) {
            setCrewRef(res.data.data);
            setCrewRefDropDown(res.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (role && role !== "Crew") {
      fetchRos();
      fetchCrewRefSheetData();
    }

    fetchShowName();

    fetchFaqSheetData();
  }, []);

  useEffect(() => {
    if (role === "Crew" && username) {
      setCrewRefQuery(username);
    }
  }, []);

  const filterCrewRefApi = () => {
    setLoading(true);

    try {
      axios
        .get(
          `https://crew-backend-staging.vercel.app/api/dataflex/singlecrewref?query=${crewRefQuery}
          `
        )
        .then((res) => {
          console.log("crewRef", res.data);
          if (res.data.success) {
            setCrewRef(res.data.data);
            setRos(res.data.rosData);
            setShowNameQuery("");
            setCrewRefQuery("");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const filterShowNameApi = () => {
    setLoading(true);

    try {
      axios
        .get(
          `https://crew-backend-staging.vercel.app/api/dataflex/singleshowref?query=${showNameQuery}
          `
        )
        .then((res) => {
          console.log("showName", res.data);
          if (res.data.success) {
            setCrewRef(res.data.result);
            setRos(res.data.data);
            setCrewRefQuery("");
            setShowNameQuery("");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const filterTierNameApi = () => {
    setLoading(true);

    try {
      axios
        .get(
          `https://crew-backend-staging.vercel.app/api/dataflex/tierlevel?query=${tierNameQuery}
          `
        )
        .then((res) => {
          console.log("tierName", res.data);
          if (res.data.success) {
            setCrewRef(res.data.data);

            setTierNameQuery("");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (crewRefQuery) {
      filterCrewRefApi();
    }
    if (showNameQuery) {
      filterShowNameApi();
    }
    if (tierNameQuery) {
      filterTierNameApi();
    }
  }, [crewRefQuery, showNameQuery, tierNameQuery]);

  const formatDateRange = (startDate, endDate) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const startMonthName = monthNames[startDate.getMonth()];
    const startDay = startDate.getDate();
    const endMonthName = monthNames[endDate.getMonth()];
    const endDay = endDate.getDate();

    return `${startDay} ${startMonthName} - ${endDay} ${endMonthName}`;
  };
  const getColorForItemDetail = (itemDetail) => {
    // Define a mapping of itemDetail values to colors
    const colorMapping = {
      "CS - DAY RATE": "item-color-day-rate",
      "CS - TRAVEL DAY (DRIVE)": "item-color-drive",
      "CS - TRAVEL DAY (PASS)": "item-color-pass",
      "CS - TRAVEL DAY (FLY)": "item-color-FLY",
      "CS - 1/2 DAY": "item-color-onebytwoday",
      "CS - SHOW DAY - OFF": "item-color-showdayoff",
      "CS - SHOW DAY - ONCALL": "item-color-showdayoncall",
      "CS - SHOW DAY - DAY RATE": "item-color-showdayrate",
      "CS - DAY RATE * 2": "item-color-dayratetwo",
      "CS - DAY RATE * 1.5": "item-color-dayratetwo",
      "CS - WAREHOUSE - HRS": "item-color-warehouse",
      "CS - OFF - SCHEDULED": "item-color-offsched",
      "CS - OFF - UN-SCHEDULED": "item-color-unsched",
      "CS - SALARY": "item-color-salary",
    };

    // Check if the itemDetail has a corresponding color in the mapping
    return colorMapping[itemDetail] || "item-color-default";
  };
  useEffect(() => {
    // Prepare data for vis-timeline
    const items = ros?.map((item, index) => ({
      id: item._id,
      group: item?.assignedTo, // Group by crew reference nickname
      content: `${item?.show} - ${item?.itemDetail}\n${formatDateRange(
        new Date(item.startDate),
        new Date(item.endDate)
      )}`,
      title: `${item.itemDetail}`,
      start: new Date(item.startDate),
      end: new Date(item.endDate),
      className: getColorForItemDetail(item?.itemDetail),
    }));

    const groups = Array.from(new Set(crewRef?.map((crew) => crew))).map(
      (crew) => ({
        id: crew?.nickName,
        content: `${crew.nickName} - ${crew.tierLevel}`,
      })
    );

    // Create a Timeline instance
    const timeline = new Timeline(
      document.getElementById("gantt-chart"),
      items,
      groups,
      {
        horizontalScroll: true, // Enable horizontal scroll for better visibility
        stackSubgroups: false,
        showCurrentTime: false,
        stack: false, // Disable stacking to have bars side by side
        zoomMax: 1000 * 60 * 60 * 24 * 30, // Maximum zoom level to show months
        orientation: {
          axis: "top",
          item: "top",
        },
        rollingMode: {
          follow: true,
        },
        type: "range", // Use "box" style to ensure content is always expanded
        verticalScroll: true,
      }
    );
    timeline.toggleRollingMode();
    timeline.zoomOut();
    // Add custom styling
    const timelineContainer = document.getElementById("gantt-chart");
    timelineContainer.style.position = "sticky";
    timelineContainer.style.top = "0";
    // Example: Set background color for the timeline
    timelineContainer.style.backgroundColor = "#fff";

    // Example: Set font styles for the timeline content
    timelineContainer
      .querySelectorAll(".vis-item-content")
      .forEach((content) => {
        content.style.fontFamily = "Roboto, sans-serif";
        content.style.fontSize = "14px";
      });

    // Add more custom styling as needed

    return () => {
      // Clean up the timeline when the component is unmounted
      timeline.destroy();
    };
  }, [ros, crewRef]);

  return (
    <>
      <Toaster />
      <div className="flex justify-between items-center">
        {role !== "Crew" && (
          <div className="flex items-center gap-4  flex-wrap">
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="">
                Crew Ref Filter
              </label>
              <select
                onChange={(e) => setCrewRefQuery(e.target.value)}
                value={crewRefQuery}
                className="select select-bordered border-gray-300"
              >
                <option value="" selected>
                  All
                </option>
                {crewRefDropDown &&
                  crewRefDropDown.map((res) => (
                    <option value={res?.nickName} key={res.id}>
                      {res.nickName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="">
                Tier Filter
              </label>
              <select
                onChange={(e) => setTierNameQuery(e.target.value)}
                value={tierNameQuery}
                className="select select-bordered border-gray-300"
              >
                <option value="" selected>
                  All
                </option>
                {crewRefDropDown &&
                  Array.from(
                    new Set(crewRefDropDown.map((res) => res?.tierLevel))
                  )
                    .filter((tierLevel) => tierLevel !== "N/A")
                    .map((tierLevel, index) => (
                      <option value={tierLevel} key={index}>
                        {tierLevel}
                      </option>
                    ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold" htmlFor="">
                Show Name Filter
              </label>
              <select
                onChange={(e) => setShowNameQuery(e.target.value)}
                value={showNameQuery}
                className="select select-bordered border-gray-300"
              >
                <option value="" selected>
                  All
                </option>
                {showNameDropDown &&
                  showNameDropDown.map((res) => (
                    <option value={res?.quoteName} key={res.id}>
                      {res.quoteName}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col pt-2">
              <label className="font-semibold" htmlFor=""></label>
              <button
                onClick={() => {
                  fetchRos();
                  fetchCrewRefSheetData();
                  setCrewRefQuery("");
                  setShowNameQuery("");
                }}
                className="btn btn-clear"
              >
                Clear Filter
              </button>
            </div>
          </div>
        )}
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <button
          className="btn"
          onClick={() => document.getElementById("my_modal_2").showModal()}
        >
          Color Info <IoIosInformationCircleOutline />
        </button>
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <img src={img} alt="" />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>

      {!loading ? (
        <>
          <div
            id="gantt-chart"
            style={{ height: "800px" }}
            className="mt-4"
          ></div>
        </>
      ) : (
        <>
          {" "}
          <div className="flex items-center justify-center m-auto mt-12">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Home;
