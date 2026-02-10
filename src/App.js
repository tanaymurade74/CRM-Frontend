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
import { LeadListProvider } from "./contexts/LeadListContext.js";
import { LeadManagementProvider } from "./contexts/LeadManagementContext.js";
import { AddLeadProvider } from "./contexts/AddLeadContext.js";
import { SalesAgentListProvider } from "./contexts/SalesAgentListContext.js";
import { ReportsProvider } from "./contexts/ReportsContext.js";
import { SettingsProvider } from "./contexts/SettingsContext.js";

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
        <Route path = "/leadList" element = {
          <LeadListProvider>
          <LeadList/>
          </LeadListProvider>
          } />
        <Route path = "/addLead" element = {
          <AddLeadProvider>
          <AddLead/>
          </AddLeadProvider>}/>
        <Route path = "/lead/:leadId" element = {
          <LeadManagementProvider>
          <LeadManagement/>
          </LeadManagementProvider>}/>
        <Route path = "/reports" element = {
          <ReportsProvider>
          <Reports/>
          </ReportsProvider>}/>
        <Route path = "/salesAgentList" element = {
          <SalesAgentListProvider>
          <SalesAgentList/>
          </SalesAgentListProvider>}/>
        <Route path = "/settings" element = {
          <SettingsProvider>
          <Settings/>
          </SettingsProvider>
          }/>
      </Routes>
    </Router>
  );
}

export default App;
