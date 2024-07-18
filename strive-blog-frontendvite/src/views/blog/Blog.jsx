import React, { useContext, useEffect, useState } from "react";
import { Container, Image, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import "./styles.css";
import { LoggedUserDataContext, PostsContext } from "../../data/Context";
import CommentsSection from "../../components/comments/CommentsSection";
import ModifyPostbutton from "../../components/blog/blog-modifybutton/ModifyPostButton";
import DeletePostButton from "../../components/blog/blog-deletebutton/DeletePostButton";
import ModifyPostImageButton from "../../components/blog/blog-modifybutton/ModifyPostImageButton";
import { getSinglePost } from "../../data/apiAxios";

function Blog() {
  const [blog, setBlog] = useState({});

  //CREO UNO STATO PER GESTIRE LO SPINNER NEL FRATTEMPO CHE LA PAGINA SI DEVE CARICARE
  const [loading, setLoading] = useState(true);

  //CREO L'HOOK PER IL PARAMETRO ID
  const params = useParams();

  //OTTENGO L'ID DEL POST
  const { id } = params;

  //HOOK PER LA NAVIGAZIONE
  const navigate = useNavigate();

  //USO IL CONTEXT
  const { userLogged, setUserLogged } = useContext(LoggedUserDataContext)

  //FUNZIONE PER OTTENERE I DATI DEL SINGOLO POST
  const getPost = async (postID) => {
    try {
      setLoading(true)
      const response = await getSinglePost(postID);
      setBlog(response.data)
      console.log(response.data);
      setLoading(false)
    } catch (error) {
      console.error("Errore nella fetch dei dati del singolo post:", error)
      navigate("/404");
    }
  }

  //AL CARICAMENTO DEL COMPONENTE OTTENGO LE INFORMAZIONI DEL POST TRAMITE LA FUNZIONE QUI SOPRA
  useEffect(() => {

    getPost(id)

  }, []);

  // CREO UNO STATO PER PER POTERMI GESITRE l'APPARIRE O NO DEL BOTTONE DI MODIIFICA DELL'AVATAR ALL'HOVER SULL'IMMAGINE
  const [ isModifyAvatar,  setIsModifyAvatar] = useState(false)

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{minHeight: "50vh"}}>
        <Spinner animation="border" style={{width: "3rem", height: "3rem"}}/>
        <span className="fs-1">Caricamento..</span>
      </Container>
    )
  } else {
    return (
      <div className="blog-details-root">
        <Container className="">
          <Container 
            className="position-relative prova p-0"
            onMouseOver={() => setIsModifyAvatar(true)}
            onMouseOut={() => setIsModifyAvatar(false)}>

            <Image className="blog-details-cover" src={blog.cover} fluid />            
            {userLogged.email == blog.author && isModifyAvatar && <ModifyPostImageButton postId={blog._id}/>}
            <div className="position-absolute bottom-0 end-0 bg-dark p-2">
              {userLogged.email == blog.author && isModifyAvatar && <ModifyPostbutton id={blog._id}/>}
              {userLogged.email == blog.author && isModifyAvatar && <DeletePostButton id={blog._id} />}
            </div>
          </Container>

          <h1 className="blog-details-title">{blog.title}</h1>   

          <div className="blog-details-container">

            <div className="blog-details-author">             
              <BlogAuthor author={blog.author}/>
            </div>

            <div className="blog-details-info">
              <div>{`lettura da ${blog.readTime.value} ${blog.readTime.unit}`}</div>
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <BlogLike defaultLikes={["123"]} onChange={console.log} />
              </div>
            </div>
          </div>

          <div className="fs-5 my-5">
            {blog.content}
          </div>

          <div>
            
            <CommentsSection postId={blog._id}/>
          </div>
        </Container>
      </div>
    );
  }
};

export default Blog;
