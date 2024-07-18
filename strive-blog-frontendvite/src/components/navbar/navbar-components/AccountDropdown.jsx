import { useContext, useEffect, useState } from "react"
import { Image, NavDropdown } from "react-bootstrap"
import { LoggedInContext, LoggedUserDataContext } from "../../../data/Context"
import { useNavigate } from "react-router-dom";
import "./styles.css";

function AccountDropdown() {

  //USO IL CONTEXT
  const { userLogged, setUserLogged } = useContext(LoggedUserDataContext)
  const { isLoggedIn, setIsLoggedIn } = useContext(LoggedInContext)

  //HOOK PER LA NAIGAZIONE
  const navigate = useNavigate();

  //CREO UNA FUNZIONE PER GESTIRMI IL LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  //CREO UNO STATO PER POTERMI GESTIRE I DATI DELL'UTENTE CHE HA FATTO L'ACCESSO PER RENDERE LA NAVBAR PIÙ DINAMICA
  const [user, setUser] = useState(userLogged)

  useEffect(() => {
    setUser(userLogged)
  },[userLogged])

  return(
    <NavDropdown
      title={user.avatar ?
        <Image 
          className="navbar-avatar mx-2" 
          src={user.avatar} 
          roundedCircle
        /> 
        :
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
        </svg>
        

      }
      align="end"
    >
      <NavDropdown.Item onClick={() => {navigate(`/author/${user._id}`)}}>{user.nome + ' '+ user.cognome}</NavDropdown.Item>
      <NavDropdown.Item onClick={() => {navigate(`/authorDetails/${user._id}`)}}>Modifica dati</NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
    </NavDropdown> 
  )
}

export default AccountDropdown