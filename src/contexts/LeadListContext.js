import { createContext, useContext } from "react";
import { useState } from "react";
import useFetch from "../useFetch";
import { useEffect } from "react";
const LeadListContext = createContext();
const useLeadListContext = () => useContext(LeadListContext);
export default useLeadListContext;

export function LeadListProvider({children}){

    const[leads, setLeads] = useState([]);
    const[allLeads, setAllLeads] = useState([]);
    const[agents, setAgents] = useState([]);
    const[status, setStatus] = useState("");
    const [selectAgent, setSelectAgent] = useState("");
    const [priorityOrder, setPriorityOrder] = useState("");
    const [timeToCloseOrder, setTimeToCloseOrder] = useState("");
    const [search, setSearch] = useState("");

    const priorityObj = {

        "High" : 3,
        "Medium": 2,
        "Low": 1
    }

    const apiUrl = search.trim() === "" ? `${process.env.REACT_APP_API_URL}/leads` : `${process.env.REACT_APP_API_URL}/leads/search/${decodeURIComponent(search)}`;
    
    const {data, loading } = useFetch(apiUrl);
    const {data: salesAgent
    } = useFetch(`${process.env.REACT_APP_API_URL}/agents`)
    
    useEffect(() => {
        if(data && data.Leads){
        setLeads(data.Leads);
        setAllLeads(data.Leads);
        }
    }, [data])


    useEffect(() => {
        if(salesAgent && salesAgent.agents){
            setAgents(salesAgent.agents)
        }
    }, [salesAgent])

    useEffect(() => {
        let filteredLeads = [...allLeads];
        if(status !== ""){
            filteredLeads = filteredLeads.filter(lead => lead.status === status);
        }
        if(selectAgent !== ""){
            filteredLeads = filteredLeads.filter(lead => lead.salesAgent === selectAgent)
        }

        if(priorityOrder === "Desc"){
            filteredLeads.sort((a, b) => {
                const priorityA = priorityObj[a.priority];
                const priorityB = priorityObj[b.priority]

                return priorityB - priorityA;

            })
            
        }else if(priorityOrder === "Asc"){

            filteredLeads.sort((a, b) => {
                const priorityA= priorityObj[a.priority];
                const priorityB = priorityObj[b.priority];
                return priorityA - priorityB;
            })

        }

        if(timeToCloseOrder === "Desc"){
            filteredLeads.sort((a, b) => {
                const timeA = a.timeToClose;
                const timeB = b.timeToClose;
                return  timeB - timeA;
            })
        }else if(timeToCloseOrder === "Asc"){
            filteredLeads.sort((a, b) => {
                const timeA = a.timeToClose;
                const timeB = b.timeToClose;
                return timeA - timeB;
            })
        }

      
        setLeads(filteredLeads);
    }, [status, selectAgent, priorityOrder, timeToCloseOrder])
    
    console.log(priorityOrder)
    console.log(timeToCloseOrder)

    
    console.log(leads);


    const getSalesAgent = (salesAgentId) => {
     const agent =  agents.filter(agent => agent._id === salesAgentId);
      console.log(agent);  
      return agent.length > 0 ? agent[0].name : "Agent Unassigned/Deleted";
    }

    const handleClear = () => {
        setStatus("");
        setSelectAgent("");
        setTimeToCloseOrder("");
        setPriorityOrder("");
    }


    return <LeadListContext.Provider value = {{leads, allLeads, setLeads, setAllLeads, agents, setAgents, status, setStatus,
     selectAgent, setSelectAgent, priorityOrder, setPriorityOrder, timeToCloseOrder, setTimeToCloseOrder, search, setSearch
     , data, salesAgent, handleClear, getSalesAgent, loading}}>

        {children}
    </LeadListContext.Provider>


}

