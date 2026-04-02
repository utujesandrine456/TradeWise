import React from "react";
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail'
import DashboardLayout from "./components/DashboardLayout";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import VerificationSuccess from './pages/VerificationSuccess';
import DashboardLayout from "./components1/DashboardLayout";
import Form from "./pages/SalesForm";
import Pform from "./pages/PurchasesForm";
import Onboarding from "./pages/AfterSignup";
import { CartProvider } from "./contexts/CartContext";
import Forgotpassword from "./pages/Forgotpassword";
import Resetpassword from "./pages/Resetpassword";
import NotFound from "./pages/Notfound";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div>
    <ToastContainer />

    <Router>
      <Routes>
          <Route path="/" element={ <Home />}></Route>
          <Route path="/login" element={ <Login />}></Route>
          <Route path="/signup" element={ <Signup />}></Route>
          <Route path='/verify-email' element={<VerifyEmail />}></Route>
          <Route path='/verification-success' element={<VerificationSuccess />}></Route>
          <Route path='/stocks' element={
            <ProtectedRoute>
              <Stocks />
            </ProtectedRoute>
          }></Route>
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <CartProvider>
                <DashboardLayout />
              </CartProvider>
            </ProtectedRoute>
          }></Route>

          <Route path='/transaction/:id' element={
            <ProtectedRoute>
              <CartProvider>
                <DashboardLayout />
              </CartProvider>
            </ProtectedRoute>
          }></Route>

          <Route path='/financials/:financialId' element={
            <ProtectedRoute>
              <CartProvider>
                <DashboardLayout />
              </CartProvider>
            </ProtectedRoute>
          }></Route>

          <Route path='/stock/:stockId' element={
            <ProtectedRoute>
              <CartProvider>
                <DashboardLayout />
              </CartProvider>
            </ProtectedRoute>
          }></Route>

          <Route path='/notifications/:notificationId' element={
            <ProtectedRoute>
              <CartProvider>
                <DashboardLayout />
              </CartProvider>
            </ProtectedRoute>
          }></Route>

          <Route path="/" element={<Home />}></Route>

          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          }></Route>

          <Route path="/signup" element={
            <ProtectedRoute requireAuth={false}>
              <Signup />
            </ProtectedRoute>
          }></Route>

          <Route path='/email' element={
            <ProtectedRoute requireVerified={false}>
              <VerifyEmail />
            </ProtectedRoute>
          }></Route>

          {/* disable them */}
          {/* <Route path='/salesdata' element={
              <ProtectedRoute>
                <Form />
              </ProtectedRoute>
            }></Route>

            <Route path='/purchasedata' element={
              <ProtectedRoute>
                <Pform />
              </ProtectedRoute>
            }></Route> */}

          <Route path='/land' element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }></Route>

          <Route path='/forgotpassword' element={<Forgotpassword />}></Route>
          <Route path='/resetpassword' element={<Resetpassword />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App;
