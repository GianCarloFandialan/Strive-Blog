import { Col, Row } from "react-bootstrap";
import BlogItem from "../blog/blog-item/BlogItem";
import { getAuthorPosts } from "../../data/apiAxios";
import { useEffect, useState } from "react";

function AuthorPosts( { authorID, handleTotalPages, handleTotalPosts, handleCurrentPage, limit, currentPage } ) {

  //CREO UNO STATO IN CUI GESTIRMI I POST DELLA PAGINA
  const [posts, setPosts] = useState([])

  //CREO UNA FUNZIONE PER OTTENERE TUTTI I POST DI QUEL PRECISO AUTORE
  const getAllComments = async (id, currentPage, limit) => {
    try {
      const response = await getAuthorPosts(id, currentPage, limit);
      handleTotalPages(response.data.totalPages)
      handleTotalPosts(response.data.totalPosts)
      if (response.data.totalPages == 0) {
        handleCurrentPage(0)
      }
      setPosts(response.data.blogPosts)
    } catch (error) {
      console.error("Errore nella fetch dei post del singolo autore:", error)
    }
  }

  useEffect(() => {
    getAllComments(authorID, currentPage, limit)
  }, [currentPage, limit])

  if (posts.length > 0) {
    return (
      <Row>
        {posts.map((post, i) => (
          <Col
            key={`item-${i}`}
            md={4}
            style={{
              marginBottom: 50,
            }}
          >
            <BlogItem key={post.title} {...post} />
          </Col>
        ))}
      </Row>
    );
  } else {
    return (
      <>
        <p className="fs-1 text-center my-5">
          Ancora nessun post
        </p>
      </>
    )
  }
}

export default AuthorPosts