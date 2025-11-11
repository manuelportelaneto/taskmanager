import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useAuthStore } from './store/auth.store';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import { useEffect } from 'react'; // Importamos useEffect

// Componente que lida com as rotas protegidas
const ProtectedRoute = () => {
  const { token, isLoading } = useAuthStore();

  // Enquanto o store verifica o localStorage, mostramos um loader
  if (isLoading) {
    return <div>Loading session...</div>;
  }

  // Se terminou a verificação e não há token, redireciona para o login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se há token, renderiza o Dashboard
  return <DashboardPage />;
};

function App() {
  // Chamamos a função 'init' uma vez quando o App monta
  useEffect(() => {
    useAuthStore.getState().init();
  }, []);

  return (
    <div className="app-container">
      <BrowserRouter>
        {/* Removemos a div 'App' daqui para deixar o componente raiz mais limpo */}
        <Routes>
          {/* A rota raiz agora usa nosso componente de proteção */}
          <Route path="/" element={<ProtectedRoute />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Adicionamos uma rota curinga para redirecionar para o login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;