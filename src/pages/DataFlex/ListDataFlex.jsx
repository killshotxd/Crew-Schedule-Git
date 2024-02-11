import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineSearch } from "react-icons/md";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";

const ListDataFlex = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [dataflex, setDataFlex] = useState(null);

  const handleSearch = () => {};

  const fetchDataFlex = () => {
    setLoading(true);
    try {
      axios
        .get(
          `https://crew-backend-staging.vercel.app/api/dataflex/all?page=${currentPage}`
        )
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            setLoading(false);
            setDataFlex(res.data.dataFlex);
            setTotalPages(res.data.dataFlexCount);
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
    fetchDataFlex();
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
  return (
    <>
      <Toaster />
      <div className="  flex justify-between items-center flex-wrap">
        {/* <div className="flex items-center flex-wrap  gap-2">
          <div className="relative  ">
            <input
              type="text"
              placeholder="Search Data Flex.."
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
          <button onClick={fetchDataFlex} className="btn btn-ghost text-black">
            Clear Search
          </button>
        </div> */}

        <button
          onClick={() => navigate("/add-dataflex")}
          className="btn btn-neutral "
        >
          + New Data Flex
        </button>
      </div>

      <>
        <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
          {!loading ? (
            <>
              {dataflex ? (
                <>
                  {" "}
                  <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                      <tr>
                        <th className="py-3 px-6">Id</th>
                        <th className="py-3 px-6">Quote Name</th>
                        <th className="py-3 px-6">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                      {dataflex?.map((item, idx) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            #{item._id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.quoteName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() =>
                                navigate(`/update-dataflex/${item._id}`)
                              }
                              className="btn btn-outline btn-xs"
                            >
                              Update
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
                  No Flex Data !
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
    </>
  );
};

export default ListDataFlex;
