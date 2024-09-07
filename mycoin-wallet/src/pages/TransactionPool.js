import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, Box, Container } from '@mui/material';

function TransactionPool() {
   
    const [transactionPool, setTransactionPool] = useState([]); // Transaction pool
    const [error, setError] = useState(null); // Lưu lỗi

    



    // Hàm lấy danh sách transaction pool
    const getTransactionPool = async () => {
        try {
            const response = await axios.get('http://localhost:3001/transactionPool');
            setTransactionPool(response.data);
        } catch (error) {
            console.error('Error fetching transaction pool:', error);
            setError(error);
        }
    };

 

    // Hàm tạo block mới
    const mintBlock = async () => {
        try {
            await axios.post('http://localhost:3001/mintBlock');
            getTransactionPool(); // Cập nhật lại transaction pool
        } catch (error) {
            console.error('Error minting block:', error);
            setError(error);
        }
    };

    // Chạy khi component được mount để lấy dữ liệu
    useEffect(() => {
        getTransactionPool();
    }, []);

    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
    

            <Card variant="outlined" sx={{ padding: 3, marginBottom: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom align="center">
          Transaction Pool
        </Typography>
        {transactionPool.length > 0 ? (
          transactionPool.map((tx) => (
            <Card key={tx.id} sx={{ marginTop: 2 }}>
              <CardContent>
                <Typography variant="body2" color="textSecondary" sx={{ wordBreak: 'break-all' }}>
                  TxId: {tx.id}
                </Typography>
                <Grid container spacing={2} sx={{ marginTop: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Inputs:
                    </Typography>
                    {tx.txIns.map((txIn, index) => (
                      <Typography key={index} variant="body2" sx={{ wordBreak: 'break-all' }}>
                        {txIn.signature === '' ? 'coinbase' : `${txIn.txOutId} ${txIn.txOutIndex}`}
                      </Typography>
                    ))}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Outputs:
                    </Typography>
                    {tx.txOuts.map((txOut, index) => (
                      <Typography key={index} variant="body2" sx={{ wordBreak: 'break-all' }}>
                        Address: {txOut.address}, Amount: {txOut.amount}
                      </Typography>
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2" align="center" color="textSecondary">
            No transactions in transaction pool
          </Typography>
        )}
      </CardContent>
    </Card>

            <Box textAlign="center">
                <Button variant="contained" color="secondary" onClick={mintBlock} sx={{ padding: 1, minWidth: 200 }}>
                    Mint Block
                </Button>
            </Box>

            {error && (
                <Typography variant="body1" color="error" align="center" sx={{ marginTop: 2 }}>
                    {error}
                </Typography>
            )}
        </Container>
    );
}

export default TransactionPool;