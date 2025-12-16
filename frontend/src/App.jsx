import { Routes, Route, Navigate } from "react-router";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PageLoader from "./components/PageLoader.jsx";

import { useAuthStore } from "./store/useAuthStore.js";

const App = () => {

  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(()=>{
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if(isCheckingAuth){
    return <PageLoader/>;
  }

  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      <Routes>
        <Route path="/" element={ authUser ? <ChatPage/> : <Navigate to={"/login"} /> } /> {/*On the ChatPage, the frontend calls a backend API to get data. That API endpoint is protected by authentication middleware, so even if a user tries to call it directly, they cannot access it without being logged in.*/}
        <Route path="/login" element={ authUser ? <Navigate to={"/"} /> : <LoginPage/>} />
        <Route path="/signup" element={ authUser ? <Navigate to={"/"} /> : <SignupPage/>} />
      </Routes>

      <Toaster/>
    </div>
  )
};

export default App;

// authUser is either:
// null → user is not logged in, or auth check failed
// an object → user is logged in, contains user info

// authUser ? <ChatPage/> : <Navigate to="/login" /> means:
// If authUser is truthy (an object), the user can see ChatPage.
// If authUser is null (or any falsy value), React redirects to /login.
// Similarly, /login and /signup pages are only accessible if authUser is falsy (not logged in).