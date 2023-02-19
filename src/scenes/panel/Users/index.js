/* eslint-disable react-hooks/exhaustive-deps */
import React from "react"


import SoftwareItem from "../../../components/SoftwareItem"
import * as API from "../../../api";
import { useSnackbar } from 'notistack';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import Layout from "../../../components/Layout"
import UserItem from "../../../components/UserItem";


const Page = () => {

    // eslint-disable-next-line no-unused-vars
    const [disabled, setDisabled] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const [users, setUsers] = React.useState([])
    const [total, setTotal] = React.useState(0)
    const [page, setPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(12)

    const [search, setSearch] = React.useState("")


    const { enqueueSnackbar } = useSnackbar()


    const [myProjects, setMyProjects] = React.useState([])
    const getMyProjects = async () => {
        try {
            const response = await API.GET()(`software/invite/`)
            setMyProjects(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }


    const getSoftwaresList = async () => {
        try {
            setLoading(true)
            setDisabled(true)

            let _s = search.length > 0 ? ("search=" + search) : ""
            let _p = "p=" + page + "&per=" + pageSize
            if (_s) _p = "&" + _p
            const m = `?${_s}${_p}`
            const response = await API.GET()(`auth/users/${m}`)
            setUsers(response.data?.results)
            setTotal(response.data.count)
            setLoading(false)
            setDisabled(false)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
            setLoading(false)
            setDisabled(false)
        }
    }



    const runApi = async () => {
        getSoftwaresList()
    }

    React.useEffect(() => {
        runApi()
    }, [page])

    React.useEffect(() => {
        const data = async () => {
            setDisabled(true)
            setLoading(true)
            await getSoftwaresList()
            await getMyProjects()
            setDisabled(false)
            setLoading(false)
        }
        data()
    }, [])

    return <Grid container spacing={2} columns={{ xs: 1, sm: 1, md: 8, lg: 12 }} sx={{ mb: 2 }}>
        <Grid xs={12} alignItems="center" justifyContent="space-between" container item spacing={1}>
            <Grid item xs={12} md>
                <Typography variant="h6">
                    Users
                </Typography>
            </Grid>
            <Grid item xs={12} md={3} >
                <FormControl sx={{ width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="search-box">Search...</InputLabel>
                    <OutlinedInput
                        id="search-box"
                        type='text'
                        disabled={disabled}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={runApi}
                                    edge="end"
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Search..."
                        value={search}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') runApi()
                        }}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </FormControl>
            </Grid>
        </Grid>
        {users.map((data, index) => (
            <Grid item xs={4} sm={4} md={2} key={index}>
                <UserItem
                    ID={0}
                    data={data}
                    disabled={disabled}
                    myProjects={myProjects}
                />
            </Grid>
        ))}
        {users.length > 0
            ? <Grid xs={12} alignItems="center" justifyContent="center" container item mb={2} mt={2}>
                <Pagination
                    count={Math.ceil(total / pageSize)}
                    page={page}
                    onChange={(e, num) => setPage(num)}
                    variant="outlined"
                    disabled={disabled}
                />
            </Grid>
            : ""
        }
        {!loading && users.length === 0
            ?
            <Layout>
                <Grid item lg={12} key={0}>
                    <Alert
                        variant='standard'
                        children="No user found"
                        severity="warning"
                    />
                </Grid>
            </Layout>
            : null
        }
    </Grid>
}

export default Page