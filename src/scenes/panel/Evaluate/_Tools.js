import * as React from 'react';

import { LoadingButton } from '@mui/lab'
import { Button, Alert, Dialog, AlertTitle, DialogTitle, DialogContent, DialogActions, Slide, Typography, Grid, } from '@mui/material';



export const Submit = ({ submitHandler, loading, disabled }) => {

    const [openAcceptDialog, setOpenAcceptDialog] = React.useState(false)


    const showAcceptDialog = () => {
        setOpenAcceptDialog(true)
    }
    const rejectAcceptDialog = () => {
        setOpenAcceptDialog(false)
    }
    const confirmAcceptDialog = () => {
        setOpenAcceptDialog(false)
        submitHandler()
    }


    return <>
        <Grid container item>
            <Grid item xs={12}>
                <LoadingButton
                    onClick={showAcceptDialog}
                    variant='contained'
                    loading={loading}
                    disabled={disabled}
                    fullWidth
                >
                    Submit
                </LoadingButton>
            </Grid>
        </Grid>
        <ConfirmDataDialog
            open={openAcceptDialog}
            handleReject={rejectAcceptDialog}
            handleConfirm={confirmAcceptDialog}
        />
    </>
}


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export const ConfirmDataDialog = ({ open, handleReject, handleConfirm }) => {
    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleReject}
    >
        <DialogTitle>Limited</DialogTitle>
        <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
                <AlertTitle>Limit</AlertTitle>
                if you submit evaluations, you can not modify them
            </Alert>
            <Typography>
                Are you sure about your inputs?
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleConfirm} >Yes</Button>
            <Button onClick={handleReject} color="error">No</Button>
        </DialogActions>
    </Dialog>
}


