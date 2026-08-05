import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CircularTextAnimation } from "../Components/SplashScreen";

const Dashboard = () => {
  const [tableData, setTableData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [srno, setSrno] = useState([]);
  const [intendorName, setIntendorName] = useState("");
  const [projectNumber, setProjectNumber] = useState("");
  const [poNumber, setPONumber] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const [fetchProject, setFetchProject] = useState([]);
  const [fetchPO, setFetchPO] = useState([]);
  const API = import.meta.env.VITE_API_URL;
  const limit = 50;

  // This will fetch data
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/data`, {
        params: {
          page,
          limit,
          search: searchInput,
          fromDate,
          toDate,
          intendorName: intendorName,
          projectNumber: projectNumber,
          poNumber: poNumber,
          equipmentType: equipmentType,
        },
      });

      setTableData(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalRecords(res.data.total);

    } catch (err) {
      console.log(err);
    }
  };

  const fetchProjectFCN = async () => {
    try {
      const res = await axios.get(`${API}/project-number`);
      setFetchProject(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPoFCN = async () => {
    try {
      const res = await axios.get(`${API}/po-number`);
      setFetchPO(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchProjectFCN();
    fetchPoFCN();
  }, [page, debouncedSearch, fromDate, toDate, intendorName, projectNumber, poNumber, equipmentType]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, fromDate, toDate, intendorName, projectNumber, poNumber, equipmentType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleClear = () => {
    setSearchInput("");
    setFromDate("");
    setToDate("");
    setIntendorName("");
    setProjectNumber("");
    setPONumber("");
    setEquipmentType("");
  };

  return (
    <div className="flex bg-[#27374D] text-white flex-col h-screen w-full">
      <Header />

      <div className="flex-1 flex flex-col p-2 md:p-4 overflow-hidden">
        {/* Search Area */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex gap-3 sm:w-2xl">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by Asset Code, particulars of Asset, AssignedTo & Location..."
              className="w-full border border-gray-500 rounded-lg px-3 py-2 sm:py-1 outline-none focus:ring focus:ring-gray-400 text-[8px] lg:text-base"
            />

            <button
              onClick={handleClear}
              className="px-3 py-2 sm:py-1 border text-[10px] lg:text-base rounded-lg border-gray-500 cursor-pointer hover:bg-gray-500 transition-all duration-300 delay-200"
            >
              Clear
            </button>
          </div>

          <div className="flex gap-2 sm:w-4xl">
            <select className={`w-full border rounded-lg border-gray-500 px-1 py-2.5 sm:py-1 outline-none focus:ring bg-[#27374D] focus:ring-gray-400 text-[10px] lg:text-base z-50 ${intendorName === ""
              ? "text-gray-400"
              : "text-white"
              }`} value={intendorName} onChange={(e) => setIntendorName(e.target.value)}>
              <option className="text-[8px] sm:text-base" value="">
                Intendor Name
              </option>
              <option className="text-[8px] sm:text-base" value="Shiv sir">
                Shiv sir
              </option>
              <option className="text-[8px] sm:text-base" value="Praveen sir">
                Praveen sir
              </option>
              <option className="text-[8px] sm:text-base" value="Nikhil sir">
                Nikhil sir
              </option>
            </select>

            <select className={`w-full border rounded-lg border-gray-500 px-1 py-2 sm:py-1 outline-none focus:ring bg-[#27374D] focus:ring-gray-400 text-[10px] lg:text-base z-50 ${projectNumber === ""
              ? "text-gray-400"
              : "text-white"
              }`} value={projectNumber} onChange={(e) => setProjectNumber(e.target.value)}>
              <option className="text-[8px] sm:text-base" value="">
                Project Number
              </option>
              {fetchProject.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <select className={`w-full border rounded-lg border-gray-500 px-1 py-2 sm:py-1 outline-none focus:ring bg-[#27374D] focus:ring-gray-400 text-[10px] lg:text-base z-50 ${poNumber === ""
              ? "text-gray-400"
              : "text-white"
              }`} value={poNumber} onChange={(e) => setPONumber(e.target.value)}>
              <option className="text-[8px] sm:text-base" value="">
                PO Number
              </option>
              {fetchPO.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <select className={`w-full border rounded-lg border-gray-500 px-1 py-2 sm:py-1 outline-none focus:ring bg-[#27374D] focus:ring-gray-400 text-[10px] lg:text-base z-50 ${equipmentType === ""
              ? "text-gray-400"
              : "text-white"
              }`} value={equipmentType} onChange={(e) => setEquipmentType(e.target.value)}>
              <option className="text-[8px] sm:text-base" value="">
                Equipment type
              </option>
              <option className="text-[8px] sm:text-base" value="Lab Equipment">
                Lab Equipment
              </option>
              <option className="text-[8px] sm:text-base" value="Furniture">
                Furniture
              </option>
              <option className="text-[8px] sm:text-base" value="Computer/Server">
                Computer/Server
              </option>
            </select>
          </div>

          <div className="flex gap-3">
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="dd-MM-yyyy"
              placeholderText="dd-mm-yyyy"
              className="w-full text-center border rounded-lg border-gray-500 px-1 py-1 sm:py-1 outline-none focus:ring focus:ring-gray-400 text-[10px] lg:text-base z-50"
              calendarClassName="rounded-lg shadow-lg"
              popperPlacement="bottom-start"
            />

            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="dd-MM-yyyy"
              placeholderText="dd-mm-yyyy"
              className="w-full text-center border rounded-lg border-gray-500 px-1 py-1 sm:py-1 outline-none focus:ring focus:ring-gray-400 text-[10px] lg:text-base z-50"
              calendarClassName="rounded-lg shadow-lg"
              popperPlacement="bottom-start"
              minDate={fromDate}
            />
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="flex-1 rounded-xl border border-gray-500 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {(tableData?.length ?? 0) === 0 ? (
              <div className="flex h-full items-center justify-center text-xl sm:text-2xl text-gray-500">
                <CircularTextAnimation />
              </div>
            ) : (
              <table className="min-w-full table-fixed border-collapse text-[10px] lg:text-base">
                <thead className="sticky top-0 text-gray-100 bg-slate-700">
                  <tr>
                    <th className="min-w-14 lg:min-w-32 px-3 py-2 border-r border-gray-500">
                      Sr. No
                    </th>
                    <th className="min-w-24 lg:min-w-40 px-3 py-2 border-r border-gray-500">
                      Asset Code
                    </th>
                    <th className="min-w-60 lg:min-w-125 px-3 py-2 border-r border-gray-500">
                      Particulars of Asset
                    </th>
                    <th className="min-w-20 lg:min-w-40 px-3 py-2 border-r border-gray-500">
                      Date of Purchase
                    </th>
                    <th className="min-w-20 lg:min-w-40 px-3 py-2 border-r border-gray-500">
                      Cost of the Store
                    </th>
                    <th className="min-w-20 lg:min-w-40 px-3 py-2 max-w-24 border-r border-gray-500">
                      Classification of the Store
                    </th>
                    <th className="min-w-24 lg:min-w-40 px-3 py-2 border-r border-gray-500">
                      Intendor Name
                    </th>
                    <th className="min-w-24 lg:min-w-40 px-3 py-2 border-r border-gray-500">
                      Assigned To
                    </th>
                    <th className="min-w-24 lg:min-w-40 px-3 py-2">Location</th>

                  </tr>
                </thead>

                <tbody>
                  {tableData.map((row, idx) => (
                    <tr
                      key={row.id}
                      className="border border-gray-500 text-center hover:bg-slate-600"
                    >
                      <td className="px-3 py-2 w-12 border-r border-gray-500">
                        {(page - 1) * limit + idx + 1}
                      </td>
                      <td className="px-3 py-2 w-24 border-r border-gray-500">
                        {row.assetcode}
                      </td>
                      <td className="px-3 py-2 w-64 border-r border-gray-500">
                        {row.technical_specification + ", " + row.make + ", " + row.model + ", " + row.rating + ", " + row.asset_classification}
                      </td>
                      <td className="px-3 py-2 w-32 border-r border-gray-500">
                        {row.dateofpurchase?.split("T")[0]}
                      </td>
                      <td className="px-3 py-2 w-60 border-r border-gray-500">
                        {row.costofstore}
                      </td>
                      <td className="px-3 py-2 min-w-20 border-r border-gray-500">
                        {row.classification_of_store}
                      </td>
                      <td className="px-3 py-2 min-w-24 border-r border-gray-500">
                        {row.intendor_name}
                      </td>
                      <td className="px-3 py-2 min-w-24 border-r border-gray-500">
                        {row.assignedto}
                      </td>
                      <td className="px-3 py-2 min-w-24">{row.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xs sm:text-base">
            Total Records : {totalRecords}
          </span>

          <div className="flex gap-2 sm:gap-5 items-center">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-2 py-2 sm:py-0.5 border text-sm sm:text-base border-gray-500 rounded-lg disabled:opacity-50 cursor-pointer hover:bg-gray-500 transition-all duration-300 delay-200"
            >
              Previous
            </button>

            <span className="text-xs sm:text-base">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-2 py-2 sm:py-0.5 border text-sm sm:text-base border-gray-500 rounded-lg disabled:opacity-50 cursor-pointer hover:bg-gray-500 transition-all duration-300 delay-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
