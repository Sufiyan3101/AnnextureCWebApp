import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthExpiredHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthExpired = () => {
            navigate("/login", { replace: true });
        };

        window.addEventListener("auth-expired", handleAuthExpired);
        return () => window.removeEventListener("auth-expired", handleAuthExpired);
    }, [navigate]);

    return null;
};

export default AuthExpiredHandler;