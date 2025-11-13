import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>Welcome to <span className="highlight">Campus Connect</span></h1>
        <p>Your gateway to events, clubs, and campus activities</p>
      </header>

      <main className="main-content">
        
        <p>
          Explore upcoming events, register easily, and stay connected with your campus community.
        </p>
        <button className="get-started-btn">
          Get Started
        </button>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Campus Connect | All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default App;


