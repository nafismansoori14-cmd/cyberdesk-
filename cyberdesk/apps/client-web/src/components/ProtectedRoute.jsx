import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProtectedRoute({ children }) {
  const { loading, user } = useAuth();
  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center text-slate-300">
        Loading...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
