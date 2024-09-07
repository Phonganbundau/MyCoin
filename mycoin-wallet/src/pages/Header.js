import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar sx={{backgroundColor: '#073860'}} >
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1}}>
          <img src="/logo.png" alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
          <Typography variant="h6" sx={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
            MyCoin
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
