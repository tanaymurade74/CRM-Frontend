import { useEffect, useState } from "react";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";
import Header from "../constants/Header";
import Footer from "../constants/Footer";
import useLeadListContext from "../contexts/LeadListContext";


const LeadList = () => {

    const {leads, allLeads, search, setSearch, status, setStatus, selectAgent, setSelectAgent
        ,agents, priorityOrder, setPriorityOrder, timeToCloseOrder, setTimeToCloseOrder, handleClear, 
        getSalesAgent, loading
    } = useLeadListContext();
     

    return     <div className="d-flex flex-column min-vh-100">

       <Header search = {search} setSearch = {setSearch} />
        <main className="mt-4 flex-grow-1">

        <div className="container p-4 bg-body-secondary">
          <button
            className="btn btn-primary w-100 mb-3 d-md-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#filterSection"
            aria-expanded="false"
            aria-controls="filterSection"
          >
            Show/Hide Filters
          </button>

            <div className="row">
                <div className="col-md-3 mb-4">
                    <div className="collapse d-md-block" id="filterSection">
                    <div className="row">
                        <div className="col-md-8">
                    <h2>Filters: </h2><br/>
                    <div>
                    <label id= "status"><strong>Filter by Status:</strong> </label><br/><br/>
                               <input 
                                                checked={status === ""} 
                                                type="radio" 
                                                name="status" 
                                                onChange={() => setStatus("")} 
                                            /> All Status <br />
                    <input checked = {status === "New"} type = "radio" name = "status" onChange = {() => setStatus("New")} /> New <br/>
                    <input checked = {status === "Contacted"} type = "radio" name = "status" onChange = {() => setStatus("Contacted")} /> Contacted <br/>
                     <input checked = {status === "Qualified"} type = "radio" name = "status" onChange = {() => setStatus("Qualified")} /> Qualified <br/>
                      <input checked = {status === "Proposal Sent"} type = "radio" name = "status" onChange = {() => setStatus("Proposal Sent")} /> Proposal Sent <br/>
                       <input checked = {status === "Closed"} type = "radio" name = "status" onChange = {() => setStatus("Closed")} /> Closed<br/><br/>
                    </div>

                    <div>
                        <label id = "agent"><strong>Filter By Sales Agent: </strong></label><br/><br/>
                        <div>
                                                <input 
                                                    checked={selectAgent === ""} 
                                                    type="radio" 
                                                    name="agent" 
                                                    onChange={() => setSelectAgent("")} 
                                                /> All Agents
                                            </div>
                        {agents.map(agent => (
                           <div>
                              <input checked = {selectAgent === `${agent._id}`} required type = "radio" value= {agent.name} name = "agent" onChange = {() => setSelectAgent(`${agent._id}`)}/> {agent.name}
                           </div>
                        ))}
                        
                    </div><br/>

                    <div>
                        <label ><strong>Sort By Priority:</strong> </label><br/><br/>
                        <input checked = {priorityOrder === "Desc"} type = "radio" value = "Desc" onChange = {(e) => setPriorityOrder(e.target.value)}/> High to Low<br/>
                        <input checked = {priorityOrder === "Asc"} type = "radio" value = "Asc" onChange = {(e) => setPriorityOrder(e.target.value)}/> Low to High
                        
                    </div><br/>

                     <div>
                        <label ><strong>Sort By TimeToClose:</strong> </label><br/><br/>
                        <input checked = {timeToCloseOrder === "Desc"} onChange = {(e) => setTimeToCloseOrder(e.target.value)}  type = "radio" value = "Desc"/> High to Low<br/>
                        <input checked = {timeToCloseOrder === "Asc"} onChange = {(e) => setTimeToCloseOrder(e.target.value)} type = "radio" value = "Asc"/> Low to High
                        
                    </div>
                   </div>

                   <div className="col-md-4">

                    <h3><button onClick = {() => handleClear()}>Clear</button></h3>

                   </div>
                   </div>         
                </div>
                </div>


                <div className="col-md-9 ">
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

                    {!loading && leads && leads.length > 0 ? 
                    <div className="row ">
                        
                        {leads && leads.map(lead => (

                            <div className="col-12 col-sm-6 col-lg-4 mb-4 d-flex align-items-stretch text-center">
                                <Link className = "text-decoration-none w-100 mt-4"to = {`/lead/${lead._id}`}>
                                <div className="card h-100  p-3">
                                    <div className="card-title">
                                        <p><strong>Name: </strong> {lead.name}</p>
                                        <p><strong>Source: </strong>{lead.source}</p>
                                        <p><strong>SalesAgent: </strong>{getSalesAgent(`${lead.salesAgent}`)}</p>
                                        <p><strong>Status: </strong>{lead.status}</p>
                                        <p><strong>Priority: </strong>{lead.priority}</p>
                                        <p><strong>Time To Close: </strong>{lead.timeToClose}</p>
                                    </div>

                                </div>
                                </Link>

                            </div>
                        ))}
                    </div>
                    : 
                    <div>
                    { !loading && <div>
                        <img className="img-fluid" 
                        alt = ""
                        style ={{height: "35rem", width: "45rem"}} src = "https://cdn2.hubspot.net/hubfs/190063/get-more-leads-2015.jpg"/>
                    </div>
                    }
                    </div>

}
                    <Link className="btn btn-primary form-control mt-4"  to = "/addLead" state = {{state: "add"}}>Add New Lead</Link>
                    
                </div>

            </div>
            </div>
        </main>
        <Footer/>
    </div>

}
export default LeadList;