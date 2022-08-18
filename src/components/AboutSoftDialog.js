/* eslint-disable react-hooks/exhaustive-deps */

import * as React from 'react';
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Slide, Link, } from '@mui/material';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const AboutSoftDialog = ({ title, description, download_link, logo, open, handleClose, }) => {


    const closeDig = () => {
        handleClose();
    }



    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDig}
    >
        <DialogTitle>About {title}</DialogTitle>
        <DialogContent>
            {/* <Avatar
                alt={title}
                src={logo}
                sx={{ width: 100, height: 100 }}
                variant="square"
                children={"No Photo"}
            /> */}
            <Typography>
                {description}
            </Typography>

        </DialogContent>
        <DialogActions>
            <Button
                component={Link}
                href={download_link}
                target="_blank"
                children="Download software"
            />
        </DialogActions>
    </Dialog>

}

export default AboutSoftDialog