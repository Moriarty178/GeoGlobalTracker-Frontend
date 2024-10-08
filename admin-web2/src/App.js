import React from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <div className="app">
      <Header />
      <Main />
      {/* <Router>
        <Main />
        <AppRoutes />
      </Router> */}
    </div>
  );
}

export default App;
