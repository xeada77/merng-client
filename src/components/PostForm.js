import React from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
  const { onChange, onSubmit, values } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(cache, result) {
      const data = cache.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      const newData = [result.data.createPost, ...data.getPosts];
      cache.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: newData },
      });
      values.body = "";
    },
  });

  async function createPostCallback() {
    try {
      await createPost();
    } catch (err) {
      return;
    }
  }
  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Crea un Post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi world!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      commentCount
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        id
        username
        createdAt
      }
    }
  }
`;

export default PostForm;
