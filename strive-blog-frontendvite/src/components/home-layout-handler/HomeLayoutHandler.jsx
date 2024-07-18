import { useContext } from "react"
import { Button, Container } from "react-bootstrap"
import { CurrentPageContext } from "../../data/Context"

function HomeLayoutHandler( { totalPages } ) {

  //USO IL CONTEXT
  const { currentPage, setCurrentPage } = useContext(CurrentPageContext)

  return(
    <Container fluid className="d-flex justify-content-center align-items-center">
      <Button 
        variant="outline-dark"
        onClick={() => setCurrentPage((currentPage) => Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
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
  )
}

export default HomeLayoutHandler