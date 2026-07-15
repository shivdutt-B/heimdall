import "./App.css";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/Navbar/NavBar";
import HomePage from "./layouts/HomePage";
import AuthPage from "./layouts/AuthPage";
import DocsPage from "./layouts/DocsPage";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "../src/components/Helper/ProtectedRoute";
import Introduction from "../src/components/Docs/Introduction";


function App() {
  useAuth();

  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/docs" element={<DocsPage children={<Introduction />} />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<DashboardLayout />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}

export default App;
