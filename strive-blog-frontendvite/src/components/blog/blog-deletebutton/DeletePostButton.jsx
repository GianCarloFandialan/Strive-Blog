import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { deletePost, getSinglePost, updatePost } from '../../../data/apiAxios';
import { CurrentPageContext, PostsContext } from '../../../data/Context';
import { useNavigate } from 'react-router-dom';

function DeletePostButton( { id } ) {

  //STATO PER GESTIRE L'APERTURA E LA CHIUSURA DEL MODALE
  const [show, setShow] = useState(false);

  //FUNZIONI CHE MI SERVONO PER CHIUDERE ED APRIRE IL MODALE
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true); 

  //USO IL CONTEXT
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext)
  const { posts, setPosts } = useContext(PostsContext)

  //HOOK PER LA NAIGAZIONE
  const navigate = useNavigate();

  //CREO UNA FUNZIONE PER GESTIRE IL SUBMIT DEL FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    deletePostHandler(id)

  };

  async function deletePostHandler(id) {
    try {
      await deletePost(id);
      setCurrentPage(1)
      handleClose()
      alert('Post cancellato con successo!')
      navigate('/')
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
    }
  }



  return (
    <>
      <Button variant="danger" onClick={handleShow} className='hover-white fw-bold'>
        Cancella Post
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton >
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {handleSubmit(e)}}>
            <Form.Group controlId="blog-form " className='fs-5'>
              Sei sicuro di voler cancellare il post?
            </Form.Group>
            <Form.Group className="d-flex mt-3 justify-content-end">
            <Button 
                variant="secondary" 
                onClick={handleClose} 
                className="me-3"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                size="lg"
                variant="danger"
                style={{
                  marginLeft: "1em",
                }}           
              >
                Invia
              </Button>
            </Form.Group>
            
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DeletePostButton;