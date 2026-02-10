import { createContext, useContext} from "react";
import { useState, useEffect } from "react";
import useFetch from "../useFetch";
import {toast} from "react-toastify"

const SalesAgentListContext = createContext();
const useSalesAgentListContext = () => useContext(SalesAgentListContext);
export default useSalesAgentListContext;

export function SalesAgentListProvider({children}) {
    const [addAgent, setAddAgent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [listAgent, setListAgents] = useState([]);

  const { data, loading, error } = useFetch(`${process.env.REACT_APP_API_URL}/agents`);

  useEffect(() => {
    if (data && data.agents && data.agents.length > 0) {
      setListAgents(data.agents);
    }
  }, [data]);

  const handleAgentAddition = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      email,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/agents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

    //   if (!response.ok) {
    //     throw "could not add the salesAgent";
    //   }

      const agentData = await response.json();
      console.log(agentData);
      setSuccess(true);

      setListAgents([...listAgent, agentData.agent]);
      setName("");
      setEmail("")

        toast.success("Agent added successfully !")
      
      e.target.reset();

      //   e.reset();
    } catch {
      toast.error("Error while trying to add the salesAgent");
    }
  };


  return <SalesAgentListContext.Provider value = {{
    addAgent, setAddAgent, name, setName, email, setEmail, success, setSuccess, listAgent, setListAgents
    , data, loading, error, handleAgentAddition 
  }}>{children}</SalesAgentListContext.Provider>
}