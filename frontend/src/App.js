import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import FormularioFolga from './components/formulario/FormularioFolga';
import TabelaEscala from './components/tabela/TabelaEscala';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <header className="App-header">
          <h1>🔮 Sistema de Escalas de Folga</h1>
        </header>

        <main>
          <FormularioFolga />
          <hr style={{ margin: '40px auto', width: '80%', border: '1px solid #ddd' }} />
          <h2 style={{ textAlign: 'center', color: '#333' }}>
            Escala da Semana (Folgas Aprovadas)
          </h2>
          <TabelaEscala />
        </main>

        <footer style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          <p>Sistema de Gestão de Folgas © 2026</p>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
