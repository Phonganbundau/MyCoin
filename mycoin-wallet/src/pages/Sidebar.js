import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WalletIcon from '@mui/icons-material/Wallet';

const Sidebar = () => {

    const [balance, setBalance] = useState(null); 
    const [address, setAddress] = useState(''); 

    const getAddress = async () => {
        try {
            const response = await axios.get('http://localhost:3001/address');
            setAddress(response.data.address);
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    const getBalance = async () => {
        try {
            const response = await axios.get('http://localhost:3001/balance');
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    useEffect(() => {
        getAddress();
        getBalance();
    }, []);

    const drawerWidth = 240;
    const navigate = useNavigate(); 

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#073860', 
                    color: 'white' 
                },
            }}
        >
            <Box sx={{ overflow: 'auto', padding: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                    PORTFOLIO VALUE
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', textAlign: 'center', marginTop: 1 }}>
                    {balance !== null ? `${balance} Mycoin` : 'Loading...'}
                </Typography>

              
                <Typography
                    variant="body2"
                    sx={{
                        color: 'white',
                        textAlign: 'center',
                        marginTop: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%', 
                    }}
                    title={address} 
                >
                    {address || 'Loading...'}
                </Typography>
            </Box>
            <List>
            <ListItem button onClick={() => navigate('/create-wallet')}>
                    <ListItemIcon>
                        <WalletIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Create Wallet" />
                </ListItem>
                <ListItem button onClick={() => navigate('/')}>
                    <ListItemIcon>
                        <AccountBalanceWalletIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Portfolio" />
                </ListItem>
                <ListItem button onClick={() => navigate('/block')}>
                    <ListItemIcon>
                        <InboxIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Blocks" />
                </ListItem>
                <ListItem button onClick={() => navigate('/send')}>
                    <ListItemIcon>
                        <SendIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Send" />
                </ListItem>
                <ListItem button onClick={() => navigate('/transactionpool')}>
                    <ListItemIcon>
                        <AttachMoneyIcon sx={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Transaction Pools" />
                </ListItem>
            </List>
        </Drawer>
    );
}

export default Sidebar;
