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

type RoleName = 'admin' | 'hr' | 'guest';

interface User {
    firstName: string;
    lastName: string;
    role?: number | string; // מקור השרת
}

interface SidebarProps {
    user: User;
    onLogout: () => void;
}

/** normalize role from various representations to 'admin'|'hr'|'guest' */
function normalizeRole(role: number | string | undefined): RoleName {
    if (role === undefined || role === null) return 'guest';
    const r = String(role).toLowerCase();
    if (r === '2' || r === 'admin' || r.includes('admin')) return 'admin';
    if (r === '1' || r === 'hr' || r.includes('hr') || r.includes('human')) return 'hr';
    return 'guest';
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

    const userRole = normalizeRole(user?.role);

    const getUserInitials = (): string => {
        return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();
    };

    // menu items now include optional `allowed` array with roles that can see the item
    const menuItems: Array<{
        text: string;
        icon?: React.ReactNode;
        path?: string;
        allowed?: RoleName[]; // אם לא קיים -> גלוי לכולם
        subMenu?: Array<{ text: string; path: string; allowed?: RoleName[] }>;
    }> = [
            { text: 'Users', icon: <PeopleIcon />, path: '/layout/users', allowed: ['admin'] }, // רק מנהל
            { text: 'Vehicles', icon: <DirectionsCarIcon />, path: '/layout/vehicles', allowed: ['admin', 'hr'] }, // שניהם
            {
                text: 'Reports',
                icon: <AssessmentIcon />,
                path: '',
                allowed: ['admin', 'hr'], // שניהם רואים Reports
                subMenu: [
                    { text: 'Parking Stats', path: '/admin/layout/reports/parking-stats', allowed: ['admin'] },
                    { text: 'Surface Stats', path: '/admin/layout/reports/surface-stats', allowed: ['admin', 'hr'] },
                ],
            },
        ];

    // helper: check if current user role allowed to see item
    const isAllowed = (allowed?: RoleName[]) => {
        if (!allowed || allowed.length === 0) return true;
        return allowed.includes(userRole);
    };

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
                    // skip item if not allowed for this user
                    if (!isAllowed(item.allowed)) return null;

                    // determine visible subMenu after filtering by allowed
                    const visibleSubMenu = item.subMenu?.filter((s) => isAllowed(s.allowed)) ?? [];

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