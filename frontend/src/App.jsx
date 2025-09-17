import React from "react";
import './index.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from "./Home";
import Login from './Login';
import Signup from './Signup';
import VerifyEmail from './VerifyEmail'
import DashboardLayout from "./components1/DashboardLayout";
import Form from "./SalesForm";
import Pform from "./PurchasesForm";
import Onboarding from "./AfterSignup";
import { CartProvider } from "./contexts/CartContext";
import ProtectedRoute from "./components1/ProtectedRoute";
import Forgotpassword from "./Forgotpassword";
import Resetpassword from "./Resetpassword";
import NotFound from "./notfound";




function App() {

  return (
    <>
    <Router>
      <Routes>
          <Route path="/" element={ <Home />}></Route>
          <Route path="/login" element={ <Login />}></Route>
          <Route path="/signup" element={ <Signup />}></Route>
          <Route path='/email' element={<VerifyEmail />}></Route>
          <Route path='/dashboard' element={
            <CartProvider>
              <DashboardLayout />
            </CartProvider>
          }></Route>
          <Route path='/salesdata' element={<Form />}></Route>
          <Route path='/purchasedata' element={<Pform />}></Route>
          <Route path='/land' element={<Onboarding />}></Route>
          <Route path='/forgotpassword' element={<Forgotpassword />}></Route>
          <Route path='/resetpassword' element={<Resetpassword />}></Route>
          <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </Router>
     
    </>
  )
}

export default App;
