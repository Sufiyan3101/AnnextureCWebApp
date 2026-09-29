import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CircularTextAnimation } from "../Components/SplashScreen";
import API from '../api/api.js'
import * as XLSX from "xlsx";
import ExcelImport from "../Components/ExcelImport.jsx";


const Dashboard = () => {
  const [tableData, setTableData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [intendorName, setIntendorName] = useState("");
  const [projectNumber, setProjectNumber] = useState("");
  const [poNumber, setPONumber] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const [fetchProject, setFetchProject] = useState([]);
  const [fetchPO, setFetchPO] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [detailInfo, setDetailInfo] = useState(null);
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [showUpdateOverlay, setShowUpdateOverlay] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const limit = 50;

  // This will fetch data
  const fetchData = async () => {
    try {
      const res = await API.get(`/data`, {
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
      const res = await API.get(`/project-number`);
      setFetchProject(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPoFCN = async () => {
    try {
      const res = await API.get(`/po-number`);
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

  const handleView = (asset) => {
    setDetailInfo(asset);
    setShowOverlay(true);
  }

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;

    setUpdateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = (asset) => {
    setUpdateData({
      id: asset.id,

      asset_code: asset.assetcode || "",
      project_no: asset.project_number || "",
      po_no: asset.po_number || "",
      intendor_name: asset.intendor_name || "",
      purchaseDate: asset.dateofpurchase
        ? asset.dateofpurchase.split("T")[0]
        : "",
      technical_specification: asset.technical_specification || "",
      make: asset.make || "",
      model: asset.model || "",
      rating: asset.rating || "",
      asset_classification: asset.asset_classification || "",
      cost: asset.costofstore || "",
      store_classification: asset.classification_of_store || "",
      assignedTo: asset.assignedto || "",
      location: asset.location || "",
    });

    setShowUpdateOverlay(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!updateData.id) {
      alert("Record ID is missing");
      return;
    }

    try {
      setIsUpdating(true);

      const res = await API.put(
        `/update-data/${updateData.id}`,
        updateData
      );

      console.log("Update response:", res.data);

      alert("Data updated successfully");

      // Close update overlay
      setShowUpdateOverlay(false);

      // Refresh your table
      await fetchData();

    } catch (err) {
      console.error("Update error:", err);

      alert(
        err.response?.data?.error ||
        "Failed to update data"
      );

    } finally {
      setIsUpdating(false);
    }
  };



  return (
    <div className="flex bg-[#27374D] text-white flex-col h-screen w-full">
      <Header />

      {showExcelImport && (
        <ExcelImport
          detailInfo={detailInfo}
          onClose={() => setShowExcelImport(false)}
        />
      )}

      {showUpdateOverlay && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 overflow-y-auto">

          <div className="flex min-h-full items-start sm:items-center justify-center py-6">

            <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-4 shrink-0">

                <h2 className="text-xl font-bold text-gray-800">
                  Update Asset Information
                </h2>

                <button
                  onClick={() => setShowUpdateOverlay(false)}
                  className="rounded-lg px-3 py-1 text-xl font-bold text-gray-500 hover:bg-gray-100"
                >
                  ✕
                </button>

              </div>


              {/* Scrollable Content */}
              <form
                onSubmit={handleUpdateSubmit}
                className="overflow-y-auto pl-6 pr-6 pb-6 pt-4"
              >

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">


                  {/* Asset Code */}
                  <div className="rounded-xl border p-2">

                    <p className="text-sm text-gray-500">
                      Asset code :
                    </p>

                    <input
                      type="text"
                      name="asset_code"
                      value={updateData.asset_code || ""}
                      onChange={handleUpdateChange}
                      className="mt-1 w-full rounded-md border px-2 py-1 font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>


                  {/* Project Number */}
                  <div className="rounded-xl border p-2">

                    <p className="text-sm text-gray-500">
                      Project number :
                    </p>

                    <input
                      type="text"
                      name="project_no"
                      value={updateData.project_no || ""}
                      onChange={handleUpdateChange}
                      className="mt-1 w-full rounded-md border px-2 py-1 font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>


                  {/* PO Number */}
                  <div className="rounded-xl border p-2">

                    <p className="text-sm text-gray-500">
                      PO number :
                    </p>

                    <input
                      type="text"
                      name="po_no"
                      value={updateData.po_no || ""}
                      onChange={handleUpdateChange}
                      className="mt-1 w-full rounded-md border px-2 py-1 font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>


                  {/* Intendor Name */}
                  <div className="rounded-xl border p-2">

                    <p className="text-sm text-gray-500">
                      Intendor name :
                    </p>

                    <input
                      type="text"
                      name="intendor_name"
                      value={updateData.intendor_name || ""}
                      onChange={handleUpdateChange}
                      className="mt-1 w-full rounded-md border px-2 py-1 font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>


                  {/* Date of Purchase */}
                  <div className="rounded-xl border p-2">

                    <p className="text-sm text-gray-500">
                      Date of purchase :
                    </p>

                    <input
                      type="date"
                      name="purchaseDate"
                      value={updateData.purchaseDate || ""}
                      onChange={handleUpdateChange}
                      className="mt-1 w-full rounded-md border px-2 py-1 font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>

                  {/* Make */}
                  <div className="rounded-xl border p-2">

                    <p className="text-sm text-gray-500">
                      Make :
                    </p>

                    <input
                      type="text"
                      name="make"
                      value={updateData.make || ""}
                      onChange={handleUpdateChange}
                      className="mt-1 w-full rounded-md border px-2 py-1 font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>


                  {/* Particular of Asset */}
                  <div className="rounded-xl border p-2 sm:col-span-3 md:col-span-3">

                    <p className="text-sm text-gray-500">
                      Particular of asset :
                    </p>

                    <textarea
                      name="technical_specification"
                      value={updateData.technical_specification || ""}
                      onChange={handleUpdateChange}
                      rows={2}
                      className="mt-1 w-full resize-none rounded-md border px-2 py-1 font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>


                  


                  {/* Model */}
                  <div className="rounded-xl border p-2">

                    <p className="text-sm text-gray-500">
                      Model :
                    </p>

                    <input
                      type="text"
                      name="model"
                      value={updateData.model || ""}
                      onChange={handleUpdateChange}
                      className="mt-1 w-full rounded-md border px-2 py-1 font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>


                  {/* Rating */}
                  <div className="rounded-xl border p-2">

                    <p className="text-sm text-gray-500">
                      Rating :
                    </p>

                    <input
                      type="text"
                      name="rating"
                      value={updateData.rating || ""}
                      onChange={handleUpdateChange}
                      className="mt-1 w-full rounded-md border px-2 py-1 font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>


                  {/* Asset Classification */}
                  <div className="rounded-xl border p-2">

                    <p className="text-sm text-gray-500">
                      Asset classification :
                    </p>

                    <input
                      type="text"
                      name="asset_classification"
                      value={updateData.asset_classification || ""}
                      onChange={handleUpdateChange}
                      className="mt-1 w-full rounded-md border px-2 py-1 font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>


                  {/* Cost */}
                  <div className="rounded-xl border p-2">

                    <p className="text-sm text-gray-500">
                      Cost of store :
                    </p>

                    <input
                      type="number"
                      name="cost"
                      value={updateData.cost || ""}
                      onChange={handleUpdateChange}
                      className="mt-1 w-full rounded-md border px-2 py-1 font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>


                  {/* Classification of Store */}
                  <div className="rounded-xl border p-2">

                    <p className="text-sm text-gray-500">
                      Classification of store :
                    </p>

                    <input
                      type="text"
                      name="store_classification"
                      value={updateData.store_classification || ""}
                      onChange={handleUpdateChange}
                      className="mt-1 w-full rounded-md border px-2 py-1 font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>


                  {/* Assigned To */}
                  <div className="rounded-xl border p-2">

                    <p className="text-sm text-gray-500">
                      Assigned To :
                    </p>

                    <input
                      type="text"
                      name="assignedTo"
                      value={updateData.assignedTo || ""}
                      onChange={handleUpdateChange}
                      className="mt-1 w-full rounded-md border px-2 py-1 font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>


                  {/* Location */}
                  <div className="rounded-xl border p-2">

                    <p className="text-sm text-gray-500">
                      Location :
                    </p>

                    <input
                      type="text"
                      name="location"
                      value={updateData.location || ""}
                      onChange={handleUpdateChange}
                      className="mt-1 w-full rounded-md border px-2 py-1 font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-slate-400"
                    />

                  </div>

                </div>


                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6 border-t pt-4">

                  <button
                    type="button"
                    onClick={() => setShowUpdateOverlay(false)}
                    disabled={isUpdating}
                    className="rounded-lg border px-5 py-2 font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded-lg bg-slate-800 px-5 py-2 font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>
      )}

      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 overflow-y-auto">
          <div className="flex min-h-full items-start sm:items-center justify-center py-6">
            <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col">

              {!detailInfo ? (
                <div className="p-10 text-center">
                  Loading...
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between border-b px-6 py-4 shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">
                      Detailed Information of Asset
                    </h2>

                    <button
                      onClick={() => setShowOverlay(false)}
                      className="rounded-lg px-3 py-1 text-xl font-bold text-gray-500 hover:bg-gray-100"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="overflow-y-auto pl-6 pr-6 pb-6 pt-1">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">

                      <div className="rounded-xl border p-1">
                        <p className="text-sm text-gray-500">Asset code : </p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailInfo?.assetcode || "Not defined"}
                        </p>
                      </div>

                      <div className="rounded-xl border p-1">
                        <p className="text-sm text-gray-500">Project number : </p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailInfo?.project_number || "Not defined"}
                        </p>
                      </div>

                      <div className="rounded-xl border p-1">
                        <p className="text-sm text-gray-500">PO number : </p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailInfo?.po_number || "Not defined"}
                        </p>
                      </div>

                      <div className="rounded-xl border p-1">
                        <p className="text-sm text-gray-500">Intendor name : </p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailInfo?.intendor_name || "Not defined"}
                        </p>
                      </div>

                      <div className="rounded-xl border p-1">
                        <p className="text-sm text-gray-500">Date of purchase : </p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailInfo?.dateofpurchase
                            ? detailInfo.dateofpurchase.split("T")[0]
                            : "Not defined"}
                        </p>
                      </div>

                      <div className="rounded-xl border p-1">
                        <p className="text-sm text-gray-500">Particular of asset : </p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailInfo?.technical_specification || "Not defined"}
                        </p>
                      </div>

                      <div className="rounded-xl border p-1">
                        <p className="text-sm text-gray-500">Make : </p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailInfo?.make || "Not defined"}
                        </p>
                      </div>

                      <div className="rounded-xl border p-1">
                        <p className="text-sm text-gray-500">Model : </p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailInfo?.model || "Not defined"}
                        </p>
                      </div>

                      <div className="rounded-xl border p-1">
                        <p className="text-sm text-gray-500">Rating : </p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailInfo?.rating || "Not defined"}
                        </p>
                      </div>

                      <div className="rounded-xl border p-1">
                        <p className="text-sm text-gray-500">Asset classification : </p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailInfo?.asset_classification || "Not defined"}
                        </p>
                      </div>

                      <div className="rounded-xl border p-1">
                        <p className="text-sm text-gray-500">Cost of store : </p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailInfo?.costofstore || "Not defined"}
                        </p>
                      </div>

                      <div className="rounded-xl border p-1">
                        <p className="text-sm text-gray-500">Classification of store : </p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailInfo?.classification_of_store || "Not defined"}
                        </p>
                      </div>

                      <div className="rounded-xl border p-1">
                        <p className="text-sm text-gray-500">Assigned To : </p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailInfo?.assignedto || "Not defined"}
                        </p>
                      </div>

                      <div className="rounded-xl border p-1">
                        <p className="text-sm text-gray-500">Location : </p>
                        <p className="mt-1 font-semibold text-gray-800">
                          {detailInfo?.location || "Not defined"}
                        </p>
                      </div>

                    </div>

                  </div>

                </>
              )}
            </div>
          </div>
        </div>
      )}


      <div className="flex-1 flex flex-col p-2 md:p-4 overflow-hidden">
        {/* Search Area */}
        <div className="flex flex-col lg:flex-row gap-3 mb-4 w-full">

          {/* Search */}
          <div className="flex gap-3 w-full lg:w-[38%]">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by Asset Code, particulars of Asset, AssignedTo & Location..."
              className="w-full border border-gray-500 rounded-lg px-3 py-2 outline-none focus:ring focus:ring-gray-400 text-xs sm:text-sm lg:text-base"
            />

            <button
              onClick={handleClear}
              className="px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-500 transition-all duration-300 shrink-0 text-xs sm:text-sm lg:text-base hover:cursor-pointer"
            >
              Clear
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full lg:w-[42%]">

            <select
              className={`w-full border rounded-lg border-gray-500 px-2 py-2 bg-[#27374D] outline-none focus:ring focus:ring-gray-400 text-xs sm:text-sm lg:text-base hover:cursor-pointer ${intendorName === ""
                ? "text-gray-400"
                : "text-white"
                }`}
              value={intendorName}
              onChange={(e) => setIntendorName(e.target.value)}
            >
              <option value="">Intendor Name</option>
              <option value="Shiv sir">Shiv sir</option>
              <option value="Praveen sir">Praveen sir</option>
              <option value="Nikhil sir">Nikhil sir</option>
            </select>

            <select
              className={`w-full border rounded-lg border-gray-500 px-2 py-2 bg-[#27374D] outline-none focus:ring focus:ring-gray-400 text-xs sm:text-sm lg:text-base hover:cursor-pointer ${projectNumber === ""
                ? "text-gray-400"
                : "text-white"
                }`}
              value={projectNumber}
              onChange={(e) => setProjectNumber(e.target.value)}
            >
              <option value="">Project Number</option>

              {fetchProject.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <select
              className={`w-full border rounded-lg border-gray-500 px-2 py-2 bg-[#27374D] outline-none focus:ring focus:ring-gray-400 text-xs sm:text-sm lg:text-base hover:cursor-pointer ${poNumber === ""
                ? "text-gray-400"
                : "text-white"
                }`}
              value={poNumber}
              onChange={(e) => setPONumber(e.target.value)}
            >
              <option value="">PO Number</option>

              {fetchPO.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <select
              className={`w-full border rounded-lg border-gray-500 px-2 py-2 bg-[#27374D] outline-none focus:ring focus:ring-gray-400 text-xs sm:text-sm lg:text-base hover:cursor-pointer ${equipmentType === ""
                ? "text-gray-400"
                : "text-white"
                }`}
              value={equipmentType}
              onChange={(e) => setEquipmentType(e.target.value)}
            >
              <option value="" disabled>Equipment Type</option>
              <option value="Lab Equipment">Lab Equipment</option>
              <option value="Furniture">Furniture</option>
              <option value="Computer/Server">Computer/Server</option>
            </select>

          </div>

          {/* Dates */}
          <div className="flex gap-3 w-full lg:w-[20%]">

            <div className="w-full">
              <DatePicker
                selected={fromDate}
                onChange={(date) => setFromDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="dd-mm-yyyy"
                className="w-full px-2 border rounded-lg border-gray-500 py-2 outline-none focus:ring focus:ring-gray-400"
              />
            </div>

            <div className="w-full">
              <DatePicker
                selected={toDate}
                onChange={(date) => setToDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="dd-mm-yyyy"
                minDate={fromDate}
                className="w-full px-2 border rounded-lg border-gray-500 py-2 outline-none focus:ring focus:ring-gray-400"
              />
            </div>

          </div>

          <div className="flex gap-3 w-full lg:w-[10%]">

            <button className="px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-500 transition-all duration-300 shrink-0 text-xs sm:text-sm lg:text-base hover:cursor-pointer"
              onClick={() => setShowExcelImport(true)}>
              Import from Excel
            </button>

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
                    <th className="min-w-14 lg:min-w-28 px-3 py-2 border-r border-gray-500">
                      Sr. No
                    </th>
                    <th className="min-w-24 lg:min-w-36 px-3 py-2 border-r border-gray-500">
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
                    <th className="min-w-24 lg:min-w-40 px-3 py-2 border-r border-gray-500">Location</th>
                    <th className="min-w-24 lg:min-w-40 px-3 py-2">Action</th>

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
                      <td className="px-3 py-2 min-w-24 border-r border-gray-500">{row.location}</td>
                      <td className="px-3 py-2  min-w-24 ">
                        <div className="flex gap-2.5 justify-center items-center">
                          <button className="border px-2 py-0.5 rounded-md hover:bg-slate-800 hover:cursor-pointer hover:border-slate-800 transition-all duration-300" onClick={() => handleView(row)
                          }>View</button>
                          <button
                            className="border px-2 py-0.5 rounded-md hover:bg-green-800 hover:cursor-pointer hover:border-green-800 transition-all duration-300"
                            onClick={() => handleUpdate(row)}
                          >
                            Update
                          </button>
                        </div>
                      </td>
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
    </div >
  );
};

export default Dashboard;