import React from 'react';
import Header from './Header';
import AccountBalance from './AccountBalance';
import Sidebar from './Sidebar';
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
          <AccountBalance />   
        </Box>
      </Box>
    </>
  );
}

export default App;
