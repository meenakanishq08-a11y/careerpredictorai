import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar  from './components/layout/Navbar';
import Footer  from './components/layout/Footer';
import Toast   from './components/common/Toast';
import Spinner from './components/common/Spinner';
import ProtectedRoute from './routes/ProtectedRoute';

const Landing              = lazy(() => import('./pages/Landing'));
const Login                = lazy(() => import('./pages/Login'));
const Register             = lazy(() => import('./pages/Register'));
const Dashboard            = lazy(() => import('./pages/Dashboard'));
const Profile              = lazy(() => import('./pages/Profile'));
const RecommendationResult = lazy(() => import('./pages/RecommendationResult'));
const History              = lazy(() => import('./pages/History'));
const NotFound             = lazy(() => import('./pages/NotFound'));

const PageWrapper = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Spinner fullPage label="Loading..." />}>
        <PageWrapper>
          <Routes>
            <Route path="/"           element={<Landing />} />
            <Route path="/login"      element={<Login />} />
            <Route path="/register"   element={<Register />} />
            <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/history"    element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/recommendations/:id" element={<ProtectedRoute><RecommendationResult /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageWrapper>
      </Suspense>
      <Footer />
      <Toast />
    </>
  );
}

export default App;
