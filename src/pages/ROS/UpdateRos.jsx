import { ColorRing } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const UpdateRos = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoadingFetch1] = useState(false);
  const [loading2, setLoadingFetch2] = useState(false);
  const [loading3, setLoadingFetch3] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const params = useParams();
  console.log(params);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventYear, setEventYear] = useState("");
  const [show, setShow] = useState("");
  const [itemDetail, setItemDetail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("PLANNED");
  const [actionType, setActionType] = useState("CREW/SCHEDULE");
  const [assignPersDrop, setAssignPersDrop] = useState("");
  const [assignPersDropDropdown, setAssignPersDropDropdown] = useState(null);
  const [fromLocationDropDown, setFromLocationDropDown] = useState(null);
  const [fromLocationDrop, setFromLocationDrop] = useState("");
  const [toLocationDrop, setToLocationDrop] = useState("");
  // const [originAddress, setOriginAddress] = useState("");
  // const [destinationAddress, setDestinationAddress] = useState("");
  // const [poFlightRefOrder, setPoFlightRefOrder] = useState("");
  // const [bookedBy, setBookedBy] = useState("");
  // const [pmtType, setPmtType] = useState("");
  // const [plannedAmount, setPlannedAmount] = useState("");
  // const [finalAmountPD, setFinalAmountPD] = useState("");
  // const [reqConfirmationOn, setReqConfirmationOn] = useState("");
  // const [confirmed, setConfirmed] = useState("");
  // const [refundable, setRefundable] = useState("");
  // const [semiEarliestArrAllowed, setSemiEarliestArrAllowed] = useState("");
  // const [semiDropDeadDate, setSemiDropDeadDate] = useState("");
  // const [semiPickUpContact, setSemiPickUpContact] = useState("");
  // const [semiDriverContact, setSemiDriverContact] = useState("");
  // const [semiCarrier, setSemiCarrier] = useState("");
  // const [semiDelContact, setSemiDelContact] = useState("");
  // const [semiStatus, setSemiStatus] = useState("");
  const [itemDetailDrop, setItemDetailDrop] = useState(null);
  function formatDateToHyphenSeparated(dateString) {
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
      return formattedDate;
    }
    return null;
  }

  const fetchShowName = () => {
    setLoadingFetch1(true);
    try {
      axios
        .get(`https://crew-backend-staging.vercel.app/api/dataflex/fetch`)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setLoading(false);
            setFromLocationDropDown(res.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
          setLoadingFetch1(false);
        })
        .finally(() => {
          setLoadingFetch1(false);
        });
    } catch (error) {
      console.log(error);
      setLoadingFetch1(false);
    }
  };
  const fetchFaqSheetData = () => {
    setLoadingFetch2(true);
    try {
      axios
        .get(`https://crew-backend-staging.vercel.app/api/dataflex/faqsheet`)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setLoadingFetch2(false);
            setItemDetailDrop(res.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
          setLoadingFetch2(false);
        })
        .finally(() => {
          setLoadingFetch2(false);
        });
    } catch (error) {
      console.log(error);
      setLoadingFetch2(false);
    }
  };

  const fetchCrewRefSheetData = () => {
    setLoadingFetch3(true);
    try {
      axios
        .get(`https://crew-backend-staging.vercel.app/api/dataflex/crewref`)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setLoadingFetch3(false);
            setAssignPersDropDropdown(res.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
          setLoadingFetch3(false);
        })
        .finally(() => {
          setLoadingFetch3(false);
        });
    } catch (error) {
      console.log(error);
      setLoadingFetch3(false);
    }
  };

  useEffect(() => {
    fetchCrewRefSheetData();
    fetchShowName();
    fetchFaqSheetData();
  }, []);
  const getRos = () => {
    setLoading(true);
    try {
      axios
        .get(`https://crew-backend-staging.vercel.app/api/ros/${params.id}`)
        .then((res) => {
          if (res.data.success) {
            const ros = res.data.ros;
            console.log(ros);

            setActionType(ros.actionType);
            setAssignPersDrop(ros.assignedTo);

            setEndDate(ros.endDate);
            setEventYear(ros.eventYear);

            setFromLocationDrop(ros.fromLocation);
            setItemDetail(ros.itemDetail);
            setNotes(ros.notes);

            setShow(ros.show);
            setStartDate(ros.startDate);
            setStatus(ros.status);

            setToLocationDrop(ros.toLocation);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setBtnDisable(false);
    }
  };

  useEffect(() => {
    getRos();
  }, []);

  const handleRos = () => {
    const missingFields = [];

    if (!startDate) missingFields.push("Start Date");
    if (!endDate) missingFields.push("End Date");

    if (!eventYear) missingFields.push("Event Year");
    if (!show) missingFields.push("Show");
    if (!itemDetail) missingFields.push("Item Detail");
    if (!notes) missingFields.push("Details/Notes");
    if (!status) missingFields.push("Status");
    if (!actionType) missingFields.push("Action Type");
    if (!assignPersDrop) missingFields.push("Assigned Person/Group");
    if (!fromLocationDrop) missingFields.push("From Location");
    if (!toLocationDrop) missingFields.push("To Location");

    if (missingFields.length > 0) {
      const missingFieldsMsg = `Please input all the following fields: ${missingFields.join(
        ", "
      )}`;
      toast.error(missingFieldsMsg);
      return;
    }
    setBtnDisable(true);
    let data = {
      startDate: startDate,
      endDate: endDate,
      eventYear: eventYear,
      show: show,
      itemDetail: itemDetail,
      notes: notes,
      status: status,
      actionType: actionType,
      assignedTo: assignPersDrop,
      fromLocation: fromLocationDrop,
      toLocation: toLocationDrop,
    };

    console.log(data);

    try {
      axios
        .put(
          `https://crew-backend-staging.vercel.app/api/ros/${params.id}`,
          data
        )
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setBtnDisable(false);
            toast.success("Ros Updated Successfully !");
            setTimeout(() => {
              navigate("/list-ros");
            }, 400);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
          setBtnDisable(false);
        })
        .finally(() => {
          setBtnDisable(false);
        });
    } catch (error) {
      console.log(error);
      setBtnDisable(false);
    }
  };

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    setStartDate(selectedDate);

    // Extract the year from the selected start date
    const selectedYear = new Date(selectedDate).getFullYear();
    setEventYear(selectedYear.toString()); // Convert to string and set as event year
  };
  return (
    <>
      <Toaster />
      <div className="  flex justify-between items-center">
        <div></div>
        <button
          onClick={() => navigate("/list-ros")}
          className="btn btn-neutral "
        >
          Go Back
        </button>
      </div>

      {!loading && !loading1 && !loading2 && !loading3 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Start Date</span>
              </label>
              <input
                onChange={handleStartDateChange}
                className="input input-bordered"
                type="date"
                value={startDate}
                // disabled
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">End Date</span>
              </label>
              <input
                onChange={(e) => setEndDate(e.target.value)}
                className="input input-bordered"
                type="date"
                value={endDate}
                // disabled
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Event Year</span>
              </label>
              <input
                value={eventYear} // Set value of the input field to eventYear
                onChange={(e) => setEventYear(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Event Year"
                // disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Show</span>
              </label>
              <select
                onChange={(e) => setShow(e.target.value)}
                value={show}
                className="select select-bordered border-gray-300"
              >
                <option value="" selected disabled>
                  Select
                </option>
                {fromLocationDropDown &&
                  fromLocationDropDown?.map((res, index) => (
                    <>
                      {" "}
                      <option key={index + 1} value={res.quoteName}>
                        {res.quoteName}
                      </option>
                    </>
                  ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Item Detail</span>
              </label>
              <select
                value={itemDetail}
                onChange={(e) => setItemDetail(e.target.value)}
                className="select select-bordered border-gray-300"
              >
                <option value="" selected disabled>
                  Select
                </option>
                {itemDetailDrop &&
                  itemDetailDrop?.map((res, index) => (
                    <>
                      {" "}
                      <option key={index + 1} value={res.item}>
                        {res.item}
                      </option>
                    </>
                  ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Details/Notes</span>
              </label>
              <input
                onChange={(e) => setNotes(e.target.value)}
                value={notes}
                className="input input-bordered"
                type="text"
                placeholder="Notes"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <input
                onChange={(e) => setStatus(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Status"
                value={status}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Action Type</span>
              </label>
              <input
                onChange={(e) => setActionType(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Action Type"
                value={actionType}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Assigned Person/Group</span>
              </label>
              <select
                onChange={(e) => setAssignPersDrop(e.target.value)}
                className="select select-bordered border-gray-300"
                value={assignPersDrop}
              >
                <option value="" selected disabled>
                  Select
                </option>
                {assignPersDropDropdown &&
                  assignPersDropDropdown?.map((res, index) => (
                    <option key={index + 1} value={res.nickName}>
                      {res.nickName}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text">From Location</span>
              </label>
              <select
                onChange={(e) => setFromLocationDrop(e.target.value)}
                value={fromLocationDrop}
                className="select select-bordered border-gray-300"
              >
                <option value="" selected disabled>
                  Select
                </option>
                {fromLocationDropDown &&
                  fromLocationDropDown?.map((res, index) => (
                    <>
                      {" "}
                      <option key={index + 1} value={res.quoteName}>
                        {res.quoteName}
                      </option>
                    </>
                  ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">To Location</span>
              </label>
              <select
                onChange={(e) => setToLocationDrop(e.target.value)}
                className="select select-bordered border-gray-300"
                value={toLocationDrop}
              >
                <option value="" selected disabled>
                  Select
                </option>
                {fromLocationDropDown &&
                  fromLocationDropDown?.map((res, index) => (
                    <option key={index + 1} value={res.quoteName}>
                      {res.quoteName}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          {/* 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Origin Address</span>
              </label>
              <input
                onChange={(e) => setOriginAddress(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Origin Address"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Destination Address</span>
              </label>
              <input
                onChange={(e) => setDestinationAddress(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Destination Address"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">PO#/Flight/Ref/ORDER #</span>
              </label>
              <input
                onChange={(e) => setPoFlightRefOrder(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="PO#/Flight/Ref/ORDER #"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Booked By</span>
              </label>
              <input
                onChange={(e) => setBookedBy(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Booked By"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">PMT Type</span>
              </label>
              <input
                onChange={(e) => setPmtType(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="PMT Type"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Planned Amount</span>
              </label>
              <input
                onChange={(e) => setPlannedAmount(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Planned Amount"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Final Amount PD</span>
              </label>
              <input
                onChange={(e) => setFinalAmountPD(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Final Amount PD"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  REQUIRES CONFIRMATION (5 DAYS PRIOR)
                </span>
              </label>
              <input
                onChange={(e) => setReqConfirmationOn(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="REQUIRES CONFIRMATION (5 DAYS PRIOR)"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirmed</span>
              </label>
              <input
                onChange={(e) => setConfirmed(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Confirmed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Refundable ?</span>
              </label>
              <input
                onChange={(e) => setRefundable(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Refundable ?"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Semi-Earliest Arrival Allowed
                </span>
              </label>
              <input
                onChange={(e) => setSemiEarliestArrAllowed(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Semi-Earliest Arrival Allowed"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Semi-Drop Dead Date</span>
              </label>
              <input
                onChange={(e) => setSemiDropDeadDate(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Semi-Drop Dead Date"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Semi-PickupContact</span>
              </label>
              <input
                onChange={(e) => setSemiPickUpContact(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Semi-PickupContact"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Semi-Driver Contact</span>
              </label>
              <input
                onChange={(e) => setSemiDriverContact(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Semi-Driver Contact"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Semi-Carrier</span>
              </label>
              <input
                onChange={(e) => setSemiCarrier(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Semi-Carrier"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Semi-Delivery Contact</span>
              </label>
              <input
                onChange={(e) => setSemiDelContact(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Semi-Delivery Contact"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Semi-Status</span>
              </label>
              <input
                onChange={(e) => setSemiStatus(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Semi-Status"
              />
            </div>
          </div> */}

          <div className="mt-8 flex justify-center m-auto">
            <button
              disabled={btnDisable}
              onClick={handleRos}
              className="btn btn-neutral"
            >
              Update Ros
            </button>
          </div>
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

export default UpdateRos;
