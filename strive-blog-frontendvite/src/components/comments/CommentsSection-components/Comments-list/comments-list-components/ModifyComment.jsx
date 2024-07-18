import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap"
import { updateComment } from "../../../../../data/apiAxios";
import { CommentsContext, CommentsLoadingContext, LoggedUserDataContext } from "../../../../../data/Context";

function ModifyComment( { postId, id, content, handleSpinnerTrue, handleSpinnerFalse } ) {

  //STATO PER GESTIRE L'APERTURA E LA CHIUSURA DEL MODALE
  const [show, setShow] = useState(false);

  //FUNZIONI CHE MI SERVONO PER CHIUDERE ED APRIRE IL MODALE
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);  

  //CREO UNA FUNZIONE PER GESTIRMI L'ID
  const [ idstate, setIdState ] = useState(id)

  //CREO UNO STATO PER POTERMI GESTIRE IL CONTENUTO
  const [modifiedContent, setModifiedContent] = useState({
    name: "",
    email : "",
    content: content,
    _id : id
  })

  //USO IL CONTEXT
  const { comments, setComments } = useContext(CommentsContext)
  const { userLogged, setUserLogged } = useContext(LoggedUserDataContext)

  //GESTISCO IL SUBMIT DEL FORM CHE FA L'UPDATE DEL COMMENTO TRAMITE LA FUNZIONE CREATA CON AXIOS
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {     
      handleSpinnerTrue()
      await updateComment(postId, idstate, modifiedContent);
      setComments(comments.map(comment => comment._id == idstate ? modifiedContent : comment));
      handleSpinnerFalse()
      handleClose()
    } catch (error) {
      console.error("Errore nella creazione del commento:", error);
    }
  };

  // AL CARICAMENTO DEL COMPONENTE INSERISCO I DATI DEL NOME E DELL'EMAIL DELL'UTENTE
  useEffect(() => {
    setModifiedContent({...modifiedContent, email : userLogged.email, name : userLogged.nome});
  }, [])

  return (
    <>
      <Button variant="outline-warning" className="me-3" onClick={handleShow}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          fill="currentColor" 
          className="bi bi-pencil-fill" 
          viewBox="0 0 16 16">
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
        </svg>
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {handleSubmit(e)}}> 
            <Form.Group
              className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={modifiedContent.content}
                onChange={e => setModifiedContent({...modifiedContent, content: e.target.value})}/>
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
                className="text-white"
              >
                Modifica
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>


  )
}

export default ModifyComment