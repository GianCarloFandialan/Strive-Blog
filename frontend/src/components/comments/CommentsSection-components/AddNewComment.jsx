import { useContext, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap"
import { createComment } from "../../../data/apiAxios";
import { LoggedUserDataContext } from "../../../data/Context";

function AddNewComment( { id, getAllComments } ) {

  //STATO PER GESTIRE L'APERTURA E LA CHIUSURA DEL MODALE
  const [show, setShow] = useState(false);

  //FUNZIONI CHE MI SERVONO PER CHIUDERE ED APRIRE IL MODALE
  const handleClose = () => {
    setShow(false)
    setNewComment({
      email: "",
    })
  };

  const handleShow = () => {
    setShow(true)
    setNewComment({...newComment, email : userLogged.email, name : userLogged.nome + " " + userLogged.cognome})
  };  

  //CREO LO STATO PER POTERMI GESTIRE IL POST DEL COMMENTO
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    content: ""
  });

  //USO IL CONTEXT
  const { userLogged, setUserLogged } = useContext(LoggedUserDataContext)

  //AL SUBMIT DEL FORM RICHIAMO LA FUNZIONE CREATA SU AXIOS PER CREARE UN COMMENTO
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {        
      await createComment(id, newComment);
      getAllComments(id) 
      handleClose()
    } catch (error) {
      console.error("Errore nella creazione del commento:", error);
    }
  }

  return (
    <Container fluid className=" d-flex justify-content-center">
      <Button variant="outline-success" className="fs-6 py-2 px-1 my-3 fw-bold" onClick={handleShow}>
        Aggiungi nuovo commento
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Aggiungi un commento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {handleSubmit(e)}}>
            <Form.Group className="mt-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control 
                size="lg" 
                name="name"
                required
                value={newComment.name}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3" >
              <Form.Label>Email address</Form.Label>
              <Form.Control
                size="lg" 
                type="email"
                name="email"
                value={newComment.email}
                readOnly
                required
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
            >
              <Form.Label>Contenuto</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                size="lg" 
                name="content"
                value={newComment.content}
                onChange={(e) => setNewComment({...newComment, content: e.target.value})} 
                placeholder="Inserisci il commento"
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="d-flex justify-content-end"
            >
              <Button 
                variant="secondary" 
                onClick={handleClose} 
                className="me-3"
              >
                Annulla
              </Button>

              <Button 
                variant="success" 
                type="submit"
              >
                Crea
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>

      </Modal>

    </Container>
  )
}

export default AddNewComment