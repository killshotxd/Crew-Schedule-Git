import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineSearch } from "react-icons/md";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
const ListUser = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [users, setUser] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    try {
      axios
        .get(
          `https://crew-backend-staging.vercel.app/api/user/all?page=${currentPage}`
        )
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setLoading(false);
            setUser(res.data.users);
            setTotalPages(res.data.count);
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
    fetchUsers();
  }, [currentPage]);

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

  const updateUsers = (user) => {
    let data = {
      isActive: user.isActive == true ? false : true,
    };
    setLoading(true);
    try {
      axios
        .put(
          `https://crew-backend-staging.vercel.app/api/user/${user._id}`,
          data
        )
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            fetchUsers();
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

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      axios
        .delete(`https://crew-backend-staging.vercel.app/api/user/${id}`)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            fetchUsers();
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
  return (
    <>
      <Toaster />
      <div className="  flex justify-between items-center flex-wrap">
        <div className="flex items-center flex-wrap  gap-2">
          {/* <div className="relative  ">
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
          </button> */}
        </div>

        <button
          onClick={() => navigate("/add-user")}
          className="btn btn-neutral "
        >
          + New User
        </button>
      </div>

      <>
        <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
          {!loading ? (
            <>
              {users ? (
                <>
                  {" "}
                  <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                      <tr>
                        <th className="py-3 px-6">Id</th>
                        <th className="py-3 px-6">User Name</th>
                        <th className="py-3 px-6">User Email</th>
                        <th className="py-3 px-6">User Role</th>
                        <th className="py-3 px-6">Status</th>
                        <th className="py-3 px-6">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                      {users?.map((item, idx) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            #{item._id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={
                                item?.isActive == true
                                  ? "badge badge-success badge-md text-white"
                                  : "badge badge-warning badge-md text-white"
                              }
                            >
                              {item.isActive == true ? "Active" : "In-Active"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => updateUsers(item)}
                              className="btn btn-outline btn-xs"
                            >
                              {item?.isActive == true ? "In-Active" : "Active"}
                            </button>

                            <button
                              onClick={() => handleDeleteModal(item)}
                              className="btn btn-error text-white ml-2 btn-xs"
                            >
                              Delete
                            </button>
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
                      Delete All Branch
                    </h3>
                  ) : (
                    <h3 className="text-lg font-medium text-gray-900">
                      Delete User
                    </h3>
                  )}

                  {productToDelete == "delete-all" ? (
                    <p>Are you sure you want to delete all branch ?</p>
                  ) : (
                    <p>
                      Are you sure you want to delete the user:{" "}
                      {productToDelete.username}?
                    </p>
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

export default ListUser;
