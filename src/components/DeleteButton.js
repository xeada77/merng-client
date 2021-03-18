import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button, Icon, Confirm } from "semantic-ui-react";

import MyPopup from "../util/MyPopup";
import { DELETE_POST_MUTATION } from "../util/graphql";
import { DELETE_COMMENT_MUTATION } from "../util/graphql";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const DeleteButton = (props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = props.commentId
    ? DELETE_COMMENT_MUTATION
    : DELETE_POST_MUTATION;

  const [mutationOrdeletePost] = useMutation(mutation, {
    variables: { postId: props.postId, commentId: props.commentId },
    //refetchQueries: [{ query: FETCH_POSTS_QUERY }],
    update(cache) {
      setConfirmOpen(false);
      if (!props.commentId) {
        const data = cache.readQuery({ query: FETCH_POSTS_QUERY });
        if (data) {
          const newCache = data.getPosts.filter((p) => p.id !== props.postId);
          cache.writeQuery({
            query: FETCH_POSTS_QUERY,
            data: { getPosts: newCache },
          });
        }
      }
      if (props.callback) {
        props.callback();
      }
    },
  });

  return (
    <>
      <MyPopup
        content={props.commentId ? "Eliminar Comentario" : "Eliminar Post"}
      >
        <Button
          as="div"
          onClick={() => setConfirmOpen(true)}
          color="red"
          style={{ float: "right" }}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>

      <Confirm
        open={confirmOpen}
        content={
          props.commentId
            ? "¿Estás seguro que quieres eliminar este comentario?"
            : "¿Estás seguro que quieres eliminar este Post?"
        }
        confirmButton="Si, hazlo!"
        cancelButton="De ninguna manera"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={mutationOrdeletePost}
      />
    </>
  );
};

export default DeleteButton;
