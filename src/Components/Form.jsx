import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const Form = () => {

    // This handles the state of the form data 
    const [formData, setFormData] = useState({
        particulars: "",
        purchaseDate: "",
        cost: "",
        classification: "",
        assignedTo: "",
        location: "",
    });
    const [locations, setLocations] = useState([]);
    const API = import.meta.env.VITE_API_URL;

    const fetchLocations = async () => {
        try {
            const res = await axios.get(`${API}/locations`);
            setLocations(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchLocations();
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
            particulars: "",
            purchaseDate: "",
            cost: "",
            classification: "",
            assignedTo: "",
            location: "",
        });
    };

    // This function is to style location field
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

        <div className="flex flex-col min-h-screen">
            <Header />

            {/* This is the overlay of the form */}

            <div className="flex-1 bg-[#27374D] p-4 md:p-8">
                <div className="w-full mx-auto bg-[#253856] text-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-6  w-fit py-2 rounded-lg">
                        Add Asset Details
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Particulars */}
                        <div className="md:col-span-2">
                            <label className="block mb-2 font-medium">
                                Particulars of Asset
                            </label>
                            <textarea
                                rows={9}
                                required
                                name="particulars"
                                value={formData.particulars}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                                placeholder="Enter asset particulars..."
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

                        {/* Classification */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Classification of the Store
                            </label>
                            <input
                                type="text"
                                required
                                name="classification"
                                value={formData.classification}
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
                            <input
                                type="text"
                                required
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                                placeholder="Enter assignee"
                            />
                        </div>

                        {/* Location */}
                        <div className="md:col-span-2">
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
                        <div className="md:col-span-2 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="px-6 py-2 rounded-lg border border-gray-400 hover:bg-gray-200 transition hover:cursor-pointer"
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
            </div>
        </div>
    );
};

export default Form;