import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Label, Icon } from "semantic-ui-react";
import { useMutation } from "@apollo/client";

import MyPopup from "../util/MyPopup";
import { AuthContext } from "../context/auth";
import { LIKE_POST_MUTATION } from "../util/graphql";

const LikeButton = ({ post: { likeCount, likes, id } }) => {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const likedButton = user ? (
    liked ? (
      <Button basic color="teal" onClick={likePost}>
        <Icon name="heart" />
      </Button>
    ) : (
      <Button basic color="teal" onClick={likePost}>
        <Icon name="heart outline" />
      </Button>
    )
  ) : (
    <Button basic color="teal" as={Link} to="/login">
      <Icon name="heart outline" />
    </Button>
  );

  return (
    <Button as="div" labelPosition="right">
      <MyPopup content={liked ? "Quitar Like" : "Dar Like"}>
        {likedButton}
      </MyPopup>

      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
};

export default LikeButton;
