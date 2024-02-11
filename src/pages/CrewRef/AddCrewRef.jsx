import { ColorRing } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const AddCrewRef = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickName, setNickName] = useState("");

  const handleCrewRef = () => {
    const missingFields = [];

    if (!lastName) missingFields.push("Last Name");
    if (!nickName) missingFields.push("Nick Name");
    if (!firstName) missingFields.push("First Name");

    if (missingFields.length > 0) {
      const missingFieldsMsg = `Please input all the following fields: ${missingFields.join(
        ", "
      )}`;
      toast.error(missingFieldsMsg);
      return;
    }
    setBtnDisable(true);
    let data = {
      firstName: firstName,
      lastName: lastName,
      nickName: nickName,
    };

    console.log(data);

    try {
      axios
        .post(`https://crew-backend-staging.vercel.app/api/crewref`, data)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setBtnDisable(false);
            toast.success("Crewref Added Successfully !");
            setTimeout(() => {
              navigate("/list-crewref");
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
  return (
    <>
      <Toaster />
      <div className="  flex justify-between items-center">
        <div></div>
        <button
          onClick={() => navigate("/list-crewref")}
          className="btn btn-neutral "
        >
          Go Back
        </button>
      </div>

      {!loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                onChange={(e) => setFirstName(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="First Name"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                onChange={(e) => setLastName(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Last Name"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nick Name</span>
              </label>
              <input
                onChange={(e) => setNickName(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Nick Name"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-center m-auto">
            <button
              disabled={btnDisable}
              onClick={handleCrewRef}
              className="btn btn-neutral"
            >
              Add Crew Ref
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

export default AddCrewRef;
