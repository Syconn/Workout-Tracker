import { useEffect, useState } from 'react'
import { AuthContext, SignupMenu } from './pages/Signin';
import { useSetProp } from './utils/Util';
import './App.css'

function App() {
  const [authContext, setAuthContext] = useState<AuthContext>(() => {
    const stored = localStorage.getItem("authContext");
    return stored ? JSON.parse(stored) : { name: "", username: "", password: "", email: "" };
  });
  const [page, setPage] = useState(authContext.name.length == 0 ? "login" : "home");

  useEffect(() => {
    localStorage.setItem("authContext", JSON.stringify(authContext));
  }, [authContext]);

  const setAuth = useSetProp(setAuthContext);

  return (
    <>
      <button onClick={() => setPage("home")}>Home</button>
      <button onClick={() => setPage("login")}>Login</button>
      {page == "signup" && <SignupMenu setPage={setPage} setAuth={setAuth} />}
    </>
  )
}

export default App