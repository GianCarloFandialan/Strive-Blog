import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { CurrentPageContext } from "../../data/Context";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { registerUser } from "../../data/apiAxios";

function Register() {

  //CREO UNO STATO PER POTERMI GESTIRE I DATI DEL NUOVO UTENTE CHE SI STA REGISTRANDO
  const [newUser, setNewUser] = useState({
    nome: "",
    cognome: "",
    email: "",
    dataDiNascita: "",
    password: "",
  })

  //HOOK PER LA NAIGAZIONE
  const navigate = useNavigate();

  //CREO UNO STATO PER POTERMI GESTIRE IL FILE CARICATO
  const [avatarFile, setAvatarFile] = useState(null);

  //MI GESTISCO IL CARICAMENTO DEL FILE DELL'IMMAGINE
  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  //FUNZIONE PER GESTIRE I CAMBAIMANETI DEGLI INPUT NEL FORM E INTEGRARLI NELLO STATO
  function handleChange(e) {

    const { name, value } = e.target;

    if (name === "nome" || name === "cognome"){
      setNewUser({ ...newUser, [name]: value.charAt(0).toUpperCase()+value.slice(1) });
    } else if (name === "email") {
      setNewUser({ ...newUser, email: value.charAt(0).toLowerCase()+value.slice(1) })
    } else {
      setNewUser({ ...newUser, [name]: value })
    }
  }

  //USO IL CONTEXT
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext)

  //CREO UNO STATO PER GESTIRMI LA CONFERMA DELLA PASSWORD
  const [ confirmPassword, setConfirmPassword ] = useState("")

  //CREO UNO STATO PER POTERMI GESTIRE L'ALERT NEL CASO LE PASSWORD INSERITE NON COMBACIANO
  const [ passwordError, setPasswordError] = useState(false)

  //CREO UNA FUNZIONE PER GESTIRE IL SUBMIT DEL FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (confirmPassword !== newUser.password) {
      setPasswordError(true)
      return;
    }

    try {
      const formData = new FormData();
            
      Object.keys(newUser).forEach(key => formData.append(key, newUser[key]));

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await registerUser(formData)
      setPasswordError(false)
      setCurrentPage(1)
      navigate("/");
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
    }
  };

  return(
    <Container className="new-blog-container">
      <h1 className="text-center mt-3">Registrazione</h1>
      {passwordError && <Alert  variant={'danger'}>
        Le password non corrispondono
      </Alert>}
      <Form onSubmit={(e) => {handleSubmit(e)}}>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Nome*</Form.Label>
          <Form.Control 
            size="lg" 
            placeholder="Inserisci il nome"
            value={newUser.nome} 
            onChange={handleChange}
            name="nome"
            required
          />
        </Form.Group>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Cognome*</Form.Label>
          <Form.Control 
            size="lg" 
            placeholder="Cognome"
            value={newUser.cognome} 
            onChange={handleChange}
            name="cognome"
            required
          />
        </Form.Group>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Email*</Form.Label>
          <Form.Control 
            size="lg" 
            placeholder="Email" 
            type="email" 
            value={newUser.email} 
            onChange={handleChange}
            name="email"
            required
          />
        </Form.Group>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Data di nascita*</Form.Label>
          <Form.Control 
            size="lg"            
            type="date" 
            value={newUser.dataDiNascita} 
            onChange={handleChange}
            name="dataDiNascita"
            max={new Date().toJSON().slice(0, 10)}
            required
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Avatar*</Form.Label>
          <Form.Control 
            type="file" 
            id="avatar"
            name="avatar"
            onChange={handleFileChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Password*</Form.Label>
          <Form.Control 
            size="lg" 
            placeholder="Password" 
            type="password" 
            value={newUser.password} 
            onChange={handleChange}
            name="password"
            required
          />
        </Form.Group>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Conferma password*</Form.Label>
          <Form.Control 
            size="lg" 
            placeholder="Password" 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="d-flex mt-3 justify-content-center">
          <Button
            type="submit"
            size="lg"
            variant="success"
            style={{
              marginLeft: "1em",
            }}           
          >
            Registrati
          </Button>
        </Form.Group>
      </Form>
    </Container>
  )
}

export default Register