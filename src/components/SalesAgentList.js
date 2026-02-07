import { useEffect, useState } from "react";
import useFetch from "../useFetch";
import HeaderWithoutSearch from "../constants/HeaderWithoutSearch";
import Footer from "../constants/Footer";
import {toast} from "react-toastify"

const SalesAgentList = () => {
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

  return (
    <div className="d-flex flex-column min-vh-100">
    <HeaderWithoutSearch/>
    <main className="flex-grow-1 container">

<h1 className="text-center mt-3">Sales Agents</h1>
      <div className="card p-4 mb-5 mt-4 ">
            <form onSubmit={handleAgentAddition}>
                <div className="row g-3">
                    <div className="col-md-5">
                        <label className="form-label"><strong>Name:</strong></label>
                        <input
                            type="text"
                            className="form-control"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="col-md-5">
                        <label className="form-label"><strong>Email:</strong></label>
                        <input
                            type="email"
                            className="form-control"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="johnDoe@gmail.com"
                        />
                    </div>
                    
                    <div className="col-md-2 d-flex align-items-end">
                        <button type="submit" className="btn btn-primary w-100">
                            Add New Agent
                        </button>
                    </div>
                </div>
            </form>
        </div>

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
                 {error && <p>Error while fetching salesAgents</p>}

      {listAgent && listAgent.length > 0 ? (
        <div className="container text-center">
          {/* <h1 className="text-center">Sales Agents</h1> */}
          <div className="row">
            {listAgent.map((agent) => (
              <div className="col-md-6">
                <div className="card p-3 mt-4">
                  <p>
                    <strong>Name: </strong> {agent.name}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    {agent.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
          </div>
       ): (
        ""
      )}
      </main>
      <Footer/>

    </div>
  );

  return <></>;
};

export default SalesAgentList;
