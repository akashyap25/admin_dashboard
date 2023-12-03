// src/App.js
import React from 'react';
import './App.css';
import UserList from './Components/userList';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <UserList />
      <Footer />
    </div>
  );
}

export default App;
