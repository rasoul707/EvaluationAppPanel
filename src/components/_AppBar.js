import * as React from 'react';
import { Link as LinkRoute } from "react-router-dom"
import { useSelector } from "react-redux";



import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';

import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';

import MenuIcon from '@mui/icons-material/Menu';
import LogoIcon from '@mui/icons-material/TableChart';
import NewSoftIcon from '@mui/icons-material/Add';
import SoftsIcon from '@mui/icons-material/Edit';
import EvaluationIcon from '@mui/icons-material/Reviews';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

import { deepOrange } from '@mui/material/colors';

const pages = [
    { title: 'New Software', icon: <NewSoftIcon />, url: '/softwares/new' },
    { title: 'Manage Softwares', icon: <SoftsIcon />, url: '/softwares' },
    { title: 'Evaluations', icon: <EvaluationIcon />, url: '/evaluations' }
];


const ResponsiveAppBar = () => {

    const user = useSelector(state => state.auth.user)


    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = () => {
        localStorage.clear()
        window.location.reload();
    }



    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                    {/* large logo */}
                    <LogoIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        children="Evaluator"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    />
                    {/* large logo */}



                    {/* large menu */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map(({ title, url, icon }) => (
                            <Button
                                key={url}
                                component={LinkRoute}
                                to={url}
                                sx={{ my: 2, color: 'white' }}
                                startIcon={icon}
                                children={title}
                            />
                        ))}
                    </Box>
                    {/* large menu */}



                    {/* small menu */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                            children={<MenuIcon />}
                        />
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'left', }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map(({ title, url, icon }) => (
                                <MenuItem
                                    key={url}
                                    component={LinkRoute}
                                    to={url}
                                >
                                    <ListItemIcon children={icon} />
                                    <Typography children={title} />
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    {/* small menu */}


                    {/* small logo */}
                    <LogoIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                        children="Evaluator"
                    />
                    {/* small logo */}



                    {/* right menu */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Profile">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={user.first_name + ' ' + user.last_name} src="/no-avatar" />
                            </IconButton>

                        </Tooltip>
                        <Menu
                            anchorEl={anchorElUser}
                            id="account-menu"
                            open={anchorElUser}
                            onClose={handleCloseUserMenu}
                            onClick={handleCloseUserMenu}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem
                                component={LinkRoute}
                                to={"/profile"}
                            >
                                <Avatar alt={user.first_name + ' ' + user.last_name} src="/no-avatar" />
                                {user.first_name + ' ' + user.last_name}
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                component={LinkRoute}
                                to={"/settings"}
                            >
                                <ListItemIcon>
                                    <SettingsIcon fontSize="small" />
                                </ListItemIcon>
                                Settings
                            </MenuItem>
                            <MenuItem
                                onClick={logout}
                            >
                                <ListItemIcon>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                    {/* right menu */}


                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;