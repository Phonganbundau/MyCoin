import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Container, CircularProgress, Box } from '@mui/material';

function Transaction() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/transaction/${id}`)
      .then(resp => setTransaction(resp.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!transaction) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Transaction Details
          </Typography>

          <Typography variant="h6" color="primary">
            Transaction ID:
          </Typography>
          <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
            {transaction.id}
          </Typography>

          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="secondary">
                Inputs
              </Typography>
              {transaction.txIns.map((txIn, index) => (
                <Typography key={index} variant="body2">
                  {txIn.txOutId} - {txIn.txOutIndex}
                </Typography>
              ))}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="secondary">
                Outputs
              </Typography>
              {transaction.txOuts.map((txOut, index) => (
                <Typography key={index} variant="body2">
                  Address: {txOut.address}, Amount: {txOut.amount}
                </Typography>
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Transaction;
