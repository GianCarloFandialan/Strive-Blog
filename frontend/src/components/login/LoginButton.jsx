import { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../../data/apiAxios";
import { CurrentPageContext } from "../../data/Context";

function Login() {

  //STATO PER GESTIRE L'APERTURA E LA CHIUSURA DEL MODALE
  const [show, setShow] = useState(false);

  //FUNZIONI CHE MI SERVONO PER CHIUDERE ED APRIRE IL MODALE
  const handleClose = () => {
    setShow(false)
    setCredentials({
      email: "",
      password: ""
    })
  };
  const handleShow = () => setShow(true);  

  //HOOK PER LA NAIGAZIONE
  const navigate = useNavigate();

  //CREO UNO STATO PER POTERMI GESTIRE LE CREDENZIALI
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })

  //FUNZIONE PER GESTIRE I CAMBAIMANETI DEGLI INPUT NEL FORM E INTEGRARLI NELLO STATO
  function handleChange(e) {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value })
  }

  //USO IL CONTEXT
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext)

  //CREO UNA FUNZIONE PER GESTIRE IL SUBMIT DEL FORM CHE UTILIZA LA FUNZIONE DI LOGIN CREATA SU AXIOS
  const handleSubmit = async (e) => {

    e.preventDefault(); 

    try {
      const response = await loginUser(credentials);  
      localStorage.setItem("token", response.token); // MEMORIZZA IL TOKEN DI AUTENTICAZIONE NEL LOCALSTORAGE
      
      // TRIGGER L'EVENTO STORAGE PER AGGIORNARE LA NAVBAR
      window.dispatchEvent(new Event("storage")); // SCATENA UN EVENTO DI STORAGE PER AGGIORNARE COMPONENTI COME LA NAVBAR
      alert("Login effettuato con successo!"); // Mostra un messaggio di successo
      setCurrentPage(1)
      handleClose()
      navigate("/");
    } catch (error) {
      console.error("Errore durante il login:", error); // Logga l'errore in console
      alert("Credenziali non valide. Riprova."); // Mostra un messaggio di errore
    }
  };

  // HOOK PER ACCEDERE AI PARAMETRI DELL'URL CORRENTE
  const location = useLocation();

  // USE EFFECT CHE VERIFICA IL TOKEN
  useEffect(() => {

    const params = new URLSearchParams(location.search);

    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    }

  }, [location, navigate])

  //FUNZIONE PER GESTIRE IL LOGIN TRAMITE GOOGLE
  const handleGoogleLogin = () => {
    // REINDIRIZZIAMO L'UTENTE ALL'ENDPOINT DEL BACKEND CHE INIZIA IL PROCESSO DI AUTENTICAZIONE GOOGLE
    window.location.href = "http://localhost:5001/auth/google";
  };

  //FUNZIONE PER GESTIRE IL LOGIN TRAMITE GITHUB
  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:5001/auth/github";
  };

  return (
    <>
      <Button variant="outline-dark" onClick={handleShow}>
        Login
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {handleSubmit(e)}}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Inserisci l'email"
                value={credentials.email}
                onChange={handleChange}
                autoFocus
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" >
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Inserisci la password"
                value={credentials.password}
                onChange={handleChange}
                name="password"
                required
              />
            </Form.Group>
            <Form.Group
              className="d-flex justify-content-center mb-3"
            >
              <Button 
                variant="success" 
                type="submit"
                className="text-white w-50"
              >
                Login
              </Button>
            </Form.Group>
            <Form.Group className="mb-3 text-center" >
              Non hai un account? 
              <span 
                onClick={() => {
                  navigate("/registration")
                  handleClose()
                }} 
                style={{cursor:"pointer"}} 
                className="text-primary ms-1"> 
                Registrati
              </span>
            </Form.Group>
          </Form>
          <Container className="justify-content-center d-flex gap-3">
            <Button onClick={handleGoogleLogin} variant="primary" className="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google me-2" viewBox="0 0 16 16">
                <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
              </svg>
              Accedi con Google
            </Button>
            <Button onClick={handleGitHubLogin} variant="dark" className="d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github me-2" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
              </svg>
              Accedi con Github
            </Button>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Login