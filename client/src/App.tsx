import "./App.css";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/Navbar/NavBar";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DocsPage from "./pages/DocsPage";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "../src/components/Helper/ProtectedRoute";

function App() {
  useAuth();

  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/docs" element={<DocsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<DashboardPage />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}

export default App;
