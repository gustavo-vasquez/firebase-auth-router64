import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../config/firebase";
import { useUserContext } from "../context/UserContext";

const Login = () => {
  // creo un formulario controlado
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Hice login");

    try {
        const credentials = await login({ email, password }); // hago login utilizando firebase (si el usuario no figura ahí, tira error)
        console.log(credentials);
    }
    catch(error) {
        console.log(error); // además hace otras validaciones como "contraseña incorrecta"
    }
  };

  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if(user) navigate('/dashboard');
  }, [user]); // cuando el usuario este logueado no tengo que ver el login, por eso me redirecciona a "dashboard"

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          style={{display: 'block'}}
          placeholder="Ingrese email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          style={{display: 'block'}}
          placeholder="Ingrese contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={{ display: "block" }}>
          Login
        </button>
      </form>
    </>
  );
};

export default Login;
