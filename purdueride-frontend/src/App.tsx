import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RideRequestPage from './pages/RideRequestPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/ride-request" element={<RideRequestPage />} />

          {/* Add more routes as needed */}
          <Route path="/*" element={<HomePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
