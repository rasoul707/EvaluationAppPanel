/* eslint-disable react-hooks/exhaustive-deps */
import React from "react"


import SoftwareItem from "../../../components/SoftwareItem"
import * as API from "../../../api";
import { useSnackbar } from 'notistack';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Layout from "../../../components/Layout"


const Page = () => {

    // eslint-disable-next-line no-unused-vars
    const [disabled, setDisabled] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const [softwares, setSoftwares] = React.useState([])

    const { enqueueSnackbar } = useSnackbar()





    const getSoftwaresList = async () => {
        try {
            const response = await API.GET()(`software/softs/`)
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

    return <Grid container spacing={2} sx={{ mb: 2 }}>
        {Array.from(loading ? Array(3) : softwares).map((data, index) => (
            <Grid item xs={6} sm={4} md={4} lg={4} key={index}>
                <SoftwareItem
                    ID={0}
                    data={data}
                />
            </Grid>
        ))}
        {!loading && softwares.length === 0
            ?
            <Layout>
                <Grid item lg={12} key={0}>
                    <Alert
                        variant='standard'
                        children="No software found"
                        severity="warning"
                    />
                </Grid>
            </Layout>
            : null
        }
    </Grid>
}

export default Page