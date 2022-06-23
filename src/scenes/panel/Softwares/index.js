import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Rating from '@mui/material/Rating';


import AddIcon from '@mui/icons-material/Add';

import { Link as LinkRoute } from "react-router-dom"


import * as api from "../../../api";
import { useSnackbar } from 'notistack';





export default function SoftwaresList() {

    const [disabled, setDisabled] = React.useState(false)
    const [loading, setLoading] = React.useState(false)


    const [removeID, setRemoveID] = React.useState(null)
    const [softwares, setSoftwares] = React.useState([])

    const closeDialog = () => setRemoveID(null)
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()



    // not remove just de_active
    const removeSoftware = async () => {
        const softwareID = removeID;
        closeDialog()
        if (softwareID) {
            try {
                await api.deleteSoftware(softwareID)
                enqueueSnackbar("Deleted successfully", { variant: 'success' })
                await getSoftwaresList()
            } catch (error) {
                enqueueSnackbar("[removeSoftware]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
            }
        }
    }

    const getSoftwaresList = async () => {
        try {
            const response = await api.getSoftwaresList()
            setSoftwares(response.data)
        } catch (error) {
            enqueueSnackbar("[getSoftwaresList]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }
    }

    React.useEffect(() => {
        const data = async () => {
            setDisabled(true)
            setLoading(true)
            setTimeout(async () => {
                await getSoftwaresList()
                setDisabled(false)
                setLoading(false)
            }, 1000)
        }
        data()
    }, [])




    return <>

        <Grid container spacing={2} columns={{ xs: 1, sm: 1, md: 8, lg: 12 }}>
            {Array.from(loading ? Array(3) : softwares).map((data, index) => (
                <Grid item xs={2} sm={4} md={4} key={index}>
                    <Item
                        ID={0}
                        remove={setRemoveID}
                        data={data}
                    />
                </Grid>
            ))}
            {!loading && softwares.length === 0
                ?
                <Grid item lg={12} key={0}>
                    <Alert
                        variant='standard'
                        children="You have not active software"
                        severity="warning"
                        action={<Button color="inherit" size="small" component={LinkRoute} to={"/softwares/new"}>Add</Button>}
                    />
                </Grid>
                : null
            }
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
            size="large"
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



const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

const Item = ({ remove, data }) => {
    const isLoading = !data
    return <Paper
        sx={{
            p: 2,
            margin: 'auto',
            flexGrow: 1,
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
    >

        <Grid container spacing={2} justifyContent="center">
            <Grid item>
                {isLoading
                    ?
                    <Skeleton animation="wave" variant='rectangular' width={128} height={128} />
                    :
                    <Img alt="complex" src={data.image?.medium} sx={{ width: 128, height: 128 }} />
                }
            </Grid>

            <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                        <Typography gutterBottom variant="subtitle1" component="div">
                            {isLoading
                                ?
                                <Skeleton animation="wave" variant='text' />
                                :
                                data.software_name
                            }
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {isLoading
                                ?
                                <Skeleton animation="wave" variant='text' />
                                :
                                "Area: " + data.area.area_name
                            }
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {isLoading
                                ?
                                <Skeleton animation="wave" variant='text' />
                                :
                                "ID: " + data.id
                            }
                        </Typography>
                    </Grid>
                    <Grid item xs container direction="row" spacing={1}>
                        <Grid item>
                            {isLoading
                                ?
                                <Skeleton animation="wave" variant='rectangular' sx={{ borderRadius: 1 }} children={<Button children="Edit" />} />
                                :
                                <Button
                                    children={"Edit"}
                                    color="info"
                                    component={LinkRoute}
                                    to={`/softwares/${data.id}`}
                                />
                            }
                        </Grid>
                        <Grid item>
                            {isLoading
                                ?
                                <Skeleton animation="wave" variant='rectangular' sx={{ borderRadius: 1 }} children={<Button children="Result" />} />
                                :
                                <Button
                                    children="Result"
                                    color="success"
                                    component={LinkRoute}
                                    to={`/softwares/${data.id}/result`}
                                />
                            }
                        </Grid>
                        <Grid item>
                            {isLoading
                                ?
                                <Skeleton animation="wave" variant='rectangular' sx={{ borderRadius: 1 }} children={<Button children="Remove" />} />
                                :
                                <Button
                                    children="Remove"
                                    color="error"
                                    onClick={() => remove(data.id)}
                                />
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item sx={{ position: "relative" }}>
                    {data?.rating ? <Rating value={data.rating} precision={0.5} readOnly sx={{ position: "absolute", right: 0 }} /> : null}
                </Grid>
            </Grid>


        </Grid>
    </Paper>
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