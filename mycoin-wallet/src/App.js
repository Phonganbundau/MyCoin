// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateWallet from './components/CreateWallet';
import SendCoin from './components/SendCoin';
import Block from './pages/Block';
import Transaction from './pages/Transaction';
import TransactionPool from './components/TransactionPool';
import Address from './pages/Address';
import Home from './pages/Home';
import Page from './components/Page';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/send" element={<SendCoin />} />
        <Route path="/block/:id" element={<Block />} />
        <Route path="/transaction/:id" element={<Transaction />} />
        <Route path="/block" element={<Page />} />
        <Route path="/address/:address" element={<Address />} />
        <Route path="/transactionpool" element={<TransactionPool />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
