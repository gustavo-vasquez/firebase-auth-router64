import { register } from "../config/firebase";
import { useUserContext } from "../context/UserContext";
import { useRedirectActiveUser } from "../hooks/useRedirectActiveUser";

import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from 'yup';

const Register = () => {
  const { user } = useUserContext();
  useRedirectActiveUser(user, "/dashboard"); // hook personalizado (hace lo mismo que en el login para redirigir)

  const onSubmit = async ({ email, password }, {setSubmitting, setErrors, resetForm}) => {
    console.log("Creé un usuario.");

    try {
      const credentials = await register({ email, password }); // registro un usuario utilizando firebase
      console.log(credentials);
      resetForm();
    } catch (error) {
      console.log(error.code, error.message); // hace validaciones como "cantidad de caracteres"
      if(error.code === 'auth/email-already-in-use')
        setErrors({email: "Este correo ya está en uso"});
    }
    finally {
      setSubmitting(false);
    }
  };

  const validationSchema = () => Yup.object().shape({
    email: Yup.string().email("Correo NO válido").required("Correo obligatorio"),
    password: Yup.string().trim().min(6, "Mínimo 6 caracteres").required("Contraseña obligatoria")
  });

  return (
    <Box sx={{ mt: 8, maxWidth: "400px", mx: "auto", textAlign: "center" }}>
      <Avatar sx={{ mx: "auto", bgcolor: "#111" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h5" variant="h2" sx={{ mb: 3 }}>
        Registro
      </Typography>
      <Formik initialValues={{email: "", password: ""}} onSubmit={onSubmit} validationSchema={validationSchema}>
        {({values, handleSubmit, handleChange, handleBlur, isSubmitting, errors, touched}) => (
          <Box component="form" onSubmit={handleSubmit}>
          <TextField
            type="text"
            placeholder="correo@ejemplo.com"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            id="email"
            label="Ingrese email"
            fullWidth
            sx={{ mb: 3 }}
            error={errors.email && touched.email}
            helperText={errors.email && touched.email && errors.email}
          />
          <TextField
            type="password"
            placeholder="Ingrese contraseña"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            id="password"
            label="Ingrese contraseña"
            fullWidth
            sx={{ mb: 3 }}
            error={errors.password && touched.password}
            helperText={errors.password && touched.password && errors.password}
          />
          <LoadingButton
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            variant="contained"
            fullWidth
            sx={{ mb: 3 }}
          >
            Registrar
          </LoadingButton>
          <Button component={Link} to="/" fullWidth sx={{ mb: 3 }}>
            ¿Ya tienes cuenta? Ingresa
          </Button>
          </Box>
        )}
      </Formik>
    </Box>
  );
};

export default Register;
