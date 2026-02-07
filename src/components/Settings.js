import { useEffect, useState } from "react";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";
import HeaderWithoutSearch from "../constants/HeaderWithoutSearch";
import Footer from "../constants/Footer";
import {toast} from "react-toastify"

const Settings = () => {
  const [allLeads, setAllLeads] = useState([]);
  const [allAgents, setAllAgents] = useState([]);
  const [activeView, setActiveView] = useState("leads");

  const { data, loading, error } = useFetch(`${process.env.REACT_APP_API_URL}/leads`);
  const {
    data: salesAgent,
    loading: loadingSalesAgent,
    error: salesAgentError,
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

      const data = await response.json();
      toast.warn(`Agent ${getSalesAgent(agentId)} has been deleted` )
    } catch {
      toast.error("Error while trying to delete agent");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <HeaderWithoutSearch />
      <main className="flex-grow-1 container">
        <div className="container mt-4">
          <h1 className="text-center mb-4">Settings</h1>
          <div className="row mb-4 text-center">
            <div className="col-12 col-md-6 mb-4">
              <div className="card p-3  border-primary">
                <h5>Total Leads</h5>
                <h2 className="text-primary">{allLeads.length}</h2>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="card p-3  border-success">
                <h5>Total Agents</h5>
                <h2 className="text-success">{allAgents.length}</h2>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center flex-wrap">
            <button
              type="button"
              className={`btn ${
                activeView === "leads" ? "btn-primary" : "btn-light"
              } border-dark`}
              onClick={() => setActiveView("leads")}
            >
              Manage Leads
            </button>

            <button
              type="button"
              className={`btn ${
                activeView === "agents" ? "btn-primary" : "btn-light"
              } ms-3 border-dark`}
              onClick={() => setActiveView("agents")}
            >
              Manage Agents
            </button>
          </div>

          <br />
          <hr />

          {activeView === "leads" && allLeads.length > 0 ? (
            <div className="text-center">
              <h1 className="text-center mt-3">Manage Leads</h1>
              <div className="row">
                {allLeads.map((lead) => (
                  <div className="col-md-4">
                    <Link
                      className="text-decoration-none"
                      to={`/lead/${lead._id}`}
                    >
                      <div className="card p-3 mt-4">
                        <p>
                          <strong>Lead Name: </strong>
                          {lead.name}
                        </p>
                        <p>
                          <strong>Lead Source: </strong>
                          {lead.source}
                        </p>
                        <p>
                          <strong>Status: </strong>
                          {lead.status}
                        </p>
                        <p>
                          <strong>Priority: </strong>
                          {lead.priority}
                        </p>
                        <p>
                          <strong>SalesAgent: </strong>
                          {`${getSalesAgent(`${lead.salesAgent}`)}`}
                        </p>
                      </div>
                    </Link>
                    <button
                      className="btn btn-danger mt-2 form-control"
                      onClick={() => handleLeadDelete(`${lead._id}`)}
                    >
                      Delete Lead
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            ""
          )}

          {activeView === "agents" && allAgents.length > 0 ? (
            <div>
              <h1 className="text-center">Manage Sales Agent</h1>
              <div className="row">
                {allAgents.map((agent) => (
                  <div className="col-md-4">
                    {/* <Link className="text-decoration-none" to = {`/agent/${agent._id}`}> */}
                    <div className="card p-3 mt-4">
                      <p>
                        <strong>Agent Name: </strong>
                        {agent.name}
                      </p>
                      <p>
                        <strong>Agent Email: </strong>
                        {agent.email}
                      </p>
                    </div>
                    {/* </Link> */}
                    <button
                      className="btn btn-danger form-control mt-2"
                      onClick={() => handleAgentDelete(`${agent._id}`)}
                    >
                      Delete Agent
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
