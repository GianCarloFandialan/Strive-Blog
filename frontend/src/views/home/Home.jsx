import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";
import { getPostsHomepage } from "../../data/apiAxios"
import { CurrentPageContext, HomeLoadingContext, IsSearchingContext, LoggedInContext, PostsContext, SearchTextContext } from "../../data/Context";
import { Link, useNavigate } from "react-router-dom";
import HomeLayoutHandler from "../../components/home-layout-handler/HomeLayoutHandler";

const Home = () => {

  //STATO CHE MI GESTIRA IL TOTALE DELLE PAGINE
  const [totalPages, setTotalPages] = useState(1); 
  //STATO PER GESTIRMI IL LIMITE DI POST IN UNA PAGINA
  const [limit, setLimit] = useState(6); 

  //USO IL CONTEXT
  const { posts, setPosts } = useContext(PostsContext)
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext)
  const { searchText, setSearchText } = useContext(SearchTextContext)
  const { isLoggedIn, setIsLoggedIn } = useContext(LoggedInContext)
  const { isLoading, setIsLoading } = useContext(HomeLoadingContext)
  const { isSearching, setIsSearching } = useContext(IsSearchingContext)

  //NEL CASO CAMBI LA PAGINA, SI CERCHI QUALCOSA OPPURE SI CAMBI IL LIMITE DI POST NELLA PAGINA ESEGUO UNA CHIAMTA CHE MI RICARICA I POST NEL MODO CORRETTO NELLA PAGINA
  useEffect(() => {
    if (isLoggedIn) {
      if (searchText.length < 1) {
        getPosts(currentPage, limit);  
      }
    } else {
      navigate("/login")
    }
  },[currentPage, limit, searchText])

  //CREO LA FUNZIONE PER OTTENERE I POST 
  const getPosts = async (currentPage, limit) => {
    try {
      setIsLoading(true)
      const response = await getPostsHomepage(currentPage, limit);
      setPosts(response.data.blogPosts)
      setTotalPages(response.data.totalPages)
      setIsLoading(false)
    } catch (error) {
      console.error("Errore nella fetch dei post:", error)
      alert("Errore nella fetch dei post:")
    }
  }

  //HOOK PER LA NAVIGAZIONE
  const navigate = useNavigate();

  return (
    <Container fluid="sm">
      {/* SE SI STA EFETTUANDO UNA RICERCA FACCIO USCIRE LA SCRITTA PER LA RICERCA ALTRIMENTO METTO IL TITOLO */}
      {isSearching ?
      <span className="blog-main-title my-2 text-black d-block">Risultati ricerca:</span>
      :
      <h1 className="blog-main-title my-2">Benvenuto sullo Strive Blog!</h1>
      }

      {/*SE SI STA EFFETTUANDO UNA RICERCA MOSTRO QUANTI RISULTATI HO OTENUTO DA ESSA ALTIMENTO ESCE IL FORM PER GESTIRMI IL LIMITE DI POST DELLA PAGINA */}
      {isSearching ?
        <span className="fs-4 mb-5">Totali: {posts.length}</span>
        :
        <Form.Select 
          size="lg" 
          className="w-25 mb-3"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={6}>6 per pagina</option>
          <option value={9}>9 per pagina</option>
          <option value={12}>12 per pagina</option>
        </Form.Select>
      }

      {/* BOTTONE CHE MI PORTA ALLA PAGINA PER CREARE UN NUOVO ARTICOLO CHE APPARARE SOLO SE SONO NELLA HOMEPAGE*/}
      {!isSearching && 
        <Container fluid className="mb-3">
          <Button as={Link} to="/new" className="blog-navbar-add-button bg-dark w-100 d-flex align-items-center justify-content-center" size="lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus-lg me-2"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
              </svg>
              Nuovo Articolo
          </Button>
        </Container>
      }

      {/* LISTA DEI POST CHE VIENE CARICATA SOLO QUANDO LA CHIAMATA HA TERMINATO */}
      {isLoading ? 
        <Container fluid className="d-flex justify-content-center align-items-center" style={{minHeight: "50vh"}}>
          <Spinner animation="border" style={{width: "3rem", height: "3rem"}}/>
          <span className="fs-1">Caricamento..</span>
        </Container>
        :
        <BlogList isLoading={isLoading}/>
      }

      {/* COMPONENTE CHE MI GESTIE L'IMPAGINAZIONE CHE COMPARE SOLO QUANDO SONO NELLA HOMEPAGE E NON NELLA PAGINA DI RICERCA */}
      {searchText.length < 1 && 
        <HomeLayoutHandler totalPages={totalPages} />
      }
      

    </Container>
  );
};

export default Home;
