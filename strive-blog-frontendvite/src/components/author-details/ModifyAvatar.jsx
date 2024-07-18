import { Button, Form, Modal } from "react-bootstrap"
import { CurrentPageContext, LoggedUserDataContext } from "../../data/Context"
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateAuthorAvatar } from "../../data/apiAxios";

function ModifyAvatar( { handleLoading } ) {

  //USO IL CONTEXT  
  const { userLogged, setUserLogged } = useContext(LoggedUserDataContext)
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext)

  //STATO PER GESTIRE L'APERTURA E LA CHIUSURA DEL MODALE
  const [show, setShow] = useState(false);

  //FUNZIONI CHE MI SERVONO PER CHIUDERE ED APRIRE IL MODALE
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      handleLoading(true)
      const formData = new FormData();

      if (coverFile) {
        formData.append('avatar', coverFile);
      }
      
      const response = await updateAuthorAvatar(userLogged._id, formData);
      console.log(response.data);
      setUserLogged(response.data)
      handleClose()
      handleLoading(false)
    } catch (error) {
      console.error("Errore nella modifica dell'avatar dell'autore:", error);
    }
  };

  return(
    <>
      <Button 
        variant="warning" 
        className="modify-avatar fw-bold rounded-5 position-absolute top-50 start-50 translate-middle"
        onClick={handleShow}>
        Modifica avatar
      </Button>

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
              <Button variant="warning" onClick={handleClose} type="submit" className="fw-bold">
                Modifica avatar
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ModifyAvatar