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
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import ParkingIcon from '@mui/icons-material/LocalParking';
import { LogoDev } from '@mui/icons-material';
const drawerWidth = 240;

interface User {
    firstName: string;
    lastName: string;
    role?: number | string; // מקור השרת
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
        if (!user || !user.firstName || !user.lastName) return '?';
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    };

    // menu items synced with AdminRoutes
    const menuItems: Array<{
        text: string;
        icon?: React.ReactNode;
        path?: string;
        subMenu?: Array<{ text: string; path: string }>;
    }> = [

        { text: 'Admin Dashboard', icon: <PeopleIcon />, path: '/admin/layout/admin' },
        { text: 'HR Dashboard', icon: <DirectionsCarIcon />, path: '/admin/layout/hr-dashboard' },
        { text: 'Users', icon: <PeopleIcon />, path: '/admin/layout/users' },
        { text: 'Admin Config', icon: <AssessmentIcon />, path: '/admin/layout/admin-config' },
        { text: 'Parkings', icon: <LocalParkingIcon />, path: '/admin/layout/parkings' },
        { text: 'Reserved Parking', icon: <ParkingIcon />, path: '/admin/layout/reserved-parking' },
        { text: 'Logo Management', icon: <LogoDev />, path: '/admin/layout/logo-management' },
        {
            text: 'Reports',
            icon: <AssessmentIcon />,
            subMenu: [
                { text: 'Parking Stats', path: '/admin/layout/reports/parking-stats' },
                { text: 'Surface Stats', path: '/admin/layout/reports/surface-stats' },
            ],
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
                        Depark
                    </Typography>
                </Box>
            )}
            <List>
                {menuItems.map((item) => {
                    // all items are allowed
                    const visibleSubMenu = item.subMenu ?? [];

                    return (
                        <React.Fragment key={item.text}>
                            <ListItemButton
                                onClick={() => {
                                    if (item.subMenu) {
                                        setReportsOpen(!reportsOpen);
                                    } else if (item.path) {
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
                                {item.subMenu && open && (
                                    <IconButton sx={{ color: '#fff', ml: 2 }}>
                                        {reportsOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                                    </IconButton>
                                )}
                            </ListItemButton>
                            {item.subMenu && visibleSubMenu.length > 0 && (
                                <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {visibleSubMenu.map((subItem) => (
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
                    );
                })}
            </List>
            <Box sx={{ px: 2 }}>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', mb: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#1565C0', mr: 2, width: 40, height: 40 }}>{getUserInitials()}</Avatar>
                    {open && (
                        <Typography noWrap>
                            {user && user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Guest'}
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