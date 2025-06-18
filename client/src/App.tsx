import "./App.css";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/Navbar/NavBar";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DocsPage from "./pages/DocsPage";
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/DasboardPage";
import { useAuth } from "./hooks/useAuth";
// import Profile from "./pages/ProfilePage";

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
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
