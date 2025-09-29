import { Routes, Route } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { VerifyOTP } from "./components/VerifyOTP";
import { Login } from "./pages/Login";
import { Welcome } from "./pages/Welcome";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
  
      <Route path="/" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/login" element={<Login />} />
      <Route path="/welcome" element={<Welcome />} />
    </Routes>
    </>
  );
}

export default App;
