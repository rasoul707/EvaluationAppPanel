/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Alert from '@mui/material/Alert';

import AddIcon from '@mui/icons-material/Add';
import { Link as LinkRoute } from "react-router-dom"


import * as API from "../../../api";
import { useSnackbar } from 'notistack';

import SoftwareItem from "../../../components/SoftwareItem"

import Layout from "../../../components/Layout"


export default function SoftwaresList() {

    // eslint-disable-next-line no-unused-vars
    const [disabled, setDisabled] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const [softwares, setSoftwares] = React.useState([])

    const { enqueueSnackbar } = useSnackbar()





    const getSoftwaresList = async () => {
        try {
            const response = await API.GET()(`software/`)
            setSoftwares(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
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

        <Grid container spacing={2} columns={{ xs: 1, sm: 1, md: 8, lg: 12 }} sx={{ mb: 2 }}>
            {Array.from(loading ? Array(3) : softwares).map((data, index) => (
                <Grid item xs={2} sm={4} md={4} key={index}>
                    <SoftwareItem
                        ID={0}
                        data={data}
                        isMySoftware
                    />
                </Grid>
            ))}
            {!loading && softwares.length === 0
                ?
                <Layout>
                    <Alert
                        variant='standard'
                        children="You have not active software"
                        severity="warning"
                        action={<Button color="inherit" size="small" component={LinkRoute} to={"/softwares/new"}>Add</Button>}
                    />
                </Layout>
                : null
            }
        </Grid>

        {/* <Pagination count={10} max={10} runner={() => { }} /> */}









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






