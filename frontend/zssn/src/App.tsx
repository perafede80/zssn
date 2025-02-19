import React from 'react';
import './App.css';
import SurvivorList from './components/SurvivorList';
import SurvivorForm from './components/SurvivorForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <SurvivorForm />
          <SurvivorList />
        </div>
      </header>
    </div>
  );
}

export default App;
