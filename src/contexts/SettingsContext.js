import { createContext, useContext } from "react";

import { useEffect, useState } from "react";
import useFetch from "../useFetch";
import {toast} from "react-toastify"


const SettingsContext = createContext();
const useSettingsContext = () => useContext(SettingsContext)
export default useSettingsContext;

export function SettingsProvider({children}){
      const [allLeads, setAllLeads] = useState([]);
  const [allAgents, setAllAgents] = useState([]);
  const [activeView, setActiveView] = useState("leads");

  const { data} = useFetch(`${process.env.REACT_APP_API_URL}/leads`);
  const {
    data: salesAgent,
   
  } = useFetch(`${process.env.REACT_APP_API_URL}/agents`);

  useEffect(() => {
    if (data && data.Leads && data.Leads.length > 0) {
      setAllLeads(data.Leads);
    }
    if (salesAgent && salesAgent.agents && salesAgent.agents.length > 0) {
      setAllAgents(salesAgent.agents);
    }
  }, [data, salesAgent]);

  const getSalesAgent = (id) => {
    if (salesAgent && salesAgent.agents && salesAgent.agents.length > 0) {
      const agent = salesAgent.agents.filter((ag) => ag._id === id);
      return agent.length > 0 ? agent[0].name : "Agent Unassigned/Deleted";
    }
  };

  const handleLeadDelete = async (leadId) => {
    const filteredLeads = allLeads.filter((lead) => lead._id !== leadId);
    const toDelete = allLeads.filter(lead => lead._id === leadId);
    setAllLeads(filteredLeads);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/leads/${leadId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      toast.warn(`Lead: ${toDelete[0].name} has been deleted`)
    } catch {
      toast.error("Error while trying to delete lead.");
    }
  };

  const handleAgentDelete = async (agentId) => {
    const leads = allLeads.map((lead) => {
      if (lead.salesAgent === agentId) {
        return { ...lead, salesAgent: null };
      }
      return lead;
    });

    setAllLeads(leads);

    const filteredAgents = allAgents.filter((ag) => ag._id !== agentId);
    setAllAgents(filteredAgents);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/agents/${agentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

       await response.json();
      toast.warn(`Agent ${getSalesAgent(agentId)} has been deleted` )
    } catch {
      toast.error("Error while trying to delete agent");
    }
  };

  return <SettingsContext.Provider value ={{
    allLeads, setAllLeads, allAgents, setAllAgents, activeView, setActiveView, data, salesAgent, getSalesAgent, 
    handleAgentDelete, handleLeadDelete
  }}>
    {children}
  </SettingsContext.Provider>
}