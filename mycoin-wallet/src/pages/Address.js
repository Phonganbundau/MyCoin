import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function Address() {
  const { address } = useParams();
  const [unspentTxOuts, setUnspentTxOuts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/address/${address}`)
      .then(resp => setUnspentTxOuts(resp.data.unspentTxOuts));
  }, [address]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Address Information
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', wordBreak: 'break-all' }}>
        {address}
      </Typography>

      {/* Danh sách Unspent Transaction Outputs */}
      <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
        Unspent Transaction Outputs (UTXOs)
      </Typography>

      {unspentTxOuts.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="UTXOs table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Transaction Output ID</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unspentTxOuts.map((utxo, index) => (
                <TableRow key={index}>
                  <TableCell align="center" sx={{ wordBreak: 'break-all' }}>
                    {utxo.txOutId}
                  </TableCell>
                  <TableCell align="center">{utxo.amount} Coins</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', marginTop: 4 }}>
          No unspent transaction outputs found for this address.
        </Typography>
      )}
    </Box>
  );
}

export default Address;
