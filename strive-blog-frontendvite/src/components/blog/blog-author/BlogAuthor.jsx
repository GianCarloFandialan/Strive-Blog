import React, { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import "./styles.css";
import { getAuthors } from "../../../data/apiAxios";
import { useNavigate } from "react-router-dom";

const BlogAuthor = props => {
  const { author } = props;

  //HOOK PER LA NAIGAZIONE
  const navigate = useNavigate();

  //CREO UNO STATO PER POTERMI GESTIRE L'AVATAR DELL'AUTORE
  const [ avatar, setAvatar ] = useState()

  //CREO UNO STATO PER POTERMI GESTIRE L'ID DELL'AUTORE
  const [ authorID, setAuthorID]= useState()

  //CREO LA FUNZIONE PER OTTENERE I DATI DEL SINGOLO AUTORE
  const getAuthor = async () => {
    try {
      const response = await getAuthors();
      setAvatar(response.data.filter((autore) => autore.email == author)[0].avatar);
      setAuthorID(response.data.filter((autore) => autore.email == author)[0]._id);
    } catch (error) {
      console.error("Errore nella fetch dei dati del singol autore:", error)
    }
  }

  useEffect(() => {
    getAuthor()
  },[])

  function handleAuthorClick() {
    navigate(`/author/${authorID}`)
  }

  return (
    <Row className="flex-nowrap">
      <Col xs={"auto"} className="pe-0">
        {avatar ? 
          <Image className="blog-author" src={avatar} roundedCircle />
          :
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
          </svg>
        }
      </Col>
      <Col className="d-flex align-items-center overflow-hidden ">
        <h6 className="mb-0 text-success fw-bold ellipsis" onClick={handleAuthorClick} style={{cursor:'pointer'}}>{author}</h6>
      </Col>
    </Row>
  );
};

export default BlogAuthor;
