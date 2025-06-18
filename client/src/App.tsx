import "./App.css";
import Footer from "./Components/Footer/Footer";
import NavBar from "./Components/Navbar/NavBar";
import HomePage from "./Pages/HomePage";
import AuthPage from "./Pages/AuthPage";
import DocsPage from "./Pages/DocsPage";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/DasboardPage";
import { useAuth } from "./Hooks/useAuth";

function App() {
  useAuth();

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
