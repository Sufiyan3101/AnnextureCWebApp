import React from "react";
import BlurText from "./BlurTextAnimation";
import CircularText from './CircularTextAnimation';


export const SplashScreen = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center text-gray-200 bg-[#27374D]">
            <BlurText
                text="Welcome to Asset Management"
                delay={100}
                animateBy="letters"
                direction="top"
                className="text-2xl sm:text-6xl font-bold"
            />
        </div>
    );
};

export const CircularTextAnimation = () => {
    return (
        <div className="flex h-full items-center justify-center text-gray-200 bg-transparent">
            <CircularText
                text="DATA * IS * CURRENTLY * UNAVAILABLE * "
                onHover="speedUp"
                spinDuration={30}
                className="custom-class "
            />
        </div>
    );
};
