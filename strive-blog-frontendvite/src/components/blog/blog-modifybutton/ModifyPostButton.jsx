import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import  "./styles.css";
import { getSinglePost, updatePost } from '../../../data/apiAxios';
import { CurrentPageContext, PostsContext } from '../../../data/Context';
import { useNavigate } from 'react-router-dom';

function ModifyPostbutton( { id } ) {

  //STATO PER GESTIRE L'APERTURA E LA CHIUSURA DEL MODALE
  const [show, setShow] = useState(false);

  //FUNZIONI CHE MI SERVONO PER CHIUDERE ED APRIRE IL MODALE
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true); 

  //USO IL CONTEXT
  const { posts, setPosts } = useContext(PostsContext)
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext)

  //HOOK PER LA NAVIGAZIONE
  const navigate = useNavigate();

  //FUNZIONE IN CUI MI SALVERO I DETTAGLI DEL POST
  const [postDetails, setPostDetails] = useState('')

  //CREO LA FUNZIONE PER GESTIRE LE MODIFICHE AL POST
  const [modifiedPost, setModifiedPost] = useState({})

  //FUNZIONE PER OTTENERE I DETTAGLI DEL POST TRAMITE LA FUNZIONE CREATA SU AXIOS
  const getPostDetails = async (id) => {
    try {
      const response = await getSinglePost(id);
      setModifiedPost(response.data)
    } catch (error) {
      console.error("Errore nella fetch dei dettagli del post:", error)
      alert("Errore nella fetch dei dettagli del post:")
    }
  }

  //AL CARICAMENTO DEL COMPONENTE ESEGUO LA FUNZIONE QUI SOPRA
  useEffect(() => {
    getPostDetails(id);
  },[])


  //FUNZIONE PER GESTIRE I CAMBAIMANETI DEGLI INPUT NEL FORM E INTEGRARLI NELLO STATO
  function handleChange(e) {

    const { name, value } = e.target;

    if (name === "readTimeValue") {
      setModifiedPost({
        ...modifiedPost,
        readTime: { ...modifiedPost.readTime, value: parseInt(value) },
      });
    } else {
      setModifiedPost({ ...modifiedPost, [name]: value })
    }
  }

  //CREO UNA FUNZIONE PER GESTIRE IL SUBMIT DEL FORM IN CUI ESEGUO L'UPDATE DEL POST TRAMITE LA FUNZIONE CREATA SU AXIOS
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await updatePost(id, modifiedPost);
      setCurrentPage(1)
      handleClose()
      alert('Post modificato con successo!')
      navigate('/')
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
    }
  };

  return (
    <>
      <Button variant="warning" onClick={handleShow} className='hover-white fw-bold me-3'>
        Modifica Post
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton >
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {handleSubmit(e)}}>
            <Form.Group controlId="blog-form">
              <Form.Label>Read Time</Form.Label>
              <Form.Control 
                size="lg" 
                placeholder="Read Time" 
                // value={modifiedPost.readTime.value}
                onChange={handleChange} 
                type="number" 
                name="readTimeValue"
                min="0"
              />
            </Form.Group>
            <Form.Group controlId="blog-category" className="mt-3" >
              <Form.Label>Categoria</Form.Label>
              <Form.Select 
                size="lg" 
                as="select" 
                
                onChange={handleChange} 
              >
                <option>Categoria 1</option>
                <option>Categoria 2</option>
                <option>Categoria 3</option>
                <option>Categoria 4</option>
                <option>Categoria 5</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="blog-form" className="mt-3">
              <Form.Label>Titolo</Form.Label>
              <Form.Control 
                size="lg" 
                placeholder="Titolo"
                value={modifiedPost.title}
                onChange={handleChange} 
                name="title"
              />
            </Form.Group>
            <Form.Group controlId="blog-content" className="mt-3">
              <Form.Label>Contenuto Blog</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                size="lg" 
                name="content"
                onChange={handleChange} 
                placeholder="Inserisci il commento"
                value={modifiedPost.content}
                required
              />
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
                variant="dark"
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

export default ModifyPostbutton;

