import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InviteEvaluation from "./InviteEvaluation"
import UserBioDialog from "./UserBioDialog"

import { MEDIABaseUrl } from "../config/server"
import VerifiedIcon from '@mui/icons-material/Verified';




const UserItem = ({ data, disabled, myProjects }) => {


    let size = 100
    const user = data

    const [openInviteDialog, setOpenInviteDialog] = React.useState(false)
    const [openUserBioDialog, setUserBioDialog] = React.useState(false)



    return <Paper
        sx={{
            p: 2,
            margin: 'auto',
            flexGrow: 1,
            // backgroundColor: data?.is_active === false ? "#b3b3b3" : '#fff',
        }}
    // 
    >

        <Stack direction="column" justifyContent="center" alignItems="center">
            <Stack direction="column" justifyContent="center" alignItems="center" sx={{ cursor: "pointer" }} onClick={() => setUserBioDialog(true)} >
                <Avatar
                    alt={user?.first_name + ' ' + user?.last_name}
                    src={user?.avatar ? MEDIABaseUrl + user?.avatar?.medium : "/NO-AVATAR"}
                    sx={{ width: size, height: size }}
                />
                <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mt: 2, mb: 1, }}>
                    {user?.is_verified && <VerifiedIcon sx={{ mr: 1, color: "rgb(29, 155, 240)" }} fontSize="small" />}
                    <Typography>{user?.first_name + ' ' + user?.last_name}</Typography>
                </Stack>
            </Stack>
            <Rating
                max={5}
                value={user?.stars / 2}
                precision={0.5}
                readOnly
            />
            <Box sx={{ ml: 1 }}><Typography>(score: {user?.evaluator_scores})</Typography></Box>
            <Stack direction="row" justifyContent="center" alignItems="center" columnGap={1}>
                <Button
                    size="small"
                    variant="contained"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    children="Invite"
                    onClick={() => setOpenInviteDialog(true)}
                    disabled={disabled}
                />
                <Button
                    size="small"
                    variant="contained"
                    color='info'
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    children="Bio"
                    onClick={() => setUserBioDialog(true)}
                    disabled={disabled}
                />
            </Stack>
        </Stack>



        <InviteEvaluation
            open={openInviteDialog}
            handleClose={() => setOpenInviteDialog(false)}
            userID={user?.id}
            name={user?.first_name + ' ' + user?.last_name}
            myProjects={myProjects}
        />

        <UserBioDialog
            open={openUserBioDialog}
            handleClose={() => { setUserBioDialog(false) }}
            userID={user?.id}
            name={user?.first_name + ' ' + user?.last_name}
            bio={user?.bio}
            is_verified={user?.is_verified}
            avatar={user?.avatar}
            stars={user?.stars}
            evaluator_scores={user?.evaluator_scores}
        />


    </Paper>
}

export default UserItem








