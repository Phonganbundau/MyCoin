import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import _ from 'lodash'; // lodash để sắp xếp
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Button
} from '@mui/material';

function Page() {
  const [blocks, setBlocks] = useState([]);

  // Lấy danh sách các blocks từ API khi component được render
  useEffect(() => {
    getBlocks();
  }, []);

  // Hàm lấy các blocks từ API
  const getBlocks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/blocks');
      setBlocks(response.data);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  };

  // Hàm sắp xếp các blocks theo thứ tự giảm dần
  const sortBlocks = (blocks) => {
    return _.chain(blocks)
      .sortBy('index')
      .reverse()
      .value();
  };

  return (
    <Box sx={{ padding: 4 }}>
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#0b3d91' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Block</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Hash</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Transactions</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortBlocks(blocks).map((block, index) => (
              <TableRow key={index} hover>
                <TableCell>{block.index}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/block/${block.hash}`}
                    sx={{ textTransform: 'none', wordBreak: 'break-all' }}
                  >
                    {block.hash}
                  </Button>
                </TableCell>
                <TableCell>{block.data.length}</TableCell>
                <TableCell>{new Date(block.timestamp * 1000).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {blocks.length === 0 && (
        <Typography variant="body1" align="center" color="textSecondary">
          No blocks found.
        </Typography>
      )}
    </Box>
  );
}

export default Page;
