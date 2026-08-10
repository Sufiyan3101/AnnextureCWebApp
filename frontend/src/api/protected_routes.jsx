import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // No token
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Check whether token is expired/invalid
    try {
        const decoded = jwtDecode(token);

        if (!decoded.exp || decoded.exp * 1000 <= Date.now()) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");

            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        // Invalid/corrupted token
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        return <Navigate to="/login" replace />;
    }

    // Check role
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;