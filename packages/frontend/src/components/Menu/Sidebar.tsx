import React from 'react';
import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Typography,
    Avatar,
    Button,
    Divider,
} from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

interface User {
    firstName: string;
    lastName: string;
}

interface SidebarProps {
    user: User;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
    const getUserInitials = (): string => {
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    };

    const menuItems = [
        { text: 'Users' },
        { text: 'Vehicles' },
        { text: 'Reports' },
    ];

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    paddingTop: 2,
                    paddingBottom: 2,
                },
            }}
        >
            <Box sx={{ px: 2, mb: 3 }}>
                <img src="/image.png" alt="DEPARK" style={{ width: '100%', height: 'auto' }} />

            </Box>


            <List>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        sx={{ color: '#fff' }}
                    >
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ px: 2 }}>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', mb: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#1565c0', mr: 2, width: 40, height: 40 }}>
                        {getUserInitials()}
                    </Avatar>
                    <Typography>
                        {user.firstName} {user.lastName}
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    onClick={onLogout}
                    sx={{
                        color: '#fff',
                        borderColor: '#fff',
                        ':hover': {
                            borderColor: '#bbb',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                    }}
                    fullWidth
                >
                    Logout
                </Button>
            </Box>
        </Drawer>
    );
};

export default Sidebar;


