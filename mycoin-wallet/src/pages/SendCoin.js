import React, { useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';

function SendCoin() {
    const [receiverAddress, setReceiverAddress] = useState(''); // Địa chỉ người nhận
    const [receiverAmount, setReceiverAmount] = useState(''); // Số tiền gửi
    const [error, setError] = useState(null); // Lưu lỗi
    const [success, setSuccess] = useState(null); // Lưu thành công

    // Hàm gửi transaction
    const sendTransaction = async () => {
        try {
            await axios.post('http://localhost:3001/sendTransaction', {
                address: receiverAddress,
                amount: parseInt(receiverAmount)
            });
            setReceiverAddress('');
            setReceiverAmount('');
            setError(null); // Reset lỗi
            setSuccess('Transaction sent successfully'); // Hiển thị thông báo thành công
        } catch (error) {
            console.error('Error sending transaction:', error);
            setError('Error sending transaction');
            setSuccess(null); // Reset thông báo thành công
        }
    };

    return (
        <Box sx={{ padding: 4, maxWidth: 600, margin: 'auto' }}>
            <Card variant="outlined" sx={{ padding: 3, marginBottom: 4 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom align="center">
                        Send Tokens
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Receiver Address"
                                variant="outlined"
                                fullWidth
                                value={receiverAddress}
                                onChange={(e) => setReceiverAddress(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Amount"
                                type="number"
                                variant="outlined"
                                fullWidth
                                value={receiverAmount}
                                onChange={(e) => setReceiverAmount(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth 
                                onClick={sendTransaction}
                                sx={{ padding: 1 }}
                            >
                                Send Transaction
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Thông báo lỗi */}
            {error && (
                <Typography variant="body1" color="error" align="center" sx={{ marginTop: 2 }}>
                    {error}
                </Typography>
            )}

            {/* Thông báo thành công */}
            {success && (
                <Typography variant="body1" color="primary" align="center" sx={{ marginTop: 2 }}>
                    {success}
                </Typography>
            )}
        </Box>
    );
}

export default SendCoin;
