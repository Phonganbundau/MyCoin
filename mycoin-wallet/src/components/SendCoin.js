import React from 'react';
import Header from '../pages/Header';
import SendCoin from './../pages/SendCoin';
import Sidebar from '../pages/Sidebar';
import { CssBaseline, Box } from '@mui/material';

const drawerWidth = 0; 

function App() {
  return (
    <>
      <CssBaseline /> 
      
     
      <Box sx={{ display: 'flex' }}> 
        <Sidebar />
        <Box
          component="main"
          sx={{ flexGrow: 1, marginLeft: `${drawerWidth}px` }} 
        >
          <Header />   
          <SendCoin />
        </Box>
      </Box>
    </>
  );
}

export default App;
