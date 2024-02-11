import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineSearch } from "react-icons/md";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
const AddUser = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [btnDisable, setBtnDisable] = useState(false);
  // const [isActive, setIsActive] = useState(true);
  const handleRos = () => {
    const missingFields = [];

    if (!userEmail) missingFields.push("User Email");
    if (!userName) missingFields.push("User Name");
    if (!password) missingFields.push("Password");
    if (!userRole) missingFields.push("Role");

    if (missingFields.length > 0) {
      const missingFieldsMsg = `Please input all the following fields: ${missingFields.join(
        ", "
      )}`;
      toast.error(missingFieldsMsg);
      return;
    }
    setBtnDisable(true);
    let data = {
      email: userEmail,
      password: password,
      role: userRole,
      username: userName,
      // isActive: isActive,
    };

    console.log(data);

    try {
      axios
        .post(`https://crew-backend-staging.vercel.app/api/user/register`, data)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setBtnDisable(false);
            toast.success("User Added Successfully !");
            setTimeout(() => {
              navigate("/list-user");
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
          onClick={() => navigate("/list-user")}
          className="btn btn-neutral "
        >
          Go Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="form-control">
          <label className="label">
            <span className="label-text">User Name</span>
          </label>
          <input
            onChange={(e) => setUserName(e.target.value)}
            className="input input-bordered"
            type="text"
            placeholder="User Name"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">User Email</span>
          </label>
          <input
            onChange={(e) => setUserEmail(e.target.value)}
            className="input input-bordered"
            type="text"
            placeholder="User Email"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
        <div className="form-control">
          <label className="label">
            <span className="label-text">User Password</span>
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered"
            type="text"
            placeholder="Password"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">User Role</span>
          </label>
          <select
            className="select select-bordered border-gray-300"
            onChange={(e) => setUserRole(e.target.value)}
          >
            <option value="" selected disabled>
              Please select a role
            </option>
            <option value="Super_Admin">Super Admin</option>
            <option value="Manager">Manager</option>
            <option value="Crew">Crew</option>
          </select>
        </div>
        {/* <div className="form-control">
          <label className="label">
            <span className="label-text">Is-Active</span>
          </label>
          <input
            type="checkbox"
            className="toggle toggle-error"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />
        </div> */}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleRos}
          disabled={btnDisable}
          className="btn btn-neutral"
        >
          Add User
        </button>
      </div>
    </>
  );
};

export default AddUser;
