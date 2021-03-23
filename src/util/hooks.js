import { useState } from "react";

export const useForm = (callback, initialState) => {
  const [values, setValues] = useState(initialState);

  const onSubmit = (event) => {
    event.preventDefault();
    callback();
  };

  const onChange = (event, { name, value }) => {
    setValues({ ...values, [name]: value });
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};
