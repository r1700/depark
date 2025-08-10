import React from 'react';
import Sidebar from '../Menu/Sidebar';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
interface LayoutProps {
    user: {
        firstName: string;
        lastName: string;
    };
    onLogout: () => void;
}
const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar user={user} onLogout={onLogout} />
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
};
export default Layout;
