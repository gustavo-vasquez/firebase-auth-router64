import { useState } from "react";
import { register } from "../config/firebase";
import { useUserContext } from "../context/UserContext";
import { useRedirectActiveUser } from "../hooks/useRedirectActiveUser";

const Register = () => {
  // creo un formulario controlado
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user } = useUserContext();
  useRedirectActiveUser(user, '/dashboard'); // hook personalizado (hace lo mismo que en el login para redirigir)

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Creé un usuario.");

    try {
      const credentials = await register({ email, password }); // registro un usuario utilizando firebase
      console.log(credentials);
    } catch (error) {
      console.log(error); // hace validaciones como "cantidad de caracteres"
    }
  };

  return (
    <>
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          style={{ display: "block" }}
          placeholder="Ingrese email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          style={{ display: "block" }}
          placeholder="Ingrese contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={{ display: "block" }}>
          Registrar
        </button>
      </form>
    </>
  );
};

export default Register;
