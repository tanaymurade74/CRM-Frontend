import { createContext, useContext } from "react";
import { useState } from "react";
import useFetch from "../useFetch";
import { useEffect } from "react";

const ReportsContext = createContext();
const useReportsContext = () => useContext(ReportsContext);
export default useReportsContext;

export function ReportsProvider({children}) {
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
            backgroundColor: ["rgba(75,192,192,0.6)",
              "#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0",],
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      });
    }
  }, [data, salesAgent]);

  return <ReportsContext.Provider
  value={{
    chartData, setChartData, pieChartData, setPieChartData, salesAgentClosed, setSalesAgentClosed, totalLeads, setTotalLeads, 
     totalClosed, setTotalClosed, totalPipeline, setTotalPipeline, activeView, setActiveView, data, loading, error, salesAgent, getSalesAgentName
  }}>{children}</ReportsContext.Provider>
}