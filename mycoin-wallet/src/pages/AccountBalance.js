import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Container } from '@mui/material';

function AccountBalance() {
    const [address, setAddress] = useState(''); // Địa chỉ ví
    const [balance, setBalance] = useState(null); // Số dư
    const [error, setError] = useState(null); // Lưu lỗi


    
    

    // Hàm lấy địa chỉ ví
    const getAddress = async () => {
        try {
            const response = await axios.get('http://localhost:3001/address');
            setAddress(response.data.address);
        } catch (error) {
            console.error('Error fetching address:', error);
            setError(error);
        }
    };

    // Hàm lấy số dư
    const getBalance = async () => {
        try {
            const response = await axios.get('http://localhost:3001/balance');
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
            setError(error);
        }
    };



    


    useEffect(() => {
        getAddress();
        getBalance();
    }, []);

    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Card variant="outlined" sx={{ padding: 3, marginBottom: 4 }}>
        <CardContent>

          <Typography variant="h5" gutterBottom align="center">
            Account Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary">Public Address</Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  wordBreak: 'break-all',   
                  whiteSpace: 'normal',     
                  overflowWrap: 'break-word'  
                }}
              >
                {address || 'Loading...'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary">Balance</Typography>
              <Typography variant="body1">
                {balance !== null ? `${balance} Mycoin` : 'Loading...'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
            {error && (
                <Typography variant="body1" color="error" align="center" sx={{ marginTop: 2 }}>
                    {error}
                </Typography>
            )}
        </Container>
    );
}

export default AccountBalance;