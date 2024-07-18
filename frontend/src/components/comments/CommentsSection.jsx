import { useContext, useEffect, useState } from "react";
import { getComments } from "../../data/apiAxios";
import { Button, Container, Spinner } from "react-bootstrap";
import AddNewComment from "./CommentsSection-components/AddNewComment";
import CommentsList from "./CommentsSection-components/Comments-list/CommentsList";
import { CommentsContext } from "../../data/Context";

function CommentsSection({postId}) {

  //SALVO L'ID DEL POST IN UNO STATO
  const [id, setId] = useState(postId)

  //CREO LO STATO PER POTERMI GESTIRE I COMMENTI
  const [comments, setComments] = useState([])

  //CREO UNA STATO PER GESTIRMI I LOADERS QUANDO AVVIENE UNA CHIAMATA API
  const [isCommentsLoading, setIsCommentsLoading] = useState(true)

  //FUNZIONE CHE MI GESTIRA LO SPINNER
  const handleSpinnerTrue = () => {
    setIsCommentsLoading(true)
  };

  //FUNZIONE CHE MI GESTIRA LO SPINNER
  const handleSpinnerFalse = () => {
    setIsCommentsLoading(false)
  };

  //CREO UNA FUNZIONE PER OTTENERE I COMMENTI CON LA FUNZIONE CREATA SU AXIOS
  const getAllComments = async (id) => {
    try {
      setIsCommentsLoading(true)
      const response = await getComments(id);
      setComments(response.data)
      setIsCommentsLoading(false)
    } catch (error) {
      console.error("Errore nella fetch dei commenti:", error)
      alert("Errore nella fetch dei commenti")
    }
  }

  //AL CARICAMENTO DEL COMPONENTE OTTENGO I COMMENTI 
  useEffect(() => {
    getAllComments(id) 
  },[])

  //CREO LO STATO PER POTERMI GESTIRE LA PAGINA ATTUALE DEI COMMENTI
  const [currentCommentPage, setCurrentCommentPage] = useState(1)

  //FUNZIONE PER TORNARE ALLA PAGINA DEI COMMENTI PRECEDENTE
  function handlePreviousPage() {
    setCurrentCommentPage((currentCommentPage) => Math.max(currentCommentPage - 1, 1))
  }

  //FUNZIONE PER TORNARE ALLA PAGINE DEI COMMENTI SEGUENTE
  function handleNextPage() {
    setCurrentCommentPage((currentCommentPage) => Math.min(currentCommentPage + 1, Math.ceil(comments.length / 5)))
  }

  return (
    <>
      <CommentsContext.Provider value = { { comments, setComments } }>
        <Container className="border border-light-subtle rounded-3">

          {/* CREO LA PRIMA RIGA CON IL TITOLO ED IL NUMERO DI COMMENTI TOTALI */}
          <div className="d-flex align-items-center justify-content-between my-2">
            <h2 className="d-flex ">
              Comments       
            </h2>
            {/* MENTRE STA CARICANDO I COMMENTI ESCE LA SCRITTA LOADING POI QUANDO HA FINITO ESCE IL NUMERO DI COMMENTI */}
            {isCommentsLoading ? <span>Loading..</span> : <span>Tot: {comments.length}</span>}
            
          </div>

          {/* INSERISCO LA LISTA CONTENTENTE I COMMENTI QUANDO LA CHIAMATA HA FINITO DI CARICARE*/}
          <CommentsList 
            postId={id} 
            handleSpinnerTrue={handleSpinnerTrue} 
            handleSpinnerFalse={handleSpinnerFalse} 
            isCommentsLoading={isCommentsLoading}
            currentCommentPage={currentCommentPage}
          />

          {/* CREO IL CONTAINER PER POTERMI GESTIE IL MODALE PER FARE UN NUOVO COMMENTO */}
          <AddNewComment 
            id={id} 
            getAllComments={getAllComments}
            handleSpinnerTrue={handleSpinnerTrue} 
            handleSpinnerFalse={handleSpinnerFalse} 
          />

          {/* CONTAINER CONTENTE I BOTTONI PER L'IMPAGINAZIONE DELLA PAGINA */}
          <Container fluid className="d-flex justify-content-center align-items-center my-3">
            <Button 
              variant="outline-dark"
              onClick={handlePreviousPage}
              disabled={currentCommentPage === 1}
              className="fw-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
              </svg>
            </Button>
            <span className="mx-3">
              {comments.length > 0 ? currentCommentPage  : "0"}/{Math.ceil(comments.length / 5)}
            </span>
            <Button 
              variant="outline-dark"
              onClick={handleNextPage}
              disabled={currentCommentPage === Math.ceil(comments.length / 5)}
              className="fw-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
              </svg>
            </Button>
          </Container>

        </Container>
      </CommentsContext.Provider>
    </>
  )
}

export default CommentsSection