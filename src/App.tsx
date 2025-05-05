import { useEffect, useState } from 'react'
import { AuthContext, LoginMenu, SignupMenu } from './pages/Users';
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
      {page == "home" && <Home />}
      {page == "login" && <LoginMenu setPage={setPage} />}
      {page == "signup" && <SignupMenu setPage={setPage} setAuth={setAuth} />}
    </>
  )
}

function Home() {
  return (
    <>
    Home
    </>
  );
}

export default App