import { useContext, useEffect, useState } from "react"
import { Button, Container, Form, Image, Spinner } from "react-bootstrap"
import { LoggedInContext } from "../../data/Context"
import "./styles.css";
import AuthorPosts from "../../components/author/AuthorPosts";
import { useParams } from "react-router-dom";
import { getSingleAuthor } from "../../data/apiAxios";


function Author() {

  //CREO L'HOOK PER IL PARAMETRO ID
  const params = useParams();

  //CREO UNO STATO PER POTERMI GESTIRE I DATI DEL SINGOLO AUTORE
  const [author, setAuthor] = useState({})

  //CREO UNO STATO PER GESTIRE LA PAGINA NEL FRATTEMPO CHE SI STA FACENDO LA CHIAMATA
  const [isLoading, setIsLoading] = useState(true)

  //OTTENGO L'ID DELL'AUTORE
  const { id } = params;

  //FUNZIONE PER OTTENERE I DATI DEL SINGOLO AUTORE
  const getAuthor = async (id) => {
    try {
      setIsLoading(true)
      const response = await getSingleAuthor(id);
      setAuthor(response.data)
      console.log(response.data);
      setIsLoading(false)
    } catch (error) {
      console.error("Errore nella fetch dei dati del singolo autore:", error)
      alert("Errore nella fetch dei dati del singolo autore")
    }
  }

  //USO L'EFFECT AL CARICAMENTO DELLA PAGINA
  useEffect(() => {
    getAuthor(id)

  },[id])

  //USO IL CONTEXT
  const { isLoggedIn, setIsLoggedIn } = useContext(LoggedInContext)

  // CREO GLI STATI PER GESTIRMI LA PAGINAZIONE
  const [totalPages, setTotalPages] = useState(1); 
  const [limit, setLimit] = useState(3); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPosts, setTotalPosts] = useState(1)

  //FUNZIONE PER GESSTIRE TOTALPAGES
  const handleTotalPages = (a) => {
    setTotalPages(a)
  }

  //FUNZIONE PER GESSTIRE TOTALPAGES
  const handleLimit = (a) => {
    setLimit(a)
  }

  //FUNZIONE PER GESSTIRE TOTALPAGES
  const handleCurrentPage = (a) => {
    setCurrentPage(a)
  }
  
  //FUNZIONE PER GESSTIRE TOTALPAGES
  const handleTotalPosts = (a) => {
    setTotalPosts(a)
  }

  if (isLoading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{minHeight: "50vh"}}>
        <Spinner animation="border" style={{width: "3rem", height: "3rem"}}/>
        <span className="fs-1">Caricamento..</span>
      </Container>
    )
  } else {
    return (
      <div className="blog-details-root">
        <Container>
          <Container fluid className="d-flex justify-content-center py-5 align-items-center fw-bold fs-1">
            {author.nome + ' ' } 
            {author.avatar ? 
                <Image className="author-avatar mx-2" src={author.avatar} />              
            :             
              <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
              </svg>
            }
            {author.cognome}  
          </Container>
  
          <Container className="border-top border-1 border-black">
            <Container className="d-flex justify-content-between align-items-center mt-3">
              <h2>Post dell'utente:</h2>
              <span>Totali: {totalPosts}</span>
            </Container>
  
            <Form.Select 
              size="lg" 
              className="w-25 mb-3"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value={3}>3 per pagina</option>
              <option value={6}>6 per pagina</option>
            </Form.Select>
            <AuthorPosts 
              authorID={author._id} 
              handleTotalPages={handleTotalPages}
              handleTotalPosts={handleTotalPosts}
              handleCurrentPage={handleCurrentPage}
              limit={limit}
              currentPage={currentPage}          
            />
            <Container fluid className="d-flex justify-content-center align-items-center">
              <Button 
                variant="outline-dark"
                onClick={() => setCurrentPage((currentPage) => Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1 || currentPage === 0}
                className="fw-bold"
              >
                Precedente
              </Button>
              <span className="mx-3">
                {currentPage}/{totalPages}
              </span>
              <Button 
                variant="outline-dark"
                onClick={() => setCurrentPage((currentPage) => Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="fw-bold"
              >
                Prossimo
              </Button>
            </Container>
          </Container>
        </Container>
      </div>
    )
  }
}

export default Author