import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';

import AddIcon from '@mui/icons-material/Add';

import { Link as LinkRoute } from "react-router-dom"

import immggg from "../../../static/img/login2.png"




const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

const Item = ({ ID, remove }) => <Paper
    sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    }}
>
    <Grid container spacing={2}>
        <Grid item>
            <ButtonBase sx={{ width: 128, height: 128 }}>
                <Img alt="complex" src={immggg} />
            </ButtonBase>
        </Grid>

        <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                    <Typography gutterBottom variant="subtitle1" component="div">
                        Software name
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Area: mmm
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ID: {ID}
                    </Typography>
                </Grid>
                <Grid item xs container direction="row" spacing={1}>
                    <Grid item>
                        <Button
                            children="Edit"
                            color="info"
                            component={LinkRoute}
                            to={`/softwares/${ID}`}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            children="Result"
                            color="success"
                            component={LinkRoute}
                        // to={`/softwares/${ID}/result`}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            children="Remove"
                            color="error"
                            onClick={() => remove(ID)}
                        />
                    </Grid>
                </Grid>
            </Grid>
            {/* <Grid item>
                <Typography variant="subtitle1" component="div">
                    $19.00
                </Typography>
            </Grid> */}
        </Grid>


    </Grid>
</Paper>;

export default function SoftwaresList() {

    const [removeID, setRemoveID] = React.useState(null);
    const closeDialog = () => setRemoveID(null)


    const removeSoftware = () => {
        const softwareID = removeID;
        closeDialog()
        alert(softwareID)
    }


    return <>

        <Grid container spacing={2} columns={{ xs: 1, sm: 1, md: 8, lg: 12 }}>
            {Array.from(Array(11)).map((_, index) => (
                <Grid item xs={2} sm={4} md={4} key={index}>
                    <Item
                        ID={index}
                        remove={setRemoveID}
                    />
                </Grid>
            ))}
        </Grid>

        <RemoveSoftwareDialog
            removeID={removeID}
            closeDialog={closeDialog}
            removeSoftware={removeSoftware}
        />



        <Fab
            color="primary"
            aria-label="add"
            variant="extended"
            size="medium"
            sx={{
                position: "fixed",
                bottom: (theme) => theme.spacing(2),
                right: (theme) => theme.spacing(2)
            }}
            component={LinkRoute}
            to={"/softwares/new"}
        >
            <AddIcon sx={{ mr: 1 }} />
            New Software
        </Fab>

    </>
}



const RemoveSoftwareDialog = ({ removeID, closeDialog, removeSoftware }) => {
    return <Dialog
        open={removeID !== null}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">Remove Software</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to do this?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={closeDialog} color="info">No</Button>
            <Button onClick={removeSoftware} color="error" autoFocus>Yes! I'm sure</Button>
        </DialogActions>
    </Dialog>
}