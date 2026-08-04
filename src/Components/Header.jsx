import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="w-screen h-[6vh] sm:h-[5vh] bg-[#1E293B] text-white flex justify-center align-middle shadow-2xl">
            <div className="flex items-center gap-10 font-semibold">
                <Link to={"/"} className="relative inline-block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-full">Dashboard</Link>
                <Link to={"/form"} className="relative inline-block after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-full">Form</Link>
            </div>
        </div>
    )
}

export default Header;