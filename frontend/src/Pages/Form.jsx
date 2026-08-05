import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import API from '../api/api'

const Form = () => {

    // This handles the state of the form data 
    const [formData, setFormData] = useState({
        asset_code: "",
        project_no: "",
        po_no: "",
        intendor_name: "",
        technical_specification: "",
        make: "",
        model: "",
        rating: "",
        asset_classification: "",
        purchaseDate: "",
        cost: "",
        store_classification: "",
        assignedTo: "",
        location: "",
    });
    const [locations, setLocations] = useState([]);
    const [projectNumber, setProjectNumber] = useState([]);
    const [assetCode, setAssetCode] = useState([]);
    const [poNumber, setPONumber] = useState([]);
    const [intendorName, setIntendorName] = useState([]);
    const [assignedTo, setAssignedTo] = useState([]);

    const fetchLocations = async () => {
        try {
            const res = await API.get(`${API}/locations`);
            setLocations(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchProjectNumber = async () => {
        try {
            const res = await axios.get(`${API}/project-number`);
            setProjectNumber(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchAssetCode = async () => {
        try {
            const res = await axios.get(`${API}/asset-code`);
            setAssetCode(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchPONumber = async () => {
        try {
            const res = await axios.get(`${API}/po-number`);
            setPONumber(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchIntendorName = async () => {
        try {
            const res = await axios.get(`${API}/intendor-name`);
            setIntendorName(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchAssignedTo = async () => {
        try {
            const res = await axios.get(`${API}/assigned-to`);
            setAssignedTo(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchLocations();
        fetchProjectNumber();
        fetchAssetCode();
        fetchPONumber();
        fetchIntendorName();
        fetchAssignedTo();
    }, []);


    // This is use to capture the form data 
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // When user click on submit button, this function runs
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${API}/post-data`,
                formData
            );

            console.log(response.data);
            alert("Data saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save data.");
        }
        handleClear();
    };

    // When user click on clear button, this function runs
    const handleClear = () => {
        setFormData({
            asset_code: "",
            project_no: "",
            po_no: "",
            intendor_name: "",
            technical_specification: "",
            make: "",
            model: "",
            rating: "",
            asset_classification: "",
            purchaseDate: "",
            cost: "",
            store_classification: "",
            assignedTo: "",
            location: "",
        });
    };

    // This function is to style CreatableSelect field
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "#253856",
            borderColor: state.isFocused ? "#94a3b8" : "#cbd5e1",
            borderRadius: "0.5rem",
            boxShadow: "none",
            "&:hover": {
                borderColor: "#94a3b8",
            },
        }),

        input: (provided) => ({
            ...provided,
            color: "#fff",
        }),

        singleValue: (provided) => ({
            ...provided,
            color: "#fff",
        }),

        placeholder: (provided) => ({
            ...provided,
            color: "#cbd5e1",
        }),

        menu: (provided) => ({
            ...provided,
            backgroundColor: "#334155",
            border: "1px solid #475569",
            zIndex: 9999,
        }),

        menuList: (provided) => ({
            ...provided,
            maxHeight: "180px",
        }),

        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
                ? "#253856"
                : state.isSelected
                    ? "#000000"
                    : "#1E293B",
            color: "#fff",
            cursor: "pointer",
        }),

        dropdownIndicator: (provided) => ({
            ...provided,
            color: "#cbd5e1",
            "&:hover": {
                color: "#fff",
            },
        }),

        indicatorSeparator: (provided) => ({
            ...provided,
            backgroundColor: "#64748b",
        }),

        clearIndicator: (provided) => ({
            ...provided,
            color: "#cbd5e1",
            "&:hover": {
                color: "#fff",
            },
        }),
    };

    return (

        // This is the main screen 

        <div className="flex flex-col min-h-screen overflow-hidden">
            <Header />

            {/* This is the overlay of the form */}

            <div className="flex-1 bg-[#27374D] p-4">
                <div className="w-full max-h-[calc(100vh-80px)] mx-auto bg-[#253856] text-white rounded-xl shadow-md p-5 overflow-auto">
                    <h2 className="text-2xl font-semibold mb-4  w-fit py-2 rounded-lg">
                        Add Asset Details
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >

                        {/* asset_code */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Asset Code
                            </label>
                            <CreatableSelect
                                menuPlacement="bottom"
                                styles={customStyles}
                                options={assetCode}
                                isClearable
                                placeholder="Select or type asset code..."
                                value={
                                    formData.asset_code
                                        ? {
                                            label: formData.asset_code,
                                            value: formData.asset_code,
                                        }
                                        : null
                                }
                                onChange={(selected) =>
                                    setFormData({
                                        ...formData,
                                        asset_code: selected ? selected.value : "",
                                    })
                                }
                                onCreateOption={(inputValue) => {
                                    const newOption = {
                                        label: inputValue,
                                        value: inputValue,
                                    };

                                    setAssetCode((prev) => [...prev, newOption]);

                                    setFormData({
                                        ...formData,
                                        asset_code: inputValue,
                                    });
                                }}
                            />
                        </div>

                        {/* project_number */}
                       <div>
                            <label className="block mb-2 font-medium">
                                Project Number
                            </label>
                            <CreatableSelect
                                menuPlacement="bottom"
                                styles={customStyles}
                                options={projectNumber}
                                isClearable
                                placeholder="Select or type project number..."
                                value={
                                    formData.project_no
                                        ? {
                                            label: formData.project_no,
                                            value: formData.project_no,
                                        }
                                        : null
                                }
                                onChange={(selected) =>
                                    setFormData({
                                        ...formData,
                                        project_no: selected ? selected.value : "",
                                    })
                                }
                                onCreateOption={(inputValue) => {
                                    const newOption = {
                                        label: inputValue,
                                        value: inputValue,
                                    };

                                    setProjectNumber((prev) => [...prev, newOption]);

                                    setFormData({
                                        ...formData,
                                        project_no: inputValue,
                                    });
                                }}
                            />
                        </div>

                        {/* po_number */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Project Number
                            </label>
                            <CreatableSelect
                                menuPlacement="bottom"
                                styles={customStyles}
                                options={poNumber}
                                isClearable
                                placeholder="Select or type po number..."
                                value={
                                    formData.po_no
                                        ? {
                                            label: formData.po_no,
                                            value: formData.po_no,
                                        }
                                        : null
                                }
                                onChange={(selected) =>
                                    setFormData({
                                        ...formData,
                                        po_no: selected ? selected.value : "",
                                    })
                                }
                                onCreateOption={(inputValue) => {
                                    const newOption = {
                                        label: inputValue,
                                        value: inputValue,
                                    };

                                    setPONumber((prev) => [...prev, newOption]);

                                    setFormData({
                                        ...formData,
                                        po_no: inputValue,
                                    });
                                }}
                            />
                        </div>

                        {/* Intendor Name */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Intendor Name
                            </label>
                            <CreatableSelect
                                menuPlacement="top"
                                styles={customStyles}
                                options={intendorName}
                                isClearable
                                placeholder="Select or type Intendor Name"
                                value={
                                    formData.intendor_name
                                        ? {
                                            label: formData.intendor_name,
                                            value: formData.intendor_name,
                                        }
                                        : null
                                }
                                onChange={(selected) =>
                                    setFormData({
                                        ...formData,
                                        intendor_name: selected ? selected.value : "",
                                    })
                                }
                                onCreateOption={(inputValue) => {
                                    const newOption = {
                                        label: inputValue,
                                        value: inputValue,
                                    };

                                    setIntendorName((prev) => [...prev, newOption]);

                                    setFormData({
                                        ...formData,
                                        intendor_name: inputValue,
                                    });
                                }}
                            />
                        </div>

                        {/* Purchase Date */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Date of Purchase
                            </label>

                            <DatePicker
                                selected={
                                    formData.purchaseDate
                                        ? new Date(formData.purchaseDate)
                                        : null
                                }
                                onChange={(date) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        purchaseDate: date ? format(date, "yyyy-MM-dd") : "",
                                    }))
                                }
                                dateFormat="dd-MM-yyyy"
                                placeholderText="dd-mm-yyyy"
                                wrapperClassName="w-full"
                                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                                calendarClassName="rounded-lg shadow-lg"
                                popperPlacement="bottom-start"
                            />
                        </div>

                        {/* Particulars */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Particulars of Asset (Technical Specification)
                            </label>
                            <textarea
                                rows={1}
                                required
                                name="technical_specification"
                                value={formData.technical_specification}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                                placeholder="Enter asset particulars..."
                            />
                        </div>

                        {/* make  */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Make
                            </label>
                            <input
                                type="text"
                                required
                                name="make"
                                value={formData.make}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                                placeholder="Enter make..."
                            />
                        </div>

                        {/* model  */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Model
                            </label>
                            <input
                                type="text"
                                required
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                                placeholder="Enter model..."
                            />
                        </div>

                        {/* rating  */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Rating
                            </label>
                            <input
                                type="text"
                                required
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                                placeholder="Enter rating..."
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">
                                Asset Classification
                            </label>
                            <select
                                name="asset_classification"
                                value={formData.asset_classification}
                                onChange={handleChange}
                                className={`w-full border rounded-lg px-3 py-2.5 bg-[#253856] border-gray-300 focus:outline-none focus:ring focus:ring-gray-400 ${formData.asset_classification === ""
                                        ? "text-gray-400"
                                        : "text-white"
                                    }`}
                            >
                                <option value="" disabled>
                                    Select Asset Classification
                                </option>
                                <option value="Lab Equipment">Lab Equipment</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Computer/Server">Computer/Server</option>
                            </select>
                        </div>


                        {/* Cost */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Cost of the Store
                            </label>
                            <input
                                type="number"
                                name="cost"
                                required
                                value={formData.cost}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 border-gray-300  focus:outline-none focus:ring focus:ring-gray-400"
                                placeholder="Enter cost"
                            />
                        </div>

                        {/* Store Classification */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Classification of the Store
                            </label>
                            <input
                                type="text"
                                required
                                name="store_classification"
                                value={formData.store_classification}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                                placeholder="Enter classification"
                            />
                        </div>

                        {/* Assigned To */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Assigned To
                            </label>
                            <CreatableSelect
                                menuPlacement="top"
                                styles={customStyles}
                                options={assignedTo}
                                isClearable
                                placeholder="Select or type Assigned Person Name"
                                value={
                                    formData.assignedTo
                                        ? {
                                            label: formData.assignedTo,
                                            value: formData.assignedTo,
                                        }
                                        : null
                                }
                                onChange={(selected) =>
                                    setFormData({
                                        ...formData,
                                        assignedTo: selected ? selected.value : "",
                                    })
                                }
                                onCreateOption={(inputValue) => {
                                    const newOption = {
                                        label: inputValue,
                                        value: inputValue,
                                    };

                                    setAssignedTo((prev) => [...prev, newOption]);

                                    setFormData({
                                        ...formData,
                                        assignedTo: inputValue,
                                    });
                                }}
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Location
                            </label>
                            <CreatableSelect
                                menuPlacement="top"
                                styles={customStyles}
                                options={locations}
                                isClearable
                                placeholder="Select or type location"
                                value={
                                    formData.location
                                        ? {
                                            label: formData.location,
                                            value: formData.location,
                                        }
                                        : null
                                }
                                onChange={(selected) =>
                                    setFormData({
                                        ...formData,
                                        location: selected ? selected.value : "",
                                    })
                                }
                                onCreateOption={(inputValue) => {
                                    const newOption = {
                                        label: inputValue,
                                        value: inputValue,
                                    };

                                    setLocations((prev) => [...prev, newOption]);

                                    setFormData({
                                        ...formData,
                                        location: inputValue,
                                    });
                                }}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="px-6 py-2 rounded-lg border border-gray-400 hover:bg-gray-200 hover:text-black transition hover:cursor-pointer"
                            >
                                Clear
                            </button>

                            <button
                                type="submit"
                                className="px-6 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-700 transition hover:cursor-pointer"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
};

export default Form;