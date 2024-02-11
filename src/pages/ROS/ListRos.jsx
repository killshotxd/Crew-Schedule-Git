import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineSearch } from "react-icons/md";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
const ListRos = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [ros, setRos] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleSearch = () => {
    setLoading(true);
    try {
      axios
        .get(
          `https://crew-backend-staging.vercel.app/api/ros/search?query=${searchQuery}&page=${currentPage}`
        )
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setLoading(false);
            setRos(res.data.ros);
            setTotalPages(res.data.rosCount);
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
      setLoading(false);
    }
  };

  function formatDateToHyphenSeparated(dateString) {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const formattedDate = `${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}-${year}`;
      return formattedDate;
    }
    return null;
  }

  const fetchRos = () => {
    setSearchQuery("");
    setLoading(true);
    try {
      axios
        .get(
          `https://crew-backend-staging.vercel.app/api/ros/all?page=${currentPage}`
        )
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setLoading(false);
            setRos(res.data.ros);
            setTotalPages(res.data.rosCount);
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
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRos();
  }, [currentPage]);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      axios
        .delete(`https://crew-backend-staging.vercel.app/api/ros/${id}`)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            fetchRos();
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
      setLoading(false);
    }
  };

  const handleDeleteModal = (product) => {
    // Find the product to delete based on productId
    console.log(product);
    // Set the product to delete and open the modal
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // Call your delete function here with productToDelete
    // ...
    if (productToDelete == "delete-all") {
      handleDelete("delete-all");
    }
    handleDelete(productToDelete._id);
    // Close the modal
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const cancelDelete = () => {
    // Close the modal without deleting
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const maxPage = Math.ceil(totalPages / 10);
    console.log(maxPage);
    for (let i = 1; i <= maxPage; i++) {
      pageNumbers.push(i);
    }

    let startPage;
    let endPage;

    if (maxPage <= maxPagesToShow) {
      startPage = 1;
      endPage = maxPage;
    } else {
      if (currentPage <= maxPagesToShow - 2) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + 1 >= maxPage) {
        startPage = maxPage - maxPagesToShow + 1;
        endPage = maxPage;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 2;
      }
    }

    const visiblePages = pageNumbers.slice(startPage - 1, endPage);
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === maxPage;

    return (
      <nav className="mt-12 flex justify-center">
        <ul className="join ">
          <li className="page-item">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-4 py-2 cursor-pointer rounded-md  mx-1 ${
                isFirstPage ? "disabled" : ""
              }`}
              disabled={isFirstPage}
            >
              Previous
            </button>
          </li>
          {visiblePages?.map((number) => (
            <li key={number} className="page-item">
              <button
                onClick={() => handlePageChange(number)}
                className={`${
                  currentPage === number ? "bg-gray-400 text-white" : ""
                } px-4 py-2 mx-1 rounded-md`}
              >
                {number}
              </button>
            </li>
          ))}
          <li className="page-item">
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-4 py-2 cursor-pointer mx-1 bg-black rounded-md text-white ${
                isLastPage ? "disabled" : ""
              }`}
              disabled={isLastPage}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <>
      <Toaster />
      <div className="  flex justify-between items-center flex-wrap">
        <div className="flex items-center flex-wrap  gap-2">
          <div className="relative  ">
            <input
              type="text"
              placeholder="Search Ros.."
              className="input input-bordered input-info w-full focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span
              onClick={() => handleSearch()}
              className=" cursor-pointer absolute heroSearchBtn"
            >
              <MdOutlineSearch className="text-white" size={24} />
            </span>
          </div>
          <button onClick={fetchRos} className="btn btn-ghost text-black">
            Clear Search
          </button>
        </div>

        <button
          onClick={() => navigate("/add-ros")}
          className="btn btn-neutral "
        >
          + New ROS
        </button>
      </div>

      <>
        <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
          {!loading ? (
            <>
              {ros ? (
                <>
                  {" "}
                  <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                      <tr>
                        <th className="py-3 px-6">Id</th>
                        <th className="py-3 px-6">Start Date</th>
                        <th className="py-3 px-6">End Date</th>
                        {/* <th className="py-3 px-6">Time</th> */}
                        <th className="py-3 px-6">Event Year</th>
                        <th className="py-3 px-6">Show</th>
                        <th className="py-3 px-6">Item Detail</th>
                        <th className="py-3 px-6">Details/Notes</th>
                        <th className="py-3 px-6">Status</th>
                        <th className="py-3 px-6">Action Type</th>
                        <th className="py-3 px-6">Assigned Person/Group</th>
                        <th className="py-3 px-6">From Location</th>
                        <th className="py-3 px-6">To Location</th>
                        {/* <th className="py-3 px-6">Origin Address</th>
                        <th className="py-3 px-6">Destination Address</th>
                        <th className="py-3 px-6">PO#/Flight/Ref/ORDER #</th>
                        <th className="py-3 px-6">Booked By</th>
                        <th className="py-3 px-6">PMT Type</th>
                        <th className="py-3 px-6">Planned Amount</th> */}
                        {/* <th className="py-3 px-6">
                          REQUIRES CONFIRMATION (5 DAYS PRIOR)
                        </th>
                        <th className="py-3 px-6">Confirmed</th>
                        <th className="py-3 px-6">Refundable</th>
                        <th className="py-3 px-6">
                          Semi-Earliest Arrival Allowed
                        </th>
                        <th className="py-3 px-6">Semi-Drop Dead Date</th>
                        <th className="py-3 px-6">Semi-PickupContact</th>
                        <th className="py-3 px-6">Semi-Driver Contact</th>
                        <th className="py-3 px-6">Semi-Carrier</th>
                        <th className="py-3 px-6">Semi-Delivery Contact</th>
                        <th className="py-3 px-6">Semi-Status</th> */}
                        <th className="py-3 px-6">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                      {ros?.map((item, idx) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            #{item._id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDateToHyphenSeparated(item.startDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDateToHyphenSeparated(item.endDate)}
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            {item.time}
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.eventYear}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.show}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.itemDetail}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.notes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.actionType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.assignedTo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.fromLocation}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.toLocation}
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            {item.originAddress}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.destinationAddress}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.ref}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.bookedBy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.pmtType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.plannedAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.finalAmountPaid}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.requiresConfirmation}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.confirmed}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.refundable}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.semiEarliest}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.semiDrop}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.semiPickup}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.semiDriver}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.semiCarrier}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.semiDelivery}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.semiStatus}
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() =>
                                navigate(`/update-ros/${item._id}`)
                              }
                              className="btn btn-outline btn-xs"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDeleteModal(item)}
                              className="btn btn-error text-white ml-2 btn-xs"
                            >
                              Delete
                            </button>
                            {/* <button
                              onClick={() =>
                                updateStatus(item._id, item.isActive)
                              }
                              className="btn btn-outline btn-xs ml-2"
                              disabled={btnDisable}
                            >
                              {item.isActive !== true ? "Active" : "In-Active"}
                            </button> */}

                            {/* {role == "Super_Admin" && (
                              <button
                                onClick={() => handleDeleteModal(item)}
                                className="btn btn-error  btn-xs text-white ml-2"
                              >
                                Delete
                              </button>
                            )} */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className="flex justify-center py-4 font-semibold">
                  No Ros Data !
                </div>
              )}
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
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              </div>
            </>
          )}
        </div>
        {renderPagination()}
      </>
      {isDeleteModalOpen && productToDelete && (
        <>
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  {productToDelete == "delete-all" ? (
                    <h3 className="text-lg font-medium text-gray-900">
                      Delete All Ros
                    </h3>
                  ) : (
                    <h3 className="text-lg font-medium text-gray-900">
                      Delete Ros
                    </h3>
                  )}

                  {productToDelete == "delete-all" ? (
                    <p>Are you sure you want to delete all ros ?</p>
                  ) : (
                    <p>Are you sure you want to delete the ros?</p>
                  )}
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={confirmDelete}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    No, Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ListRos;
