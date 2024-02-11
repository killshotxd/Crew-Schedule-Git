import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
const PayReport = () => {
  const [financeData, setFinanceData] = useState();
  const [nickPayData, setNickPayData] = useState([]);
  const getFinance = () => {
    try {
      axios
        .get(`https://crew-backend-staging.vercel.app/api/dataflex/finance`)
        .then((res) => {
          if (res.data.success) {
            console.log(res.data);
            setFinanceData(res.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        })
        .finally(() => {});
    } catch (error) {
      console.log(error);
    }
  };

  const nickPay = () => {
    try {
      axios
        .get(`https://crew-backend-staging.vercel.app/api/dataflex/nick-pay`)
        .then((res) => {
          if (res.data.success) {
            console.log(res.data);
            setNickPayData(res.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        })
        .finally(() => {});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFinance();
    nickPay();
  }, []);
  const formatDate = (dateString) => {
    const [month, day, year] = dateString.split("/");
    return `${month.padStart(2, "0")}-${day.padStart(2, "0")}-20${year}`;
  };
  const formatDate2 = (dateString) => {
    const [year, month, day] = dateString.split("-"); // Splitting by "-" assuming the input date format is "YYYY-MM-DD"
    return `${month}-${day}-${year}`;
  };
  const calculateWorkDays = (startDate, endDate) => {
    // Calculate the difference in milliseconds between the two dates
    const diffInMs = Math.abs(endDate - startDate);

    // Convert the difference to days
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    // Return the difference in days
    return diffInDays + 1; // Include both start and end dates
  };

  return (
    <>
      <div>
        {financeData?.map((payPeriod, index) => (
          <div
            key={index}
            className="mt-12 shadow-sm border rounded-lg overflow-x-auto"
          >
            <div className="bg-gray-50 text-gray-600 font-medium py-3 px-6 mb-3">
              Pay Period Start: {formatDate(payPeriod.payPeriodStart)} | Pay
              Period End: {formatDate(payPeriod.payPeriodEnd)}
            </div>
            <table className="w-full table-auto text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                <tr>
                  <th className="py-3 px-6">Nickname</th>
                  <th className="py-3 px-6">Pay Rate</th>
                  <th className="py-3 px-6">Per Diem</th>
                  <th className="py-3 px-6">Work Days</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y">
                {nickPayData
                  .filter((item) => {
                    const rosItem = item.ros[0]; // Get the first element of the ros array
                    if (rosItem) {
                      // Check if rosItem is defined
                      const startDate = new Date(
                        formatDate2(rosItem.startDate)
                      );
                      const endDate = new Date(formatDate2(rosItem.endDate));
                      const payPeriodStart = new Date(
                        formatDate(payPeriod.payPeriodStart)
                      );
                      const payPeriodEnd = new Date(
                        formatDate(payPeriod.payPeriodEnd)
                      );
                      return (
                        startDate >= payPeriodStart && endDate <= payPeriodEnd
                      );
                    } else {
                      return false; // If rosItem is undefined, filter out this item
                    }
                  })
                  .map((item, index) => {
                    const startDate = new Date(
                      formatDate2(item.ros[0].startDate)
                    );
                    const endDate = new Date(formatDate2(item.ros[0].endDate));
                    const workDays = calculateWorkDays(startDate, endDate);
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.nickname}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.payRate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.perDiem}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {workDays}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </>
  );
};

export default PayReport;
