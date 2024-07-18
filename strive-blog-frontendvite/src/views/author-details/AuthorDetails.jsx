import { useContext, useEffect, useState } from "react";
import { Container, Image, Spinner } from "react-bootstrap";
import AuthorDetailsForm from "../../components/author-details/AuthorDetailsForm";
import { LoggedInContext, LoggedUserDataContext } from "../../data/Context";
import { useNavigate } from "react-router-dom";
import ModifyAvatar from "../../components/author-details/ModifyAvatar";

function AuthorDetails() {

  //USO IL CONTEXT  
  const { isLoggedIn, setIsLoggedIn } = useContext(LoggedInContext)
  const { userLogged, setUserLogged } = useContext(LoggedUserDataContext)

  //HOOK PER LA NAIGAZIONE
  const navigate = useNavigate();

  //CREO UNO STATO PER POTERMI GESTIRE I DATI DELL'UTENTE CHE HA FATTO L'ACCESSO PER RENDERE LA PAGINA PIÙ DINAMICA
  const [user, setUser] = useState(userLogged)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
    }
    setUser(userLogged)
  }, [userLogged])

  // CREOUNO STATO PER PER POTERMI GESITRE l'APPARIRE O NO DEL BOTTONE DI MODIIFICA DELL'AVATAR ALL'HOVER SULL'IMMAGINE
  const [ isModifyAvatar,  setIsModifyAvatar] = useState(false)

  // CREO UNO STATO PER POTERMI GESTIRE LA PAGINA MENTRE EFFETTUO LE MODIFICHE DELL'UTENTE
  const [isLoading, setIsloading] = useState(false)

  function handleLoading(a) {
    setIsloading(a)
  }

  return (
    <div className="blog-details-root">
      <Container>
        {!isLoading ?
          <Container fluid className="d-flex justify-content-center py-5 align-items-center fw-bold fs-1">
          {user.nome + ' ' } 
          {user.avatar ? 
            <div 
              className="d-flex flex-column position position-relative justify-content-center align-items-center"
              onMouseOver={() => setIsModifyAvatar(true)}
              onMouseOut={() => setIsModifyAvatar(false)}
            >
              <Image 
                className="author-avatar mx-2" 
                src={user.avatar} 
              /> 
              {isModifyAvatar && <ModifyAvatar handleLoading={handleLoading}/>}
            </div>
          : 
            <div 
              className="d-flex flex-column position position-relative justify-content-center align-items-center"
              onMouseOver={() => setIsModifyAvatar(true)}
              onMouseOut={() => setIsModifyAvatar(false)}
            >          
              <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
              </svg>
              {isModifyAvatar && <ModifyAvatar handleLoading={handleLoading}/>}
            </div>
          }
          {user.cognome}  
          </Container>
          :
          <Container fluid className="d-flex justify-content-center align-items-center" style={{minHeight: "30vh"}}>
            <Spinner animation="border" style={{width: "3rem", height: "3rem"}}/>
            <span className="fs-1">Caricamento..</span>
          </Container>
        }

        {!isLoading ?          
          <Container>
            <AuthorDetailsForm handleLoading={handleLoading}/>
          </Container>
          :
          <Container fluid className="d-flex justify-content-center align-items-center" style={{minHeight: "30vh"}}>
            <Spinner animation="border" style={{width: "3rem", height: "3rem"}}/>
            <span className="fs-1">Caricamento..</span>
          </Container>
        }
        
      </Container>
    </div>
  )
}

export default AuthorDetails