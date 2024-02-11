import { ColorRing } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const AddFaq = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);

  const [itemDetail, setItemDetail] = useState("");

  const handleRos = () => {
    const missingFields = [];

    if (!itemDetail) missingFields.push("Item Detail");

    if (missingFields.length > 0) {
      const missingFieldsMsg = `Please input all the following fields: ${missingFields.join(
        ", "
      )}`;
      toast.error(missingFieldsMsg);
      return;
    }
    setBtnDisable(true);
    let data = {
      itemDetail: itemDetail,
    };

    console.log(data);

    try {
      axios
        .post(`https://crew-backend-staging.vercel.app/api/faq`, data)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setBtnDisable(false);
            toast.success("Faq Added Successfully !");
            setTimeout(() => {
              navigate("/list-faq");
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
          onClick={() => navigate("/list-faq")}
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
                <span className="label-text">Item Detail</span>
              </label>
              <input
                onChange={(e) => setItemDetail(e.target.value)}
                className="input input-bordered"
                type="text"
                placeholder="Item Detail"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-center m-auto">
            <button
              disabled={btnDisable}
              onClick={handleRos}
              className="btn btn-neutral"
            >
              Add Faq
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

export default AddFaq;
