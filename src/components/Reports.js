


import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useEffect, useState } from "react";
import useFetch from "../useFetch";
import { Pie, Bar } from "react-chartjs-2";
import Footer from "../constants/Footer";
import HeaderWithoutSearch from "../constants/HeaderWithoutSearch";

Chart.register(CategoryScale);

const Reports = () => {
  const [chartData, setChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [salesAgentClosed, setSalesAgentClosed] = useState(null);

  const [totalLeads, setTotalLeads] = useState(0);
  const [totalClosed, setTotalClosed] = useState(0);
  const [totalPipeline, setTotalPipeline] = useState(0);

  const [activeView, setActiveView] = useState("status"); 

  const { data, loading, error } = useFetch(`${process.env.REACT_APP_API_URL}/leads`);
  const { data: salesAgent } = useFetch(`${process.env.REACT_APP_API_URL}/agents`);

  const getSalesAgentName = (agentId, agentsList) => {
    if (!agentsList) return "Unknown";
    const agent = agentsList.find((ag) => ag._id === agentId);
    return agent ? agent.name : "Unknown Agent";
  };

  useEffect(() => {
    if (data && data.Leads && salesAgent && salesAgent.agents) {
      
      const statusCounts = {};
      let closedCount = 0;
      let pipelineCount = 0;
      const closedBySalesAgent = {};

      salesAgent.agents.forEach((ag) => (closedBySalesAgent[ag.name] = 0));

      data.Leads.forEach((lead) => {
        statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
        const agentName = getSalesAgentName(lead.salesAgent, salesAgent.agents);

        if (lead.status === "Closed") {
          closedCount++;
          if (closedBySalesAgent[agentName] !== undefined) {
            closedBySalesAgent[agentName] += 1;
          }
        } else {
          pipelineCount++;
        }
      });

      setTotalLeads(data.Leads.length);
      setTotalClosed(closedCount);
      setTotalPipeline(pipelineCount);

      setChartData({
        labels: Object.keys(statusCounts),
        datasets: [
          {
            label: "Count",
            data: Object.values(statusCounts),
            backgroundColor: [
              "rgba(75,192,192,0.6)",
              "#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0",
            ],
            borderColor: "black",
            borderWidth: 1,
          },
        ],
      });

      setPieChartData({
        labels: ["Closed", "In Pipeline"],
        datasets: [
          {
            label: "Leads",
            data: [closedCount, pipelineCount],
            backgroundColor: ["#2ecc71", "#3498db"],
            borderColor: "white",
            borderWidth: 2,
          },
        ],
      });

      setSalesAgentClosed({
        labels: Object.keys(closedBySalesAgent),
        datasets: [
          {
            label: "Closed Deals",
            data: Object.values(closedBySalesAgent),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      });
    }
  }, [data, salesAgent]);

 
  return (
        <div className="d-flex flex-column min-vh-100">

    <HeaderWithoutSearch/>
            <main className="flex-grow-1 container">

    <div className="container mt-4">
        {loading && (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "400px" }}
                >
                  <div className="text-center">
                    <div
                      className="spinner-border text-primary"
                      style={{ width: "3rem", height: "3rem" }}
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 fs-5 text-muted">Fetching...</p>
                  </div>
                </div>
              )}
        
      <h1 className="text-center mb-4">Report Overview</h1>

      <div className="row mb-4 text-center">
        <div className="col-12 col-md-4 mb-3">
          <div className="card p-3  border-primary">
            <h5>Total Leads</h5>
            <h2 className="text-primary">{totalLeads}</h2>
          </div>
        </div>
        <div className="col-12 col-md-4 mb-3">
          <div className="card p-3  border-success">
            <h5>Closed Deals</h5>
            <h2 className="text-success">{totalClosed}</h2>
          </div>
        </div>
        <div className="col-12 col-md-4 mb-3">
          <div className="card p-3 border-info">
            <h5>In Pipeline</h5>
            <h2 className="text-info">{totalPipeline}</h2>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center mb-4 flex-wrap mt-3">
        {/* <div className="btn-group" role="group"> */}
          <button
            type="button"
            className={`btn ${activeView === "status" ? "btn-primary" : "btn-outline-primary"} mt-3`}
            onClick={() => setActiveView("status")}
          >
            Status Distribution
          </button>
          <button
            type="button"
            className={`btn ${activeView === "pipeline" ? "btn-primary" : "btn-outline-primary" } ms-3 mt-3`}
            onClick={() => setActiveView("pipeline")}
          >
            Pipeline Ratio
          </button>
          <button
            type="button"
            className={`btn ${activeView === "agent" ? "btn-primary" : "btn-outline-primary"} ms-3 mt-3`}
            onClick={() => setActiveView("agent")}
          >
            Agent Performance
          </button>
        {/* </div> */}
      </div>

      {/* <div className="card p-4 " > */}
      <hr/>
        
        {activeView === "status" && chartData && (
          <div className="chart-wrapper mt-4"
        style={{ width: "100%", height: "600px", margin: "0 auto" }}>
             <h4 className="text-center mb-3">Leads by Status</h4>
<Bar
            data={chartData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Leads Status Distribution",
                },
                legend: {
                  display: false,
                },
              },
            }}
          />        
          
            </div>
        )}

        {activeView === "pipeline" && pieChartData && (
          <div className="chart-wrapper mt-4"
        style={{ width: "100%",
              maxWidth: "400px",
              height: "400px",margin: "0 auto" }}>
             <h4 className="text-center mb-3">Closed vs. Active</h4>
              <Pie
            data={pieChartData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Leads Closed and inPipeline",
                },
                legent: {
                  display: true,
                },
              },
            }}
          />
          </div>
        )}

        {activeView === "agent" && salesAgentClosed && (
          <div className="chart-wrapper mt-4"
        style={{width: "100%", height: "600px", margin: "0 auto" }}>
             <h4 className="text-center mb-3">Closed Deals by Agent</h4>
              <Bar
            data={salesAgentClosed}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Leads Closed By Sales Agent",
                },
                legend: {
                  display: false,
                },
              },
            }}
          />
          </div>
        )}
        
      </div>
    {/* // </div> */}
    </main>
    <Footer/>
    </div>
  );
};

export default Reports;