import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";
import { PostsContext } from "../../../data/Context";

function BlogList() {

  const { posts, setPosts } = useContext(PostsContext)

  //CREO UNO STATO PER GESTIRMI I POST DELLA PAGINA OGNI VOLTA CHE AVVIENE UN CAMBIAMENTO AL CONTEXT DEI POST
  const [ postsList, setPostslist] = useState(posts)

  useEffect(() => {
    setPostslist(posts)
  },[posts])

  if (postsList.length > 0) {
    return (
      <Row>
        {postsList.map((post, i) => (
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
          NO RESULTS FOUND
        </p>
      </>
    )
  }
  
};

export default BlogList;
