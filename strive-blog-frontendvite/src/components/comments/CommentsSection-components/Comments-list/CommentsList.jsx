import { Container, ListGroup, Spinner } from "react-bootstrap"
import ModifyComment from "./comments-list-components/ModifyComment"
import RemoveComment from "./comments-list-components/RemoveComment"
import { useContext, useEffect } from "react"
import { CommentsContext, LoggedUserDataContext } from "../../../../data/Context"

function CommentsList( { postId, handleSpinnerTrue, handleSpinnerFalse, isCommentsLoading, currentCommentPage } ) {

  //USO IL CONTEXT
  const { comments, setComments } = useContext(CommentsContext)
  const { userLogged, setUserLogged } = useContext(LoggedUserDataContext)//USO QUESTO CONTEXT IN MODO TALE DA FAR MODIFICARE/ELIMANRE IL COMMENTO SOLO DALL'AUTORE DI ESSO

  if (isCommentsLoading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{minHeight: "50vh"}}>
        <Spinner animation="border" style={{width: "3rem", height: "3rem"}}/>
        <span className="fs-1">Caricamento..</span>
      </Container>
    )
  } else {
    return (
      <ListGroup key={postId}>
        {comments.slice((currentCommentPage-1)*5,currentCommentPage*5).map(comment => {
          return (
            <ListGroup.Item 
              className="d-flex justify-content-between align-items-center"
              key={comment._id}>
              <div>
                <h4>{comment.name}</h4>
                <p>{comment.content}</p>
              </div>
              <div>
              
              {comment.email == userLogged.email && 
                <ModifyComment 
                  postId={postId} 
                  id={comment._id} 
                  content={comment.content} 
                  handleSpinnerTrue={handleSpinnerTrue} 
                  handleSpinnerFalse={handleSpinnerFalse}
                />}
              
              {comment.email == userLogged.email && 
              <RemoveComment
                postId={postId} 
                id={comment._id} 
                handleSpinnerTrue={handleSpinnerTrue} 
                handleSpinnerFalse={handleSpinnerFalse} 
               />}            
  
              </div>
            </ListGroup.Item>
          )
        })}
      </ListGroup>
    )
  }
  
}

export default CommentsList