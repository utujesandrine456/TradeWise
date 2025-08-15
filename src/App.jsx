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



function App() {

  return (
    <>
    <Router>
      <Routes>
          <Route path="/" element={ <Home />}></Route>
          <Route path="/Login" element={ <Login />}></Route>
          <Route path="/Signup" element={ <Signup />}></Route>
          <Route path='/email' element={<VerifyEmail />}></Route>
          <Route path='/dashboard' element={<DashboardLayout />}></Route>
          <Route path='/salesdata' element={<Form />}></Route>
          <Route path='/purchasedata' element={<Pform />}></Route>
          <Route path='/land' element={<Onboarding />}></Route>
      </Routes>
    </Router>
     
    </>
  )
}

export default App;
