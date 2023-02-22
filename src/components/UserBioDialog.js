/* eslint-disable react-hooks/exhaustive-deps */

import * as React from 'react';
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Slide, } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { MEDIABaseUrl } from "../config/server"
import VerifiedIcon from '@mui/icons-material/Verified';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const UserBioDialog = ({ name, is_verified, avatar, stars, evaluator_scores, bio, open, handleClose, }) => {


    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
    >
        <DialogTitle>info</DialogTitle>
        <DialogContent sx={{ minWidth: "500px" }}>
            <Stack direction="column" justifyContent="center" alignItems="center">
                <Avatar
                    alt={name}
                    src={avatar ? MEDIABaseUrl + avatar?.medium : "/NO-AVATAR"}
                    sx={{ width: 100, height: 100 }}
                />
                <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mt: 2, mb: 1, }}>
                    {is_verified && <VerifiedIcon sx={{ mr: 1, color: "rgb(29, 155, 240)" }} fontSize="small" />}
                    <Typography>{name}</Typography>
                </Stack>
                <Rating
                    max={5}
                    value={stars / 2}
                    precision={0.5}
                    readOnly
                />
                <Box sx={{ ml: 1 }}><Typography>(score: {evaluator_scores})</Typography></Box>
            </Stack>
            <Typography variant="button"><b>Resume:</b></Typography>
            <Typography dangerouslySetInnerHTML={{ __html: bio }} />
        </DialogContent>
        <DialogActions>
            <Button
                children="OK"
                onClick={handleClose}
            />
        </DialogActions>
    </Dialog>

}

export default UserBioDialog