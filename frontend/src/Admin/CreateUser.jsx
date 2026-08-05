import React, { useState } from 'react'
import Header from '../Components/Header';
import axios from "axios";
import API from '../api/api.js'

const CreateUser = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        role: "",
        alternate_email: "",
        designation: "",
    });
    const [message, setMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);

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
            const response = await API.post(
                `/user-add`,
                formData
            );
            setMessage(response.data.message);
            setShowAlert(true);
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
            setShowAlert(true);
        }
        handleClear();
    };

    // When user click on clear button, this function runs
    const handleClear = () => {
        setFormData({
            name: "",
            email: "",
            mobile: "",
            password: "",
            role: "",
            alternate_email: "",
            designation: "",
        });
    };

    return (

        // This is the main screen 

        <div className="flex flex-col min-h-screen overflow-hidden">
            <Header />

            {/* ── Alert ── */}
            {showAlert && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
                    <div className="bg-green-800 rounded-2xl p-5 w-80 shadow-xl">
                        <p className="text-lg font-bold text-white mb-1">Alert</p>
                        <p className="text-sm text-white mb-5">{message}</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowAlert(false)}
                                className="px-4 py-1.5 border border-white text-white text-sm rounded-lg
                              hover:bg-white hover:text-green-800 transition-all duration-300 cursor-pointer"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* This is the overlay of the form */}

            <div className="flex-1 bg-[#27374D] p-4">
                <div className="w-full max-h-[calc(100vh-80px)] mx-auto bg-[#253856] text-white rounded-xl shadow-md p-5 overflow-auto">
                    <h2 className="text-2xl font-semibold mb-4  w-fit py-2 rounded-lg">
                        Add New User
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >

                        {/* name  */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Name
                            </label>
                            <input
                                type="text"
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                                placeholder="Enter name..."
                            />
                        </div>

                        {/* email  */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                                placeholder="Enter email..."
                            />
                        </div>

                        {/* alternate email  */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Alternate Email
                            </label>
                            <input
                                type="email"
                                name="alternate_email"
                                value={formData.alternate_email}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                                placeholder="Enter alternate email (optional)..."
                            />
                        </div>

                        {/* password  */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Password
                            </label>
                            <input
                                type="text"
                                required
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                                placeholder="Enter password..."
                            />
                        </div>

                        {/* mobile  */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Mobile Number
                            </label>
                            <input
                                type="number"
                                required
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                                placeholder="Enter mobile number..."
                            />
                        </div>

                        {/* role  */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Role
                            </label>
                            <select className={`w-full border rounded-lg px-3 py-2.5 bg-[#253856] border-gray-300 focus:outline-none focus:ring focus:ring-gray-400 ${formData.role === ""
                                ? "text-gray-400"
                                : "text-white"
                                }`}
                                value={formData.role}
                                onChange={handleChange}
                                name='role'
                                required>
                                <option value="" disabled>Select one of the role</option>
                                <option value="PI">PI</option>
                                <option value="Staff">Staff</option>
                                <option value="Outsider">Outsider</option>
                            </select>
                        </div>

                        {/* designation */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Designation
                            </label>
                            <input
                                type="text"
                                required
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
                                placeholder="Enter user's designation..."
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
}

export default CreateUser