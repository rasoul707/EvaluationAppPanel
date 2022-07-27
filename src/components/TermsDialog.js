/* eslint-disable react-hooks/exhaustive-deps */

import * as React from 'react';
import { Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Slide, } from '@mui/material';
import { useSnackbar } from 'notistack';
import * as API from "../api";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const TermsDialog = ({ open, handleClose, }) => {


    const [terms, setTerms] = React.useState("")
    const { enqueueSnackbar, } = useSnackbar()


    const closeDig = () => {
        handleClose();
    }

    const getData = async () => {
        try {
            const response = await API.GET(false)('setting/terms/')
            setTerms(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
            closeDig()
        }
    }
    React.useEffect(() => {
        if (open) getData()
    }, [open])







    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDig}
    >
        <DialogTitle>Terms</DialogTitle>
        <DialogContent >
            <Typography>
                {terms}
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeDig} >Ok</Button>
        </DialogActions>
    </Dialog>

}

export default TermsDialog