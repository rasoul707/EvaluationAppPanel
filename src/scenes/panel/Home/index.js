/* eslint-disable react-hooks/exhaustive-deps */
import React from "react"


import SoftwareItem from "../../../components/SoftwareItem"
import UserItem from "../../../components/UserItem"
import * as API from "../../../api";
import { useSnackbar } from 'notistack';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Layout from "../../../components/Layout"


const Page = () => {

    // eslint-disable-next-line no-unused-vars
    const [disabled, setDisabled] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const [softwares, setSoftwares] = React.useState([])
    const [users, setUsers] = React.useState([])

    const { enqueueSnackbar } = useSnackbar()





    const getSoftwaresList = async () => {
        try {
            const response = await API.GET()(`software/softs/?top=true`)
            setSoftwares(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getUsersList = async () => {
        try {
            const response = await API.GET()(`auth/users/?top=true`)
            setUsers(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const [myProjects, setMyProjects] = React.useState([])
    const getMyProjects = async () => {
        try {
            const response = await API.GET()(`software/invite/`)
            setMyProjects(response.data)
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
                await getUsersList()
                await getMyProjects()
                setDisabled(false)
                setLoading(false)
            }, 1000)
        }
        data()
    }, [])

    return <Grid container spacing={2} columns={{ xs: 1, sm: 1, md: 8, lg: 12 }} sx={{ mb: 2 }}>
        {loading ?
            <Grid item lg={12} key={0}>
                <Alert
                    variant='standard'
                    children="Loading..."
                    severity="info"
                />
            </Grid>
            :
            <>
                <Grid xs={12} alignItems="center" justifyContent="space-between" container item spacing={1} >
                    <Grid alignItems="center" justifyContent="space-between" container item xs={12} >
                        <Typography variant="h6">
                            Users
                        </Typography>
                        <Button
                            component={Link}
                            href={"/users"}
                            children="All users..."
                        />
                    </Grid>
                </Grid>

                {users.map((data, index) => (
                    <Grid item xs={4} sm={4} md={2} key={index}>
                        <UserItem
                            ID={0}
                            data={data}
                            myProjects={myProjects}
                        />
                    </Grid>
                ))}
                {!loading && users.length === 0 ?
                    <Grid item lg={12} key={0}>
                        <Alert
                            variant='standard'
                            children="No user found"
                            severity="warning"
                        />
                    </Grid>
                    : null
                }
                <Grid xs={12} alignItems="center" justifyContent="space-between" container item spacing={1} mt={2}>
                    <Grid alignItems="center" justifyContent="space-between" container item xs={12} >
                        <Typography variant="h6">
                            Evaluations
                        </Typography>
                        <Button
                            component={Link}
                            href={"/evaluations"}
                            children="All evaluations..."
                        />
                    </Grid>
                </Grid>
                {softwares.map((data, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <SoftwareItem
                            ID={0}
                            data={data}
                        />
                    </Grid>
                ))}
                {!loading && softwares.length === 0 ?
                    <Grid item lg={12} key={0}>
                        <Alert
                            variant='standard'
                            children="No software found"
                            severity="warning"
                        />
                    </Grid>
                    : null
                }
            </>}
    </Grid>




}

export default Page