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
  const [tags, setTags] = useState(leadToUpdate?.tags || ["High-Value"]);
  const [leadAdded, setLeadAdded] = useState(false);

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
      <form onSubmit={handleSubmit} className="form-control mt-4">
        <label><strong>Lead Name: </strong> </label><br/>
        <input
          type="text"
          required
         value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ABC Corp"
        />
        <br />
        <br />
        <label><strong>Lead Source: </strong></label><br/>
        <select value={source} onChange = {(e) => setSource(e.target.value)}>
          <option value = "Website">Website</option>
          <option value = "Referral">Referral</option>
          <option value = "Cold Call">Cold Call</option>
          <option value = "Advertisement">Advertisement</option>
          <option value = "Email">Email</option>
          <option value = "Other">Other</option>
        </select>
        <br />
        <br />
        <label><strong>Sales Agent:</strong> </label><br/>
        {agent && agent.agents.length > 0 ? (
          <select value={salesAgent} onChange={(e) => setSalesAgent(e.target.value)}>
            {agent.agents.map((ag) => (
              <option value={ag._id}> {ag.name}</option>
            ))}
          </select>
        ) : (
          ""
        )}
        <br />
        <br />
        <label><strong>Lead Status:</strong> </label><br/>
        <select  value={status} onChange = {(e) => setStatus(e.target.value)}>
          <option  value = "New">New</option>
          <option value = "Contacted">Contacted</option>
          <option value = "Qualified">Qualified</option>
          <option value = "Proposal Sent">Proposal Sent</option>
          <option value = "Closed">Closed</option>
        </select>
        <br />
        <br />
        <label><strong>Priority:</strong> </label><br/>
        <select value={priority} onChange = {(e) => setPriority(e.target.value)}>
          <option  value = "High">High</option>
          <option value = "Medium">Medium</option>
          <option value = "Low">Low</option>
        </select>
        <br />
        <br />
        <label ><strong>Time To Close (Days):</strong> </label><br/>
        <input required value={timeToClose} type="number" onChange={(e) => setTimeToClose(e.target.value)} />
        <br />
        <br />
        <label><strong>Tags:</strong> </label><br/>
        {tag && tag.tag.length > 0 ? (
          <div >
                {tag.tag.map((tg) => (
                  <div  key={tg._id}>
                    <input
                    //   className="form-check-input"
                      type="checkbox"
                      value={tg.name}
                    //   id={`tag-${tg._id}`}
                      // Check if this tag exists in the state array
                      checked={tags.includes(tg.name)}
                      onChange={(e) => handleTagChange(e)}
                    /> {tg.name}
                    </div>
        ))} 
        </div>)
        : (
          ""
        )}
        <br />
        <br />
        <button type = "submit" className="btn btn-primary form-control">{isEditMode ? "Update Lead" : "Add New Lead"}</button>
      </form>
    </div>
    </main>
    <Footer/>
    </div>
  );
};

export default AddLead;
