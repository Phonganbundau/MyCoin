import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function Portfolio() {
  const [balance, setBalance] = useState(0); // Biến lưu trữ số dư

  // useEffect để gọi API khi component được mount
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch('http://localhost:3001/balance');
        const data = await response.json();
        setBalance(data.balance); // Giả sử API trả về đối tượng { balance: giá trị }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, []); // Chỉ chạy một lần khi component được mount

  return (
    <Card sx={{ margin: 2 }}>
      <CardContent>
        <Typography variant="h5" color="text.secondary">
          Portfolio Value
        </Typography>
        <Typography variant="h3" component="div">
          {balance} 
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Portfolio;
