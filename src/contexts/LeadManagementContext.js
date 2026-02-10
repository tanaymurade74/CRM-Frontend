
import { createContext, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../useFetch";
import { useState } from "react";
import {toast} from "react-toastify"

const LeadManagementContext = createContext();
const useLeadManagementContext = () => useContext(LeadManagementContext);
export default useLeadManagementContext;

export function LeadManagementProvider({children}){


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

  }  }, [comment])

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


  return <LeadManagementContext.Provider value = {{leadId, addComment, setAddComment,author, setAuthor 
    , commentText, setCommentText, commentAdded, setCommentAdded, localComment, setLocalComments
    , sortOrder, setSortOrder, data, loading, error, comment, salesAgent, sortedComments, getSalesAgent, handleSubmit
  }}>

{children}

  </LeadManagementContext.Provider>

}