import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, TextField, Button, Box, Container } from '@mui/material';

function CreateWallet() {
    const [address, setAddress] = useState(''); // Địa chỉ ví
    const [balance, setBalance] = useState(null); // Số dư
    const [transactionPool, setTransactionPool] = useState([]); // Transaction pool
    const [receiverAddress, setReceiverAddress] = useState(''); // Địa chỉ người nhận
    const [receiverAmount, setReceiverAmount] = useState(''); // Số tiền
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
        }
    };
    
    

    // Hàm lấy địa chỉ ví
    const getAddress = async () => {
        try {
            const response = await axios.get('http://localhost:3001/address');
            setAddress(response.data.address);
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    // Hàm lấy số dư
    const getBalance = async () => {
        try {
            const response = await axios.get('http://localhost:3001/balance');
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    // Hàm lấy danh sách transaction pool
    const getTransactionPool = async () => {
        try {
            const response = await axios.get('http://localhost:3001/transactionPool');
            setTransactionPool(response.data);
        } catch (error) {
            console.error('Error fetching transaction pool:', error);
        }
    };

    // Hàm gửi transaction
    const sendTransaction = async () => {
        try {
            await axios.post('http://localhost:3001/sendTransaction', {
                address: receiverAddress,
                amount: parseInt(receiverAmount)
            });
            setReceiverAddress('');
            setReceiverAmount('');
            getBalance(); // Cập nhật lại số dư
            getTransactionPool(); // Cập nhật lại transaction pool
        } catch (error) {
            console.error('Error sending transaction:', error);
            setError('Error sending transaction');
        }
    };

    // Hàm tạo block mới
    const mintBlock = async () => {
        try {
            await axios.post('http://localhost:3001/mintBlock');
            getTransactionPool(); // Cập nhật lại transaction pool
        } catch (error) {
            console.error('Error minting block:', error);
        }
    };

    // Chạy khi component được mount để lấy dữ liệu
    useEffect(() => {
        getAddress();
        getBalance();
        getTransactionPool();
    }, []);

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