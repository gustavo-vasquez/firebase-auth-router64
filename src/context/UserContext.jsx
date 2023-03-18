import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

// pertenece a la configuración de firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(false);

  useEffect(() => {
    console.log("actualizado");
    const unsuscribe = onAuthStateChanged(auth, (user) => {
      console.log(user); // si existe un usuario lo devuelve
      setUser(user);
    });

    return unsuscribe; // es necesario limpiar el evento (para evitar tener + de un evento en memoria haciendo lo mismo)
  }, []);

  // como 'user' puede tener 3 estados (false, objeto y null), utilizo el false cuando carga la página como indicador de carga
  if (user === false) return <div>Cargando aplicación...</div>;

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
