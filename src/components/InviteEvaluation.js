/* eslint-disable react-hooks/exhaustive-deps */

import * as React from 'react';
import { Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Slide, Typography, } from '@mui/material';
import * as API from "../api";
import { useSnackbar } from 'notistack';




const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const InviteEvaluation = ({ userID, name, open, handleClose, myProjects }) => {


    const [disabled, setDisabled] = React.useState(false)
    const [loading, setLoading] = React.useState(false)


    const { enqueueSnackbar } = useSnackbar()

    const closeDig = () => {
        handleClose();
        setSelectProject(null)
    }

    const done = async () => {
        if (!selectProject) {
            handleClose();
            return
        }
        try {
            setLoading(true)
            setDisabled(true)
            await API.POST()(`software/invite/`, { projects: selectProject, user: userID })
            setLoading(false)
            setDisabled(false)
            setSelectProject(null)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
            setLoading(false)
            setDisabled(false)
            setSelectProject(null)
        }
        handleClose();
    }

    const [selectProject, setSelectProject] = React.useState(null)





    return <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDig}
    >
        <DialogTitle>Invite <b>{name}</b></DialogTitle>
        <DialogContent>
            {myProjects.map(({ id, name, evaluations }) => {
                return <Paper
                    sx={{
                        p: 2,
                        backgroundColor: id === selectProject ? "#0bbd94" : "#b3b3b3",
                        width: 250,
                        m: 1,
                        cursor: disabled ? "none" : "pointer"
                    }}
                    onClick={() => {
                        if (disabled) return
                        setSelectProject(id === selectProject ? null : id)
                    }}
                >
                    <Typography >
                        {name}
                        <br />
                        {evaluations.join(" | ")}
                    </Typography>
                </Paper>
            })}
        </DialogContent>
        <DialogActions>
            <Button
                children="Done"
                onClick={done}
                disabled={disabled}
            />
        </DialogActions>
    </Dialog>

}

export default InviteEvaluation