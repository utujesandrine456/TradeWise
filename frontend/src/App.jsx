import React from "react";
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyPhone from './pages/VerifyPhone';
import VerificationSuccess from './pages/VerificationSuccess';
import DashboardLayout from "./components/DashboardLayout";
import Onboarding from "./pages/AfterSignup";
import { CartProvider } from "./contexts/CartContext";
import Forgotpassword from "./pages/Forgotpassword";
import Resetpassword from "./pages/Resetpassword";
import NotFound from "./pages/Notfound";
import Stocks from "./pages/Stocks";
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } />

          <Route path="/signup" element={
            <ProtectedRoute requireAuth={false}>
              <Signup />
            </ProtectedRoute>
          } />


          <Route path='/stocks' element={
            <ProtectedRoute>
              <Stocks />
            </ProtectedRoute>
          } />

          <Route path='/dashboard' element={
            <ProtectedRoute>
              <CartProvider>
                <DashboardLayout />
              </CartProvider>
            </ProtectedRoute>
          } />

          <Route path='/transaction/:id' element={
            <ProtectedRoute>
              <CartProvider>
                <DashboardLayout />
              </CartProvider>
            </ProtectedRoute>
          } />

          <Route path='/financials/:financialId' element={
            <ProtectedRoute>
              <CartProvider>
                <DashboardLayout />
              </CartProvider>
            </ProtectedRoute>
          } />

          <Route path='/stock/:stockId' element={
            <ProtectedRoute>
              <CartProvider>
                <DashboardLayout />
              </CartProvider>
            </ProtectedRoute>
          } />

          <Route path='/notifications/:notificationId' element={
            <ProtectedRoute>
              <CartProvider>
                <DashboardLayout />
              </CartProvider>
            </ProtectedRoute>
          } />

          <Route path='/land' element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />

          <Route path='/forgotpassword' element={<Forgotpassword />} />
          <Route path='/resetpassword' element={<Resetpassword />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
