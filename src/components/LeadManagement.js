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
  const [sortOrder, setSortOrder] = useState("newest")


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

    //   localComment.sort((a, b) => {
    //     if(sortOrder === "newest"){
    //     const date1 =new Date (a.createdAt);
    //     const date2 = new Date(b.createdAt);

    //     return date1 - date2;
    //     }else{
    //        const date1 = new Date(a.createdAt);
    //     const date2 = new Date(b.createdAt);

    //     return date2 - date1;
    //     }
    //   })
    }
  }, [comment])

  useEffect(() => {
    if(salesAgent && salesAgent.agents.length > 0 && author === ""){
        setAuthor(salesAgent.agents[0]._id)
    }
  }, [salesAgent, author])

  const sortedComments = [...localComment].sort((a, b) => {
    const date1 = new Date(a.createdAt);
    const date2 = new Date(b.createdAt);

    if (sortOrder === "newest") {
      return date2 - date1; 
    } else {
      return date1 - date2; 
    }
  });




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
      <HeaderWithoutSearch />
      
      <main className="flex-grow-1 container mt-5">
        {loading && (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
            <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
          </div>
        )}
        
        {error && <p className="text-danger text-center">Error fetching details</p>}

        {data && data.Leads && data.Leads.map((lead) => (
          <div key={lead._id}>
            
            <div className="card  border-0 mb-5">
<div className="card-header bg-white p-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">                 <div>
                    <h3 className="mb-0 fw-bold text-dark">{lead.name}</h3>
                    <span >Lead ID: {lead._id}</span>
                 </div>
                 <Link 
className="btn btn-primary col-12 col-md-auto"
                    to="/addLead" 
                    state={{ Lead: lead, state: "edit" }}
                 >
                    Edit Details
                 </Link>
              </div>

             <div className="card-body p-0"> {/* Removed padding here to control it in rows */}
                <div className="container-fluid px-0">
                    
                    {/* Row 1: Status */}
                    <div className="row mx-0 py-3 border-bottom align-items-center">
                        <div className="col-5 col-md-4 text-start">
                            <span className="fw-bold text-muted text-uppercase small">Status</span>
                        </div>
                        <div className="col-7 col-md-8 text-end text-md-start">
                            <span className="text-dark">{lead.status}</span>
                        </div>
                    </div>

                    {/* Row 2: Priority */}
                    <div className="row mx-0 py-3 border-bottom align-items-center">
                        <div className="col-5 col-md-4 text-start">
                            <span className="fw-bold text-muted text-uppercase small">Priority</span>
                        </div>
                        <div className="col-7 col-md-8 text-end text-md-start">
                            <span 
                            >
                                {lead.priority}
                            </span>
                        </div>
                    </div>

                    {/* Row 3: Source */}
                    <div className="row mx-0 py-3 border-bottom align-items-center">
                        <div className="col-5 col-md-4 text-start">
                            <span className="fw-bold text-muted text-uppercase small">Source</span>
                        </div>
                        <div className="col-7 col-md-8 text-end text-md-start">
                            <span>{lead.source}</span>
                        </div>
                    </div>

                    {/* Row 4: Assigned Agent */}
                    <div className="row mx-0 py-3 border-bottom align-items-center">
                        <div className="col-5 col-md-4 text-start">
                            <span className="fw-bold text-muted text-uppercase small">Assigned Agent</span>
                        </div>
                        <div className="col-7 col-md-8 text-end text-md-start">
                            <span>{getSalesAgent(lead.salesAgent)}</span>
                        </div>
                    </div>

                    {/* Row 5: Time to Close */}
                    <div className="row mx-0 py-3 border-bottom align-items-center">
                        <div className="col-5 col-md-4 text-start">
                            <span className="fw-bold text-muted text-uppercase small">Time to Close</span>
                        </div>
                        <div className="col-7 col-md-8 text-end text-md-start">
                            <span>{lead.timeToClose} Days</span>
                        </div>
                    </div>

                    {/* Row 6: Tags */}
                    <div className="row mx-0 py-3 align-items-center"> {/* No border-bottom on last item */}
                        <div className="col-5 col-md-4 text-start">
                            <span className="fw-bold text-muted text-uppercase small">Tags</span>
                        </div>
                        <div className="col-7 col-md-8 text-end text-md-start">
                            <span className="text-dark">{lead.tags.join(", ")}</span>
                        </div>
                    </div>

                </div>
              </div>
            </div>
<hr/>
             <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Comments</h2>
                
                <div className="d-flex align-items-center">
                    <label className="me-2 ">Sort by:</label>
                    <select 
                        className="form-select form-select-sm" 
                        style={{width: "150px"}}
                        // value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option  value="newest" >Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            <div className="card p-4 mb-5 mt-4 ">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-12 col-md-5">
                            <label className="form-label">
                                <strong>Author:</strong>{" "}
                            </label><br />
                            {salesAgent && salesAgent.agents.length > 0 ? (
                                <div>
                                    <select
                                        className="form-select"
                                        required
                                        onChange={(e) => setAuthor(e.target.value)}
                                    >
                                        {salesAgent.agents.map((agent) => (
                                            <option value={`${agent._id}`}>
                                                {agent.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : ""}
                        </div>


                        <div className="col-12 col-md-5">
                            <label className="form-label">
                                <strong>CommentText:</strong>
                            </label>
                            <br />
                            <input
                                className="form-control"
                                required
                                type="text"
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                        </div>

                        <div className="col-12 col-md-2 d-flex align-items-end">
                            <button type="submit" className="btn btn-primary">
                                Add New Comment
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            
            {localComment && localComment.length > 0 ? (
                <div className="text-center">
                    {sortedComments.map((com) => (
                        <div key={com._id}>
                            <div className="card mt-4 p-3">
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
                            {/* <button className="btn btn-danger form-control mt-2" onClick={() => { handleDeleteComment(`${com._id}`) }}>Delete Comment</button> */}
                        </div>
                    ))}
                    <br />
                </div>
            ) : (
                <div className="text-center">
                    <img className = "img-fluid"src="https://imgs.search.brave.com/4nrw7cKJJ00s2vdt_EmlcBgbhgjVuIzpKHeFO4zmdNk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAwLzg5LzM4LzM2/LzM2MF9GXzg5Mzgz/NjA3X1dQUXRxOU5G/MU8yVnZvdTdDVDFX/Z2pDdFFvb2VYVmp1/LmpwZw" alt="No comments" />
                </div>
            )}

            <hr />

        </div>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default LeadManagement;
