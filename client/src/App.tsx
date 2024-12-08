import "./App.css";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
// import InvoiceMaker from "./pages/InvoiceMaker";
import NumberDetector from "./components/NumberDetector";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/invoice-maker" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/" element={<NumberDetector />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </div>
    );
}

export default App;
