import useFetch from "../useFetch";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HeaderWithoutSearch from "../constants/HeaderWithoutSearch";
import Footer from "../constants/Footer";
import {toast} from "react-toastify"

const LeadManagement = () => {
  const param = useParams();
  const leadId = param.leadId;
  const [addComment, setAddComment] = useState("");
  const [author, setAuthor] = useState("");
  const [commentText, setCommentText] = useState();
  const [commentAdded, setCommentAdded] = useState(false);
  const[localComment, setLocalComments] = useState([]);


  const { data, loading, error } = useFetch(
    `${process.env.REACT_APP_API_URL}/leads?_id=${leadId}`
  );
  console.log(data);

  const {
    data: comment
  } = useFetch(`${process.env.REACT_APP_API_URL}/leads/${leadId}/comments`);
  console.log(comment);

  const {
    data: salesAgent
  } = useFetch(`${process.env.REACT_APP_API_URL}/agents`);
  console.log(salesAgent);

  useEffect(() => {
    if (comment && comment.comments) {
      setLocalComments(comment.comments);
    }
  }, [comment])

  useEffect(() => {
    if(salesAgent && salesAgent.agents.length > 0 && author === ""){
        setAuthor(salesAgent.agents[0]._id)
    }
  }, [salesAgent, author])




  const getSalesAgent = (id) => {
    if(salesAgent && salesAgent.agents.length > 0){
        const agent = salesAgent.agents.filter(ag => ag._id === id);
        return agent.length > 0? agent[0].name : "Agent Unassigned/Deleted";
    }
  }



  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      lead: leadId,
      author,
      commentText,
    };
   console.log(payload)

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/leads/${leadId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
    // if(response && !response.ok){
    //      throw("error while trying to add comment");
    // }
      const data = await response.json();



      setLocalComments([...localComment, data])
       setCommentAdded(true);

       setCommentText("");
    setAuthor("");
        toast.success("Comment added successfully !")
    
       e.target.reset();

    } catch {
      toast.error("Error occurred while trying to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const filteredComments = localComment.filter(com => com._id !== commentId);
    
    try{
        const response = await fetch(`${process.env.REACT_APP_API_URL}/comments/${commentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        console.log(response)
        const data = await response.json();
        setLocalComments(filteredComments);

        toast.warn("Comment has been deleted")


    }catch{
        toast.error("Error while trying to delete comment")
    }
  }

  return (
        <div className="d-flex flex-column min-vh-100">

    <HeaderWithoutSearch/>
    <main className="flex-grow-1 container">
    <div className="container">
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
      {error && <p>Error while trying to get lead details</p>}
      {data &&
        data.Leads && salesAgent && salesAgent.agents && 
        // data.Leads.length > 0 ? 
        // <div className="card p-3">
        data.Leads.map((lead) => (
          <div className="text-center p-3">
            <div className="card p-3">
              <p>
                <strong>Lead Name: </strong>
                {lead.name}
              </p>
              <p>
                <strong>Lead Source: </strong>
                {lead.source}
              </p>
              <p>
                <strong>TimeToClose: </strong>
                {lead.timeToClose}
              </p>
              <p>
                <strong>Priority: </strong>
                {lead.priority}
              </p>
              <p><strong>Status: </strong>
              {lead.status}</p>
              <p><strong>Sales Agent: </strong>
              {`${getSalesAgent(`${lead.salesAgent}`)}`}</p>
             <p><strong>Tags: </strong>{lead.tags.join(", ")}</p>

              {/* <Link className="btn btn-primary" to = "/addLead" state = {{Lead: lead, state: "edit"}}>Edit Lead Details</Link> */}
            </div>
            <Link className="btn btn-primary mt-3" to = "/addLead" state = {{Lead: lead, state: "edit"}}>Edit Lead Details</Link>

            <hr />

            {/* <h2>Comments</h2> */}
            <br />

            {localComment && localComment.length > 0 ? (
              <div>
                <h2>Comments</h2>
                <div className="row">
                  {localComment.map((com) => (
                    <div className="col-md-6">
                      <div className="card mt-3">
                        <p>
                          <strong>Author: </strong> {`${getSalesAgent(`${com.author}`)}`}
                        </p>
                        <p>
                          <strong>Date/Time: </strong>
                          {com.createdAt}
                        </p>
                        <p>
                          <strong>Comment: </strong>
                          {com.commentText}
                        </p>
                      </div>
                      <button className="btn btn-danger form-control mt-2" onClick = {() => {handleDeleteComment(`${com._id}`)}}>Delete Comment</button>
                    </div>
                  ))}
                </div>{" "}
                <br />
                {/* <Link
                  className="btn btn-secondary"
                  onClick={() =>
                    addComment === true
                      ? setAddComment(false)
                      : setAddComment(true)
                  }
                >
                  Add New Comment
                </Link>
                <br />
                <br />
                {addComment === true ? (
                  <form onSubmit={handleSubmit}>
                    <label>
                      <strong>Author:</strong>{" "}
                    </label>
                    {salesAgent && salesAgent.agents.length > 0 ? (
                      <div>
                       
                          <select
                            required
                            onChange={(e) => setAuthor(e.target.value)}
                          >
                            {salesAgent.agents.map((agent) => (
                              <option  value={`${agent._id}`}>
                                {agent.name}
                              </option>
                            ))}
                          </select>
                          <br />
                          <br />
                          <label>
                            <strong>CommentText:</strong>
                          </label>
                          <br />
                          <input
                            required
                            type="text"
                            onChange={(e) => setCommentText(e.target.value)}
                          />
                          <br />
                          <br />
                          <button type = "submit" className="btn btn-primary">
                            Submit Comment
                          </button>
                        
                        {commentAdded === true? <div>Comment added.</div> : ""}
                      </div>
                    ) : (
                      ""
                    )}
                  </form>
                ) : (
                  ""
                )} */}
              </div>
            ) : (
              <div>
                <img  src = "https://imgs.search.brave.com/4nrw7cKJJ00s2vdt_EmlcBgbhgjVuIzpKHeFO4zmdNk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAwLzg5LzM4LzM2/LzM2MF9GXzg5Mzgz/NjA3X1dQUXRxOU5G/MU8yVnZvdTdDVDFX/Z2pDdFFvb2VYVmp1/LmpwZw"/>
              </div>
            )}

           <hr/>

            <Link
                  className="btn btn-secondary"
                  onClick={() =>
                    addComment === true
                      ? setAddComment(false)
                      : setAddComment(true)
                  }
                >
                  Add New Comment
                </Link>
                <br />
                <br />
                {addComment === true ? (
                  <form onSubmit={handleSubmit}>
                    <label>
                      <strong>Author:</strong>{" "}
                    </label>
                    {salesAgent && salesAgent.agents.length > 0 ? (
                      <div>
                       
                          <select
                            required
                            onChange={(e) => setAuthor(e.target.value)}
                          >
                            {salesAgent.agents.map((agent) => (
                              <option  value={`${agent._id}`}>
                                {agent.name}
                              </option>
                            ))}
                          </select>
                          <br />
                          <br />
                          <label>
                            <strong>CommentText:</strong>
                          </label>
                          <br />
                          <input
                            required
                            type="text"
                            onChange={(e) => setCommentText(e.target.value)}
                          />
                          <br />
                          <br />
                          <button type = "submit" className="btn btn-primary">
                            Submit Comment
                          </button>
                        
                        {/* {commentAdded === true? <div>Comment added.</div> : ""} */}
                      </div>
                    ) : (
                      ""
                    )}
                  </form>
                ) : (
                  ""
                )}
          </div>
        ))}
    </div>
    </main>
    <Footer/>
    </div>
  );
};

export default LeadManagement;
