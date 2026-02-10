import { Link } from "react-router-dom";
import Footer from "../constants/Footer";
import HeaderWithoutSearch from "../constants/HeaderWithoutSearch";

const HomePage = () => {
  return (
        <div className="d-flex flex-column min-vh-100">

    <HeaderWithoutSearch/>
    <main className="container py-5 flex-grow-1">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Anvaya CRM</h1>
        <p className="lead text-muted">Select a module to begin</p>
        <hr className="w-25 mx-auto" />
      </div>

      <div className="row g-4 justify-content-center">
        
        <div className="col-md-6 col-lg-3">
          <Link to="/leadList" style={{ textDecoration: "none" }}>
            <div className="card h-100 border-1 text-center p-4 option-card">
              <div className="card-body">
                <h3 className="card-title text-primary">Leads</h3>
                <p className="card-text text-muted">View and manage potential clients</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-6 col-lg-3">
          <Link to="/salesAgentList" style={{ textDecoration: "none" }}>
            <div className="card h-100 border-1 text-center p-4 option-card">
              <div className="card-body">
                <h3 className="card-title text-success">Agents</h3>
                <p className="card-text text-muted">Manage team members</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-6 col-lg-3">
          <Link to="/reports" style={{ textDecoration: "none" }}>
            <div className="card h-100  border-1 text-center p-4 option-card">
              <div className="card-body">
                <h3 className="card-title text-warning">Reports</h3>
                <p className="card-text text-muted">Visualize performance data</p>
              </div>
            </div>
          </Link>
        </div>

       
        
       

      </div>
      <br/><br/>
      <hr/>
      <div className="text-center">
        <div className="row justify-content-center mt-4">
        
        <div className="col-md-6 col-lg-3">
        
     

</div>
</div>
      </div>
    </main>
    <Footer/>
    </div>
  );
};

export default HomePage;