import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import {
  Grid,
  Transition,
  Container,
  Header,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  const [recentPosts, setRecentPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    if (data && data.getPosts) {
      if (user) {
        setRecentPosts(
          data.getPosts.filter((post) => post.username !== user.username)
        );
        setMyPosts(
          data.getPosts
            .filter((post) => post.username === user.username)
            .slice(0, 5)
        );
      } else {
        setMyPosts([]);
        setRecentPosts(data.getPosts);
      }
    }
  }, [data, user]);

  if (loading)
    return (
      <Dimmer active inverted>
        <Loader size="big">Cargando...</Loader>
      </Dimmer>
    );

  return (
    <Grid columns={3} stackable={true}>
      {user && (
        <>
          <Grid.Row>
            <Container textAlign="center" className="encabezado">
              <Header size="huge" dividing color="teal">
                Mis Posts
              </Header>
            </Container>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <PostForm />
            </Grid.Column>

            <Transition.Group>
              {myPosts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
            </Transition.Group>
          </Grid.Row>
        </>
      )}

      <Grid.Row>
        <Container textAlign="center" className="encabezado">
          <Header size="huge" dividing color="teal">
            Post Recientes
          </Header>
        </Container>
      </Grid.Row>
      <Grid.Row>
        <Transition.Group>
          {recentPosts.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))}
        </Transition.Group>
      </Grid.Row>
    </Grid>
  );
}

export default Home;
