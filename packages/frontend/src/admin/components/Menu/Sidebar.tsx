import React, { useState, useEffect } from 'react';
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
    IconButton,
    Collapse,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
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
    const [open, setOpen] = useState<boolean>(true);
    const [reportsOpen, setReportsOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (!open) {
            setReportsOpen(false);
        }
    }, [open]);
    const getUserInitials = (): string => {
        return `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();
    };
    const menuItems = [
        { text: 'Users', icon: <PeopleIcon />, path: '/layout/users' },
        { text: 'Vehicles', icon: <DirectionsCarIcon />, path: '/vehicles' },
        {
            text: 'Reports',
            icon: <AssessmentIcon />,
            path: '',
            subMenu: [
                { text: 'Report 1', path: '/reports/report1' },
                { text: 'Report 2', path: '/reports/report2' },
                { text: 'Report 3', path: '/reports/report3' }
            ]
        },
    ];
    return (
        <Drawer
            variant="permanent"
            anchor="left"
            open={open}
            sx={{
                width: open ? drawerWidth : 60,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: open ? drawerWidth : 60,
                    boxSizing: 'border-box',
                    backgroundColor: '#1976D2',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    paddingTop: 2,
                    paddingBottom: 2,
                    overflowX: 'hidden',
                    transition: 'width 0.3s ease',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#1976D2',
                    },
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1 }}>
                <IconButton
                    size="small"
                    onClick={() => setOpen(!open)}
                    sx={{
                        color: '#fff',
                        mb: 1,
                    }}
                    aria-label={open ? 'Close sidebar' : 'Open sidebar'}
                >
                    {open ? <MenuOpenIcon /> : <MenuIcon />}
                </IconButton>
            </Box>
            {open && (
                <Box sx={{ px: 2, mb: 3, display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#fff' }}>
                        DEPARK
                    </Typography>
                </Box>
            )}
            <List>
                {menuItems.map((item) => (
                    <React.Fragment key={item.text}>
                        <ListItemButton
                            onClick={() => {
                                if (item.text === 'Reports') {
                                    setReportsOpen(!reportsOpen);
                                } else {
                                    navigate(item.path);
                                }
                            }}
                            sx={{
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            {item.icon}
                            {open && <ListItemText primary={item.text} sx={{ ml: 2 }} />}
                            {item.text === 'Reports' && (
                                <IconButton sx={{ color: '#fff', ml: 2 }}>
                                    {reportsOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                </IconButton>
                            )}
                        </ListItemButton>
                        {item.subMenu && (
                            <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.subMenu.map((subItem) => (
                                        <ListItemButton
                                            key={subItem.text}
                                            onClick={() => navigate(subItem.path)}
                                            sx={{
                                                color: '#fff',
                                                pl: 4,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                },
                                            }}
                                        >
                                            <ListItemText primary={subItem.text} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </React.Fragment>
                ))}
            </List>
            <Box sx={{ px: 2 }}>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', mb: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#1565C0', mr: 2, width: 40, height: 40 }}>
                        {getUserInitials()}
                    </Avatar>
                    {open && (
                        <Typography noWrap>
                            {user.firstName} {user.lastName}
                        </Typography>
                    )}
                </Box>
                {open && (
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
                )}
            </Box>
        </Drawer>
    );
};
export default Sidebar;
