import { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap"
import { CommentsContext } from "../../../../../data/Context";
import { deleteComment } from "../../../../../data/apiAxios";

function RemoveComment( { postId, id, handleSpinnerTrue, handleSpinnerFalse } ) {

  //STATO PER GESTIRE L'APERTURA E LA CHIUSURA DEL MODALE
  const [show, setShow] = useState(false);

  //FUNZIONI CHE MI SERVONO PER CHIUDERE ED APRIRE IL MODALE
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);  

  //USO IL CONTEXT
  const { comments, setComments } = useContext(CommentsContext)

  //FUNZIONE PER CANCELLARE IL COMMENTO TRAMITE LA FUNZIONE CREATA SU AXIOS DOPO AVER PREMUTO IL BOTTONE PER CANCELLARE
  const handleDelete = async () => {

    try {
      handleSpinnerTrue()
      await deleteComment(postId, id);
      setComments(comments.filter((comment) => comment._id !== id));
      handleClose()
      handleSpinnerFalse()
      console.log("Cancellazzione avvenuta con successo");
    } catch (error) {

      console.error("Errore nella cancellazione del commento:", error);
    }
  }

  return (
    <>
      <Button variant="outline-danger" onClick={handleShow}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          fill="currentColor" 
          className="bi bi-trash-fill" 
          viewBox="0 0 16 16">
          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
        </svg>
      </Button>

      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancellazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>Sei sicuro di voler cancellare il commento?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annulla
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Cancella
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    
  )

}

export default RemoveComment