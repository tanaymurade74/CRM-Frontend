import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useFetch from "../useFetch";
import {toast} from "react-toastify"

const AddLeadContext = createContext();
const useAddLeadContext = () => useContext(AddLeadContext);
export default useAddLeadContext;

export function AddLeadProvider({children}){
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

   return <AddLeadContext.Provider value ={{name, setName, source, setSource, salesAgent, setSalesAgent
    , status, setStatus, priority, setPriority, timeToClose, setTimeToClose, tags, setTags, tag, agent, 
    getSalesAgent, handleTagChange, handleSubmit, isEditMode
   }}>{children}</AddLeadContext.Provider>
}