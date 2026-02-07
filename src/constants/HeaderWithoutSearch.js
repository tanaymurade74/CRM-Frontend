
import { NavLink } from "react-router-dom"
const HeaderWithoutSearch = () => {

   return  <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <NavLink className="navbar-brand text-danger fst-italic" to="/">
            <img className="me-3" style ={{height: "50px", width: "50px"}} 
            alt = ""
            src = "https://static.vecteezy.com/system/resources/previews/026/590/504/non_2x/crm-logo-design-inspiration-for-a-unique-identity-modern-elegance-and-creative-design-watermark-your-success-with-the-striking-this-logo-vector.jpg"/>

            {/* CRM */}
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto ps-2 ps-lg-0">
              

              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  <img className = "img-fluid" style ={{height: "35px", objectFit: "cover"}}
                  src = "https://www.pngkey.com/png/full/357-3576760_digital-dashboards-bi-dashboard-icon-png-flat.png"/>
                </NavLink>
              </li>

               <li className="nav-item">
                <NavLink className="nav-link" to="/settings">
                  <img className = "img-fluid" style ={{height: "35px", objectFit: "cover"}}
                  alt = ""
                  src = "https://cdn-icons-png.flaticon.com/512/3524/3524659.png"/>
                {/* //   src = "https://imgs.search.brave.com/W0rThKMN88Gt0xEG5hx_ZupIfeK6QhqpQc7kfX2rCaE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/aWNvbnM4LmNvbS9z/dGlja2Vycy8xMjAw/L3VzZXItbWFsZS1j/aXJjbGUuanBn"/> */}
                </NavLink>
              </li>
             
            </ul>

          </div>
          
        </div>
      </nav>
    </div>

}

export default HeaderWithoutSearch;