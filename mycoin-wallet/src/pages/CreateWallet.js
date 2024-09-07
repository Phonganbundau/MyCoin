import React, { useState } from 'react';
import axios from 'axios';
import {Card, CardContent, Typography, Button, Box, Container } from '@mui/material';

function CreateWallet() {
   
  

    const [walletInfo, setWalletInfo] = useState({ privateKey: '', publicKey: '' });
    const [error, setError] = useState(null); // Lưu lỗi

    // Hàm tạo ví 
    const createNewWallet = async () => {
        try {
            const response = await axios.post('http://localhost:3001/createWallet');
            setWalletInfo({
                privateKey: response.data.privateKey,
                publicKey : response.data.publicKey,
                passphrase: response.data.passphrase
            });
        } catch (error) {
            console.error('Error creating wallet:', error);
            setError(error);
        }
    };
    
    



    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
        <Card variant="outlined" sx={{ padding: 3, marginBottom: 4 }}>
        <CardContent>
        <Box textAlign="center" sx={{ marginBottom: 2 }}>
        <Button variant="contained" color="primary" onClick={createNewWallet}>
            Create New Wallet
        </Button>
    
        {walletInfo.publicKey && (
            <Box sx={{ marginTop: 2 }}>
                <Typography variant="h6">Wallet Information</Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>
                    <strong>Public Key:</strong> {walletInfo.publicKey}
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>
                    <strong>Private Key:</strong> {walletInfo.privateKey}
                </Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>
                    <strong>Passphrase:</strong> {walletInfo.passphrase}
                </Typography>
            </Box>
        )}
    </Box>
    
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

export default CreateWallet;