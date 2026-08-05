import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import API from '../api/api.js'
import { useNavigate } from "react-router-dom";


const Header = () => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await API.get("/me");
                setUserData(res.data.user);
                // console.log(res.data.user);

            } catch (err) {
                console.log(err);
            }
        };

        fetchUser();
    }, []);

    const role = localStorage.getItem("role");

    return (
        <div className="w-screen h-[10vh] sm:h-[10vh] bg-[#182740] text-white flex justify-between pl-3 md:pl-5 lg:pl-10 pr-1 md:pr-3 lg:pr-5 align-middle shadow-2xl">
            {/* ── Profile ── */}
            {showOverlay && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl">

                        {!userData ? (
                            <div className="p-10 text-center">
                                Loading...
                            </div>
                        ) : (
                            <>

                                {/* Header */}
                                <div className="flex items-center justify-between border-b px-6 pt-4">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        User Profile
                                    </h2>
                                   

                                    <button
                                        onClick={() => setShowOverlay(false)}
                                        className="rounded-lg px-3 py-1 text-xl font-bold text-gray-500 hover:bg-gray-100"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="pl-6 pt-2 pb-6 pr-6">

                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">

                                        <div className="rounded-xl border p-1">
                                            <p className="text-sm text-gray-500">Name : </p>
                                            <p className="mt-1 font-semibold text-gray-800">
                                                {userData?.name || "Not defined"}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border p-1">
                                            <p className="text-sm text-gray-500">Email : </p>
                                            <p className="mt-1 font-semibold text-gray-800">
                                                {userData?.email || "Not defined"}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border p-1">
                                            <p className="text-sm text-gray-500">Alternate Email : </p>
                                            <p className="mt-1 font-semibold text-gray-800">
                                                {userData?.alternate_email || "Not defined"}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border p-1">
                                            <p className="text-sm text-gray-500">Contact No : </p>
                                            <p className="mt-1 font-semibold text-gray-800">
                                                {userData?.mobile || "Not defined"}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border p-1">
                                            <p className="text-sm text-gray-500">Role : </p>
                                            <p className="mt-1 font-semibold text-gray-800">
                                                {userData?.role || "Not defined"}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border p-1">
                                            <p className="text-sm text-gray-500">Designation : </p>
                                            <p className="mt-1 font-semibold text-gray-800">
                                                {userData?.designation || "Not defined"}
                                            </p>
                                        </div>

                                    </div>

                                </div>
                                 <div className="flex justify-end border-t px-6 pb-6">

                                    <button
                                        onClick={handleLogout}
                                        className="rounded-lg bg-red-800 px-5 py-2 text-white hover:bg-white hover:border hover:text-red-800 transition-all duration-300 cursor-pointer"
                                    >
                                        Logout
                                    </button>

                                </div>
                            </>
                        )}

                    </div>
                </div>
            )}


            <div className="text-xs md:text-xl lg:text-2xl w-fit flex justify-center items-center tracking-wide md:tracking-wider lg:tracking-widest">
                Asset Management
            </div>
            <div className="flex items-center gap-3 md:gap-8 lg:gap-10 font-semibold">
                <Link to={"/"} className="text-xs md:text-base lg:text-xl relative inline-block after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-full">Dashboard</Link>
                <Link to={"/form"} className="text-xs md:text-base lg:text-xl relative inline-block after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-full">Form</Link>
                {role === "admin" && (<Link to={"/user-create"} className="text-xs md:text-base lg:text-xl relative inline-block after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-full">Add User</Link>)}
            </div>
            <div className="flex items-center gap-3 md:gap-8 lg:gap-10 ">
                <div><FaRegCircleUser className="text-lg md:text-2xl lg:text-4xl hover:cursor-pointer" onClick={() => setShowOverlay(true)} /></div>
                <img src="src/assets/IITKLOGO.png" className="w-16 h-16 lg:w-20 lg:h-20 " />
            </div>
        </div>
    )
}

export default Header;