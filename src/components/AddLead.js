import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../useFetch";
import { useEffect } from "react";
import Footer from "../constants/Footer";
import HeaderWithoutSearch from "../constants/HeaderWithoutSearch";
import {toast} from "react-toastify"

const AddLead = () => {
  

  const navigate = useNavigate();
  const location = useLocation();

  const leadToUpdate = location.state?.Lead;
  console.log(leadToUpdate);

  const isEditMode = !!leadToUpdate;
  console.log(isEditMode);

  console.log(leadToUpdate);

  const [name, setName] = useState(leadToUpdate?.name || "");
  const [source, setSource] = useState(leadToUpdate?.source || "Website");
  const [salesAgent, setSalesAgent] = useState(leadToUpdate?.salesAgent || "");
  const [status, setStatus] = useState(leadToUpdate?.status || "New");
  const [priority, setPriority] = useState(leadToUpdate?.priority || "High");
  const [timeToClose, setTimeToClose] = useState(leadToUpdate?.timeToClose || "");
  const [tags, setTags] = useState(leadToUpdate?.tags || ["High-Value"])
    
 
  const [leadAdded, setLeadAdded] = useState(false);

  console.log(tags)
console.log(name);

  const {
    data: tag,
  } = useFetch(`${process.env.REACT_APP_API_URL}/tag`);
  const {
    data: agent,
  } = useFetch(`${process.env.REACT_APP_API_URL}/agents`);

  const getSalesAgent = (id) => {
    if(agent && agent.agents.length > 0){
        const ag = agent.agents.filter(ag => ag._id === id);
        return ag.length > 0? ag[0].name : "Agent Unassigned/Deleted";
    }
  }

  useEffect(() => {
    if(agent && agent.agents  && agent.agents.length > 0 && (salesAgent === "" || `${getSalesAgent(salesAgent)}` === "Agent Unassigned/Deleted")){
        setSalesAgent(agent.agents[0]._id);
    }
  }, [agent, salesAgent, getSalesAgent])




  const handleTagChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setTags([...tags, value]);
    } else {
      setTags(tags.filter((t) => t !== value));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      source,
      salesAgent,
      status,
      priority,
      timeToClose: Number(timeToClose),
      tags,
    };
    console.log(payload)

    const apiUrl = isEditMode? `${process.env.REACT_APP_API_URL}/leads/${leadToUpdate._id}` : `${process.env.REACT_APP_API_URL}/leads`
    const rest = isEditMode? "PUT" : "POST";
    try {
      const response = await fetch(apiUrl , {
        method: rest,
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(payload)
      });

      console.log(response)
      if(response && !response.ok){
        throw new Error("unable to add lead");
      }

      const data = await response.json();
      console.log(data);

        if (isEditMode) {
        toast.success("Lead Updated Successfully!");
      } else {
        toast.success("Lead Added Successfully!");
      } 

      if(location.state?.state === "edit"){
        navigate(`/lead/${leadToUpdate._id}`)
      }else{
        navigate("/leadList")
      }
    } catch{

    //    console.error("Error submitting form:", error);
      toast.error("Error while trying to save lead");


    }


  };


  

  return (
        <div className="d-flex flex-column min-vh-100">

    <HeaderWithoutSearch/>
    <main className="flex-grow-1 container">
    <div className="container text-center">
      <h1>{isEditMode? `Edit Lead` : `Add Lead`}</h1>
      <div className="card shadow-sm p-4">
  <form onSubmit={handleSubmit} className="row g-3">
    
    <div className="col-md-6 text-start">
      <label className="form-label fw-bold">Lead Name</label>
      <input
        type="text"
        className="form-control"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="ABC Corp"
      />
    </div>

    <div className="col-md-6 text-start">
      <label className="form-label fw-bold">Lead Source</label>
      <select
        className="form-select"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      >
        <option value="Website">Website</option>
        <option value="Referral">Referral</option>
        <option value="Cold Call">Cold Call</option>
        <option value="Advertisement">Advertisement</option>
        <option value="Email">Email</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div className="col-md-6 text-start">
      <label className="form-label fw-bold">Sales Agent</label>
      {agent && agent.agents.length > 0 ? (
        <select
          className="form-select"
          value={salesAgent}
          onChange={(e) => setSalesAgent(e.target.value)}
        >
          {agent.agents.map((ag) => (
            <option key={ag._id} value={ag._id}>
              {ag.name}
            </option>
          ))}
        </select>
      ) : (
        <select className="form-select" disabled>
          <option>Loading Agents...</option>
        </select>
      )}
    </div>

    <div className="col-md-6 text-start">
      <label className="form-label fw-bold">Lead Status</label>
      <select
        className="form-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Proposal Sent">Proposal Sent</option>
        <option value="Closed">Closed</option>
      </select>
    </div>

    <div className="col-md-6 text-start">
      <label className="form-label fw-bold">Priority</label>
      <select
        className="form-select"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>

    <div className="col-md-6 text-start">
      <label className="form-label fw-bold">Time To Close (Days)</label>
      <input
        className="form-control"
        required
        value={timeToClose}
        type="number"
        onChange={(e) => setTimeToClose(e.target.value)}
      />
    </div>

    <div className="col-12 text-start">
      <label className="form-label fw-bold d-block mb-2">Tags</label>
      <div className="card p-3  border-0">
        {tag && tag.tag.length > 0 ? (
          <div className="d-flex flex-wrap gap-3">
            {tag.tag.map((tg) => (
              <div className="form-check" key={tg._id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={tg.name}
                  id={`tag-${tg._id}`}
                  checked={tags.includes(tg.name)}
                  onChange={(e) => handleTagChange(e)}
                />
                <label className="form-check-label" htmlFor={`tag-${tg._id}`}>
                  {tg.name}
                </label>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-muted">No tags available</span>
        )}
      </div>
    </div>

    <div className="col-12 mt-4">
      <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
        {isEditMode ? "Update Lead" : "Add New Lead"}
      </button>
    </div>
    
  </form>
</div>
    </div>
    </main>
    <Footer/>
    </div>
  );
};

export default AddLead;
