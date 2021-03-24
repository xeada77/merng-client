import React, { useContext, useState } from "react";
import { useMutation, gql } from "@apollo/client";

import { Form, Button, Container, Header } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

const Register = (props) => {
  const context = useContext(AuthContext);

  const [errors, setErrors] = useState({});

  const initialState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  };

  const options = [
    {
      name: "avatar",
      key: "av1",
      text: "Avatar1",
      value: "https://react.semantic-ui.com/images/avatar/large/molly.png",
      image: {
        avatar: true,
        src: "https://react.semantic-ui.com/images/avatar/small/molly.png",
      },
    },
    {
      name: "avatar",
      key: "av2",
      text: "Avatar2",
      value: "https://react.semantic-ui.com/images/avatar/large/matthew.png",
      image: {
        avatar: true,
        src: "https://react.semantic-ui.com/images/avatar/small/matthew.png",
      },
    },
    {
      name: "avatar",
      key: "av3",
      text: "Avatar3",
      value: "https://react.semantic-ui.com/images/avatar/large/elliot.jpg",
      image: {
        avatar: true,
        src: "https://react.semantic-ui.com/images/avatar/small/elliot.jpg",
      },
    },
    {
      name: "avatar",
      key: "av4",
      text: "Avatar4",
      value: "https://react.semantic-ui.com/images/avatar/large/jenny.jpg",
      image: {
        avatar: true,
        src: "https://react.semantic-ui.com/images/avatar/small/jenny.jpg",
      },
    },
    {
      name: "avatar",
      key: "av5",
      text: "Avatar5",
      value: "https://react.semantic-ui.com/images/avatar/large/steve.jpg",
      image: {
        avatar: true,
        src: "https://react.semantic-ui.com/images/avatar/small/steve.jpg",
      },
    },
  ];

  const { onSubmit, onChange, values } = useForm(register, initialState);

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, { data: { register: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function register() {
    addUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <Container textAlign="center">
          <Header size="huge">Register</Header>
        </Container>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Email"
          placeholder="Email.."
          name="email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Confirm Password"
          placeholder="Retype the password..."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        />
        {/* <Form.Select
          label="Avatar"
          //options={options}
          name="avatar"
          placeholder="Escoge un avatar."
          value={values.avatar}
          onChange={onChange}
        >
          <>
            {options.map((option) => (
              <option value={option.value}>{option.text}</option>
            ))}
          </>
        </Form.Select> */}
        <Form.Select
          label="Avatar"
          placeholder="Selecciona un avatar"
          fluid
          selection
          options={options}
          onChange={onChange}
          name="avatar"
          value={values.avatar}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $avatar: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        avatar: $avatar
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
