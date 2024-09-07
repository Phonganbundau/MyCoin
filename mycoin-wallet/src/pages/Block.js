import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Typography, Box, Grid, Card, CardContent } from '@mui/material';

function Block() {
  const { id } = useParams();
  const [block, setBlock] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/block/${id}`)
      .then(resp => setBlock(resp.data));
  }, [id]);

  if (!block) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Card variant="outlined" sx={{ marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 3 }}>
            Block #{block.index}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="textSecondary">Block Height</Typography>
              <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>{block.index}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="textSecondary">Hash</Typography>
              <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>{block.hash}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="textSecondary">Previous Hash</Typography>
              <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>{block.previousHash || 'N/A'}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="textSecondary">Timestamp</Typography>
              <Typography variant="body1">
                {new Date(block.timestamp * 1000).toLocaleString()}
              </Typography>
            </Grid>


            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary">Number of Transactions</Typography>
              <Typography variant="body1">{block.data.length}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Danh sách các transaction */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Transactions</Typography>
      {block.data.map((tx, index) => (
        <Card key={index} variant="outlined" sx={{ marginBottom: 2, padding: 2 }}>
          <Typography variant="subtitle1" color="textSecondary">Transaction ID</Typography>
          <Typography variant="body1" component={Link} to={`/transaction/${tx.id}`} sx={{ wordBreak: 'break-all' }}>
            {tx.id}
          </Typography>

          <Grid container spacing={3} sx={{ marginTop: 2 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">Inputs</Typography>
              {tx.txIns.map((txIn, idx) => (
                <Typography key={idx} variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {txIn.signature === '' ? 'coinbase' : `${txIn.txOutId} ${txIn.txOutIndex}`}
                </Typography>
              ))}
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2" color="textSecondary">Outputs</Typography>
              {tx.txOuts.map((txOut, idx) => (
                <Typography key={idx} variant="body2" sx={{ wordBreak: 'break-all' }}>
                  <Link to={`/address/${txOut.address}`}>{txOut.address}</Link> - Amount: {txOut.amount}
                </Typography>
              ))}
            </Grid>
          </Grid>
        </Card>
      ))}
    </Box>
  );
}

export default Block;
