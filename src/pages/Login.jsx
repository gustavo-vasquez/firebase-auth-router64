import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../config/firebase";
import { useUserContext } from "../context/UserContext";
import { Formik } from "formik";
import * as Yup from 'yup';
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LoadingButton } from "@mui/lab";

const Login = () => {
  const onSubmit = async ({ email, password }, {setSubmitting, setErrors, resetForm}) => {
    console.log("Hice login");

    try {
      const credentials = await login({ email, password }); // hago login utilizando firebase (si el usuario no figura ahí, tira error)
      console.log(credentials);
      resetForm(); // una vez que se completa el envío, limpio todo el form
    } catch (error) {
      console.log(error.code, error.message); // además hace otras validaciones como "contraseña incorrecta"

      // aprovecho que firebase gestiona errores para editar los mensajes de error
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

  const validationSchema = Yup.object().shape({ // acá van todos los campos que necesiten validación
    email: Yup.string().email("Correo NO válido").required("Correo obligatorio"),
    password: Yup.string().trim().min(6, "Mínimo 6 caracteres").required("Contraseña obligatoria")
  });

  return (// en typography component es el elemento html y variant es el estilo visual (login es un h5 con apariencia de h2)
    <Box sx={{mt: 8, maxWidth: "400px", mx: "auto", textAlign: "center"}}>
      <Avatar sx={{mx: "auto", bgcolor: "#111"}}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography variant="h2" component="h5" sx={{mb: 3}}>Login</Typography>
      <Formik initialValues={{ email: "", password: "" }} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({ values, handleSubmit, handleChange, errors, touched, handleBlur, isSubmitting }) => (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              type="text"
              name="email"
              placeholder="correo@ejemplo.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              id="email"
              label="Ingrese email"
              fullWidth
              sx={{mb: 3}}
              error={errors.email && touched.email}
              helperText={errors.email && touched.email && errors.email}
            />
            {errors.email && touched.email && errors.email}
            <TextField
              type="password"
              name="password"
              placeholder="Ingrese contraseña..."
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              id="password"
              label="Ingrese contraseña"
              fullWidth
              sx={{mb: 3}}
              error={errors.password && touched.password}
              helperText={errors.password && touched.password && errors.password}
            />
            {errors.password && touched.password && errors.password}
            <LoadingButton type="submit" disabled={isSubmitting} loading={isSubmitting} variant="contained" fullWidth sx={{mb: 3}}>Login</LoadingButton>
            <Button component={Link} to="/register" fullWidth>¿No tienes cuenta? Regístrate</Button>
          </Box>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
