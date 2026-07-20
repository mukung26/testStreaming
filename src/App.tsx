/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Details } from './pages/Details';
import { Player } from './pages/Player';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="details/:type/:id" element={<Details />} />
        </Route>
        {/* Player gets its own layout without the standard navbar */}
        <Route path="/player/:type/:id" element={<Player />} />
        <Route path="/player/:type/:id/:season/:episode" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}
