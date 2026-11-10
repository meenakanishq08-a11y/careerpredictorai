import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';

const ProtectedRoute = ({ children }) => {
  const { isAuth, loading } = useAuth();
  if (loading) return <Spinner fullPage />;
  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
