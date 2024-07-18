import { useContext, useEffect } from "react"
import { Button, Form, InputGroup } from "react-bootstrap"
import { HomeLoadingContext, IsSearchingContext, PostsContext, SearchTextContext } from "../../data/Context"
import { searchPost } from "../../data/apiAxios";
import { useNavigate } from "react-router-dom"

function SearchBar() {

  //USO IL CONTEXT
  const { posts, setPosts } = useContext(PostsContext)
  const { searchText, setSearchText } = useContext(SearchTextContext)
  const { isLoading, setIsLoading } = useContext(HomeLoadingContext)
  const { isSearching, setIsSearching } = useContext(IsSearchingContext)

  //CREO LA FUNZIONE PER POTERMI FILTRARE I POST DAL TITOLO TRAMITE LA FUNZIONE CREATA CON AXIOS
  const filterPosts = async (title) => {
    try {
      setIsLoading(true)
      const response = await searchPost(title);
      setPosts(response.data.blogPosts)
      navigate('/');
      setIsSearching(true)
      setIsLoading(false)
    } catch (error) {
      console.error("Errore nella fetch dei post:", error)
      alert("Errore nella fetch dei post:")
    }
  }
  
  //HOOK PER LA NAVIGAZIONE
  const navigate = useNavigate();

  //AL SUBMIT DELLA BARRA DI RICERCA RICHIAMO LA FUNZIONE QUI SOPRA
  function handleSubmit(e) {
    e.preventDefault();
    filterPosts(searchText)
  }

  return (
    <>
      <Form className="d-flex w-100" onSubmit={(e) => {handleSubmit(e)}}>
        <Form.Control
          placeholder="Cerca un articolo "
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}          
        />
        <Button variant="outline-dark" id="button-addon2" type="submit">
          Cerca
        </Button>
      </Form>
    </>
    
  )
}

export default SearchBar