import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import BlogAuthor from "../blog-author/BlogAuthor";
import "./styles.css";
const BlogItem = (props) => {
  const { title, cover, author, _id } = props;
  return (

      <Card className="blog-card">
        <Link to={`/blog/${_id}`} className="blog-link">
          <Card.Img variant="top" src={cover} className="blog-cover" />
          <Card.Body>
            <Card.Title className="truncate-title">{title}</Card.Title>
          </Card.Body>
        </Link>
        <Card.Footer>
          <BlogAuthor author={author} />
        </Card.Footer>
      </Card>

  );
};

export default BlogItem;
