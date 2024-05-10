import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import In_active_Student from "./pages/in-Active/In-active_Student";
import Fees_Section from "./pages/Fees&Report/Fees_Section";
import Report_Section from "./pages/Fees&Report/Report_Section";
import Account_Setting from "./pages/Account-settings/Account_Setting";
import Nopage from "./pages/Nopage/Nopage";
import Add_Grade from "./pages/Grades/Add_Grade";
import Add_Student from "./pages/StudentDetails/Add_Student";
import LoginForm from "./Login/login";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Student from "./pages/StudentDetails/Student";
import Grade from "./pages/Grades/Grade";

function App() {
  const [isLogin, setisLogin] = useState(false);

  useEffect(() => {
    const sessionActive = sessionStorage.getItem("sessionActive");
    if (sessionActive === "true") {
      setisLogin(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/loginForm" element={<LoginForm setisLogin={setisLogin}/>} />
        {isLogin ? (
          <>
            <Route path="/" element={<Navbar />}>
              <Route index element={<Dashboard />} />
              <Route path="Student" element={<Student />} />
              <Route
                path="In_active_Student"
                element={<In_active_Student />}
              />
              <Route path="Grade" element={<Grade />} />
              <Route path="Fees_Section" element={<Fees_Section />} />
              <Route path="Report_Section" element={<Report_Section />} />
              <Route
                path="Account_Setting"
                element={<Account_Setting />}
              />
              <Route path="Add_Student" element={<Add_Student />} />
              <Route path="Add_Grade" element={<Add_Grade />} />
              <Route path="*" element={<Nopage />} />
            </Route>
          </>
        ) : (
          <Route path="/" element={<LoginForm setisLogin={setisLogin} />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
