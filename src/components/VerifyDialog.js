import * as React from 'react';
import { Dialog, Slide, } from '@mui/material';
import Verify from "../scenes/authentication/verify"

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const VerifyDialog = ({ open, handleClose, phone }) => {

    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        sx={{ p: 0 }}
    >
        <Verify
            noSpace={true}
            phoneVerify={phone}
            callback={() => {
                handleClose()
            }}
        />
    </Dialog>

}

export default VerifyDialog