import "./App.css";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/Navbar/NavBar";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DocsPage from "./pages/DocsPage";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/DasboardPage";
import { useAuth } from "./hooks/useAuth";

function App() {
  useAuth();

  return (
    <>
      <NavBar />
      <Routes>
        {/*
        Not adding "exact" in the routes because React Router v6 does not require it.
        The routes are now always matched in order, so the first match will be used.
        */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
