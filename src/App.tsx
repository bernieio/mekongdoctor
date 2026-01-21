import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Diagnosis from "./pages/Diagnosis";
import Marketplace from "./pages/Marketplace";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import TacCau from "./pages/TacCau";
import Sokfarm from "./pages/Sokfarm";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/diagnosis" element={<Diagnosis />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/community" element={<Community />} />
      <Route path="/taccau" element={<TacCau />} />
      <Route path="/sokfarm" element={<Sokfarm />} />
      {/* Profile page kept as a static placeholder or for future use */}
      <Route path="/profile" element={<Profile />} />

      {/* Redirect Auth to Home */}
      <Route path="/auth" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
