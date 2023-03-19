import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../config/firebase";
import { useUserContext } from "../context/UserContext";
import { Formik } from "formik";
import * as Yup from 'yup';

const Login = () => {
  const onSubmit = async ({ email, password }, {setSubmitting, setErrors, resetForm}) => {
    console.log("Hice login");

    try {
      const credentials = await login({ email, password }); // hago login utilizando firebase (si el usuario no figura ahí, tira error)
      console.log(credentials);
      resetForm();
    } catch (error) {
      console.log(error.code, error.message); // además hace otras validaciones como "contraseña incorrecta"

      if(error.code === 'auth/user-not-found')
        return setErrors({email: "Usuario NO registrado"});
      if(error.code === 'auth/wrong-password')
        return setErrors({password: "Contraseña incorrecta"});
    }
    finally {
      setSubmitting(false); // cuando está enviando el formulario se pone en true
    }
  };

  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user]); // cuando el usuario este logueado no tengo que ver el login, por eso me redirecciona a "dashboard"

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Correo NO válido").required("Correo obligatorio"),
    password: Yup.string().trim().min(6, "Mínimo 6 caracteres").required("Contraseña obligatoria")
  })

  return (
    <>
      <h1>Login</h1>
      <Formik initialValues={{ email: "", password: "" }} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ values, handleSubmit, handleChange, errors, touched, handleBlur, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="email"
              placeholder="Ingrese email..."
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && errors.email}
            <input
              type="password"
              name="password"
              placeholder="Ingrese contraseña..."
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && touched.password && errors.password}
            <button type="submit" disabled={isSubmitting}>Login</button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Login;
