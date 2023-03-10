import * as React from 'react';
import { Link as LinkRoute, useHistory } from "react-router-dom"
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
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Rating from '@mui/material/Rating'
import MenuIcon from '@mui/icons-material/Menu';
import LogoIcon from '@mui/icons-material/TableChart';
import NewSoftIcon from '@mui/icons-material/Add';
import SoftsIcon from '@mui/icons-material/Edit';
import EvaluationIcon from '@mui/icons-material/Reviews';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import ShopIcon from '@mui/icons-material/Shop';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VerifiedIcon from '@mui/icons-material/Verified';
import * as API from "../api"

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';

const ResponsiveAppBar = () => {

    const user = useSelector(state => state.auth.user)


    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [menuUtils, setMenuUtils] = React.useState(null);

    const [notifications, setNotifications] = React.useState([]);

    const history = useHistory()

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setMenuUtils('user')
        setAnchorElUser(event.currentTarget);
    };
    const handleOpenNotifyMenu = (event) => {
        setMenuUtils('notify')
        getNotifications()
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = async () => {
        await API.POST(true)('auth/logout/')
        localStorage.clear()
        window.location.reload()
    }

    let pages = [];

    if (user.user_level === 'level2') {
        pages = [
            { title: 'Evaluations', icon: <EvaluationIcon />, url: '/evaluations' }
        ]
    }
    if (user.user_level === 'level3') {
        pages = [
            { title: 'New Software', icon: <NewSoftIcon />, url: '/softwares/new' },
            { title: 'Manage Softwares', icon: <SoftsIcon />, url: '/softwares' },
            { title: 'Evaluations', icon: <EvaluationIcon />, url: '/evaluations' }
        ]
    }



    // notifications
    const readAllNotify = async () => {

    }
    const handleNotifyClick = async (index) => {
        history.push(notifications[index].url)
    }
    const getNotifications = async (index) => {
        try {
            const response = await API.GET()(`notification/`)
            setNotifications(response.data)
        } catch (error) { }
    }



    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>

                    {/* large logo */}
                    <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "white" }}>
                        <LogoIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
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
                    </a>
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
                    <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "white" }}>
                        <LogoIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    </a>
                    {/* small logo */}



                    {/* right menu */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Notifications">
                            <IconButton
                                color="inherit"
                                onClick={handleOpenNotifyMenu}
                            >
                                <Badge badgeContent={0} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Profile">
                            <IconButton onClick={handleOpenUserMenu} sx={{ ml: 2 }}>
                                <Badge
                                    color="warning"
                                    badgeContent={user.score}
                                    max={999999999}
                                    showZero
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                >
                                    <Avatar
                                        alt={user.first_name + ' ' + user.last_name}
                                        src={user.avatar?.medium ?? "/no-avatar"}
                                    />
                                </Badge>
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
                                style: {
                                    width: menuUtils === 'notify' ? '320px' : null,
                                },
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    textAlign: "center",
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
                            {
                                menuUtils === 'notify'
                                    ?
                                    <List
                                        component="nav"
                                        sx={{
                                            width: '100%',
                                            maxWidth: 800,
                                            bgcolor: 'background.paper',
                                            position: 'relative',
                                            overflow: 'auto',
                                            maxHeight: 300,
                                            padding: 0,
                                            '& ul': { padding: 0 },
                                        }}
                                    >
                                        <ListSubheader>
                                            <Button
                                                children={"Read all"}
                                                variant='outlined'
                                                size='small'
                                                sx={{ mb: 1 }}
                                                onClick={readAllNotify}
                                            />
                                        </ListSubheader>
                                        {notifications.map(({ url, content, title, read }, index) => {
                                            return <>
                                                <Divider />
                                                <ListItem
                                                    button
                                                    onClick={() => handleNotifyClick(index)}
                                                    sx={{ background: read ? "#dbdbdb" : "background.paper" }}
                                                >
                                                    <ListItemText
                                                        primary={title}
                                                        secondary={content}
                                                    />
                                                </ListItem>
                                            </>
                                        })}
                                        {notifications.length === 0 && <ListItem>
                                            <ListItemText
                                                secondary={"No notification found :)"}
                                            />
                                        </ListItem>}
                                    </List>
                                    : <>
                                        <MenuItem
                                            component={LinkRoute}
                                            to={"/profile"}
                                        >
                                            <Stack direction="column" justifyContent="center" alignItems="center">
                                                <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: 1, }}>
                                                    <Avatar
                                                        alt={user.first_name + ' ' + user.last_name}
                                                        src={user.avatar?.medium ?? "/no-avatar"}
                                                    />
                                                    {user.is_verified && <VerifiedIcon sx={{ mr: 1, color: "rgb(29, 155, 240)" }} fontSize="small" />}
                                                    {user.first_name + ' ' + user.last_name}
                                                </Stack>
                                                <Chip label={user.user_level} sx={{ width: "100%", mb: 1 }} />
                                                <Divider sx={{ width: "100%" }} />
                                                <Stack direction="column" justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
                                                    <Box sx={{ ml: 1 }}>(score: {user.evaluator_scores})</Box>
                                                    <Rating
                                                        max={5}
                                                        value={user.stars / 2}
                                                        precision={0.5}
                                                        readOnly
                                                    />
                                                </Stack>
                                            </Stack>
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem
                                            component={LinkRoute}
                                            to={"/settings"}
                                            disabled
                                        >
                                            <ListItemIcon>
                                                <SettingsIcon fontSize="small" />
                                            </ListItemIcon>
                                            Settings
                                        </MenuItem>
                                        <MenuItem
                                            component={LinkRoute}
                                            to={"/shop"}
                                        >
                                            <ListItemIcon>
                                                <ShopIcon fontSize="small" />
                                            </ListItemIcon>
                                            Shop
                                        </MenuItem>
                                        <MenuItem
                                            onClick={logout}
                                        >
                                            <ListItemIcon>
                                                <LogoutIcon fontSize="small" />
                                            </ListItemIcon>
                                            Logout
                                        </MenuItem>
                                    </>
                            }





                        </Menu>
                    </Box>
                    {/* right menu */}


                </Toolbar>
            </Container>
        </AppBar >
    );
};
export default ResponsiveAppBar;