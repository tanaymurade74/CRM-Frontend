// import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LeadList from "./components/LeadList.js";
import HomePage from "./components/HomePage.js";
import AddLead from "./components/AddLead.js"
import LeadManagement from "./components/LeadManagement.js";
import Reports from "./components/Reports.js";
// import AddSalesAgent from "./components/AddSalesAgent.js";
import SalesAgentList from "./components/SalesAgentList.js";
import Settings from "./components/Settings.js";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <ToastContainer
            position="bottom-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="light"
          />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path = "/leadList" element = {<LeadList/>} />
        <Route path = "/addLead" element = {<AddLead/>}/>
        <Route path = "/lead/:leadId" element = {<LeadManagement/>}/>
        <Route path = "/reports" element = {<Reports/>}/>
        {/* <Route path = "/addAgent" element = {<AddSalesAgent/>}/> */}
        <Route path = "/salesAgentList" element = {<SalesAgentList/>}/>
        <Route path = "/settings" element = {<Settings/>}/>
      </Routes>
    </Router>
  );
}

export default App;
