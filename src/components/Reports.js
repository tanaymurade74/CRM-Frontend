


import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useEffect, useState } from "react";
import useFetch from "../useFetch";
import { Pie, Bar } from "react-chartjs-2";
import Footer from "../constants/Footer";
import HeaderWithoutSearch from "../constants/HeaderWithoutSearch";
import useReportsContext from "../contexts/ReportsContext";

Chart.register(CategoryScale);

const Reports = () => {

    const {chartData, setChartData, pieChartData, setPieChartData, salesAgentClosed, setSalesAgentClosed, totalLeads, setTotalLeads, 
     totalClosed, setTotalClosed, totalPipeline, setTotalPipeline, activeView, setActiveView, data, loading, error, salesAgent, getSalesAgentName
} = useReportsContext();

 
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