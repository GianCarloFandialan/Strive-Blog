import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./styles.css";
import { createPost } from "../../data/apiAxios";
import { useNavigate } from "react-router-dom";
import { CurrentPageContext, LoggedUserDataContext, PostsContext } from "../../data/Context";

const NewBlogPost = () => {

  // CREO LO STATO PER POTERGMI GESTIRE IL POST
  const [post, setPost] = useState({
    title: "",
    category: "cateogria 1",
    readTime: { value: 0, unit: "minuti" },
    author: "",
    content: ""
  });

  //FUNZIONE PER GESTIRE I CAMBAIMANETI DEGLI INPUT NEL FORM E INTEGRARLI NELLO STATO
  function handleChange(e) {

    const { name, value } = e.target;

    if (name === "readTimeValue") {
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else if (name === "title" ){
      setPost({ ...post, title: value.charAt(0).toUpperCase()+value.slice(1) });
    } else if (name === "content" ){
      setPost({ ...post, content: value.charAt(0).toUpperCase()+value.slice(1) });
    } else {
      setPost({ ...post, [name]: value })
    }

  }

  //HOOK PER LA NAIGAZIONE
  const navigate = useNavigate();

  //USO IL CONTEXT
  const { posts, setPosts } = useContext(PostsContext)
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext)
  const { userLogged, setUserLogged } = useContext(LoggedUserDataContext)

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
            
      Object.keys(post).forEach(key => {
        if (key === 'readTime') {
          formData.append('readTime[value]', post.readTime.value);
          formData.append('readTime[unit]', post.readTime.unit);
        } else {
          formData.append(key, post[key]);
        }
      });

      if (coverFile) {
        formData.append('cover', coverFile);
      }
      
      await createPost(formData);
      setPosts([...posts, formData])
      setCurrentPage(1)
      navigate("/");
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
    }
  };

  useEffect(() => {
    setPost({...post, author : userLogged.email})
  },[])

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={(e) => {handleSubmit(e)}}>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Read Time</Form.Label>
          <Form.Control 
            size="lg" 
            placeholder="Read Time" 
            value={post.readTime.value} 
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
            onChange={(e) => setPost({...post, category:e.target.value})} 
            value={post.category}
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
            value={post.title} 
            onChange={handleChange}
            name="title"
          />
        </Form.Group>
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
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Autore</Form.Label>
          <Form.Control 
            size="lg" 
            placeholder="Autore" 
            type="email" 
            value={post.author} 
            readOnly
            name="author"
          />
        </Form.Group>
        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Contenuto Blog</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3} 
            size="lg" 
            name="content"
            value={post.content}
            onChange={handleChange} 
            placeholder="Inserisci il commento"
            required
          />
        </Form.Group>
        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
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
    </Container>
  );
};

export default NewBlogPost;
