import React, { useContext, useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  Grid,
  Image,
  Comment,
  Header,
  Form,
  Button,
  Divider,
  Dimmer,
  Loader,
} from "semantic-ui-react";

import moment from "moment";

import { FETCH_POST_QUERY } from "../util/graphql";
import { CREATE_COMMENT_MUTATION } from "../util/graphql";
import LikeButton from "../components/LikeButton";
import CommentButton from "../components/CommentButton";
import DeleteButton from "../components/DeleteButton";
import { AuthContext } from "../context/auth";

const SinglePost = (props) => {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);

  const [commentBody, setCommentBody] = useState("");
  const commentInputRef = useRef(null);

  const { loading, error, data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId: postId },
  });

  const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
    variables: { postId, body: commentBody },
    update() {
      setCommentBody("");
      commentInputRef.current.blur();
    },
  });

  const deleteButtonCallBack = () => {
    props.history.push("/");
  };

  let postMarkup;

  if (loading) {
    postMarkup = (
      <Dimmer active inverted>
        <Loader size="big">Cargando...</Loader>
      </Dimmer>
    );
  } else if (error) {
    postMarkup = <h2>Error...</h2>;
  } else {
    const {
      getPost: {
        id,
        username,
        body,
        createdAt,
        commentCount,
        likeCount,
        likes,
        comments,
      },
    } = data;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              floated="right"
              size="big"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              circular
            />
          </Grid.Column>
          <Grid.Column width={12}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <LikeButton post={{ id, likeCount, likes }} />
                <CommentButton post={{ id, commentCount, comments }} />
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deleteButtonCallBack} />
                )}
              </Card.Content>
            </Card>

            <Comment.Group style={{ maxWidth: "none" }}>
              <Header as="h3" dividing>
                Comentarios
              </Header>
              {user && (
                <Form onSubmit={submitComment}>
                  <div className="ui action input fluid">
                    <input
                      type="text"
                      placeholder="Añade un comentario..."
                      value={commentBody}
                      onChange={(e) => {
                        setCommentBody(e.target.value);
                      }}
                      ref={commentInputRef}
                    />
                    <Button
                      type="submit"
                      content="Añadir Comentario"
                      labelPosition="left"
                      icon="edit"
                      primary
                      color="teal"
                      disabled={commentBody === ""}
                    />
                  </div>
                </Form>
              )}

              {comments.map((comment) => (
                <Comment key={comment.id}>
                  <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
                  <Comment.Content>
                    {user && user.username === comment.username && (
                      <DeleteButton postId={id} commentId={comment.id} />
                    )}
                    <Comment.Author as="a">{comment.username}</Comment.Author>
                    <Comment.Metadata>
                      <div>{moment(createdAt).fromNow()}</div>
                    </Comment.Metadata>
                    <Comment.Text>{comment.body}</Comment.Text>
                  </Comment.Content>
                  <Divider />
                </Comment>
              ))}
            </Comment.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
};

export default SinglePost;
