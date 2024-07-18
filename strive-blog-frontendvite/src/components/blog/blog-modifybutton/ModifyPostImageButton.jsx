import { useContext, useState } from "react";
import { Alert, Button, Container, Form, Modal } from "react-bootstrap"
import { updatePostCover } from "../../../data/apiAxios";
import { CurrentPageContext } from "../../../data/Context";
import { useNavigate } from "react-router-dom";

function ModifyPostImageButton( { postId } ) {

  //STATO PER GESTIRE L'APERTURA E LA CHIUSURA DEL MODALE
  const [show, setShow] = useState(false);

  //FUNZIONI CHE MI SERVONO PER CHIUDERE ED APRIRE IL MODALE
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //USO IL CONTEXT
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext)

  //HOOK PER LA NAIGAZIONE
  const navigate = useNavigate();

  //CREO UNO STATO PER POTERMI GESTIRE IL FILE CARICATO
  const [coverFile, setCoverFile] = useState(null);

  //STATO PER GESTIRMI L'ERRORE NE LCASO IL FILE SIA TROPPO GRANDE
  const [error, setError] = useState("")

  //MI GESTISCO IL CARICAMENTO DEL FILE DELL'IMMAGINE
  const handleFileChange = (e) => {
    if (e.target.files[0].size > 5 * 1024 * 1024) {
      setError("La misura massima del file è di 5MB")
    } else {
      setError('')
      setCoverFile(e.target.files[0])
    }
  };

  //CREO UNA FUNZIONE PER GESTIRE IL SUBMIT DEL FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      if (coverFile) {
        formData.append('cover', coverFile);
      }
      
      await updatePostCover(postId, formData);
      setCurrentPage(1)
      handleClose()
      navigate("/");
    } catch (error) {
      console.error("Errore nella modifica della cover del post:", error);
    }
  };

  return (
    <>
      <Button variant="dark" className="position-absolute top-0 end-0" onClick={handleShow}>Cambia l'immagine</Button> 

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cambia l'immagine</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {handleSubmit(e)}}>
            <Form.Group className="mb-3">
              <Form.Label>Cover</Form.Label>
              {error &&
                <Alert variant={'danger'} className="py-0 mb-0">
                  {error}
                </Alert>
              }
              <Form.Control 
                type="file" 
                id="cover"
                name="cover"
                onChange={handleFileChange}
                required
              />
            </Form.Group>
            <Form.Group
              className="mb-3 d-flex justify-content-center"
            >
              <Button variant="primary" onClick={handleClose} type="submit">
                Modifica updatePostCover
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
       
  )
}

export default ModifyPostImageButton