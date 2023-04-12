import React from "react";

import { Route, Routes } from 'react-router-dom';
import QueryStore from './stores/query-store';

import TopLevelComponent from "./components";

const App = () => {
  return (
    <div>
      <div style={{ margin: 20 }}>
      <Routes>
        <Route path="/" element={< TopLevelComponent store={QueryStore}/>} />
      </Routes>
      </div>
    </div>
  );
};

export default App;
