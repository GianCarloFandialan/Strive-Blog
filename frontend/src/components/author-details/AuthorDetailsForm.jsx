import { Button, Container, Form } from "react-bootstrap"
import { LoggedUserDataContext } from "../../data/Context"
import { useContext, useState } from "react"
import { updateAuthor } from "../../data/apiAxios"

function AuthorDetailsForm( { handleLoading }) {

  //USO IL CONTEXT  
  const { userLogged, setUserLogged } = useContext(LoggedUserDataContext)

  //CREO UNO STATO PER POTERMI GESTIRE I DATI DELL'AUTORE
  const [ author, setAuthor ] = useState(userLogged)

  //CREO UNO STATO PER POTERMI GESTIRE I DATI DELL'AUTORE
  const [ birthDate, setBirthDate ] = useState()

  //FUNZIONE PER GESTIRE I CAMBAIMANETI DEGLI INPUT NEL FORM E INTEGRARLI NELLO STATO
  function handleChange(e) {

    const { name, value } = e.target;

    setAuthor({ ...author, [name]: value.charAt(0).toUpperCase()+value.slice(1) });
  }

  //CREO UNA FUNZIONE PER GESTIRE IL SUBMIT DEL FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      handleLoading(true)
      const response = await updateAuthor(author._id, author);
      console.log(response.data);
      setUserLogged(response.data);
      handleLoading(false)
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
    }
  };

  return(
    <Container>
      <Form onSubmit={(e) => {handleSubmit(e)}}>
        <Form.Group  className="mt-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control 
            size="lg" 
            placeholder="Inserisci il nome"
            value={author.nome} 
            onChange={handleChange}
            name="nome"
            required
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Cognome</Form.Label>
          <Form.Control 
            size="lg" 
            placeholder="Cognome"
            value={author.cognome} 
            onChange={handleChange}
            name="cognome"
            required
          />
        </Form.Group>
        <Form.Group  className="mt-3">
          <Form.Label>Data di nascita</Form.Label>
          <Form.Control 
            size="lg"            
            type="date" 
            value={birthDate} 
            onChange={(e) => {
              setBirthDate(e.target.value)
              setAuthor({
                ...author, dataDiNascita: e.target.value
              })
            }}
            name="dataDiNascita"
            max={new Date().toJSON().slice(0, 10)}
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
            Modifica
          </Button>
        </Form.Group>
      </Form>
    </Container>
  )
}

export default AuthorDetailsForm