import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";
import FullScreenLoader from "../components/FullScreenLoader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // if (loading) return <div>Loading...</div>;
  if (loading) return <FullScreenLoader />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
