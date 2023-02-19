/* eslint-disable react-hooks/exhaustive-deps */

import * as React from 'react';
import { Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Slide, Typography, } from '@mui/material';





const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const InviteEvaluation = ({ name, open, handleClose, myProjects }) => {


    const closeDig = () => {
        handleClose();
    }

    const done = () => {
        // send email invite
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
                        cursor: "pointer"
                    }}
                    onClick={() => {
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
            />
        </DialogActions>
    </Dialog>

}

export default InviteEvaluation