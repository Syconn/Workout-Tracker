import { useState } from 'react'
import './App.css'
import { LoginMenu, SignupMenu } from './pages/Users';

function App() {
  const [page, setPage] = useState("login");

  return (
    <>
      {page == "home" && <Home />}
      {page == "login" && <LoginMenu setPage={setPage}/>}
      {page == "signup" && <SignupMenu />}
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