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


const Page = () => {

    // eslint-disable-next-line no-unused-vars
    const [disabled, setDisabled] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    const [softwares, setSoftwares] = React.useState([])

    const [area, setArea] = React.useState([])
    const [areaList, setAreaList] = React.useState([])

    const [type, setType] = React.useState([])
    const [typeList, setTypeList] = React.useState([])

    const [search, setSearch] = React.useState("")

    const [total, setTotal] = React.useState(0)
    const [page, setPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(12)


    const { enqueueSnackbar } = useSnackbar()





    const getSoftwaresList = async () => {
        try {
            setLoading(true)
            setDisabled(true)
            let _a = (area.length > 0 && area.length < areaList.length) ? "area=" + area.join("&area=") : ""
            let _t = (type.length > 0 && type.length < typeList.length) ? "type=" + type.join("&type=") : ""
            let _s = search.length > 0 ? "search=" + search : ""
            let _p = "p=" + page + "&per=" + pageSize

            if (_a && _t) _t = "&" + _t
            if ((_a || _t) && _s) _s = "&" + _s
            if (_a || _t || _s) _p = "&" + _p

            const m = `?${_a}${_t}${_s}${_p}`
            const response = await API.GET()(`software/softs/${m}`)
            setSoftwares(response.data.results)
            setTotal(response.data.count)
            setLoading(false)
            setDisabled(false)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
            setLoading(false)
            setDisabled(false)
        }
    }

    const getAreasList = async () => {
        try {
            const response = await API.GET()(`software/area/`)
            setAreaList(response.data)
            setArea(response.data.map(({ id }) => id))
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getTypesList = async () => {
        const data = [
            { id: 'metric', name: 'Metric' },
            { id: 'comment', name: 'Comment' },
            { id: 'rating', name: 'Rating' },
            { id: 'compare', name: 'Compare' },
            { id: 'questionnaire', name: 'Questionnaire' },
        ]
        setTypeList(data)
        setType(data.map(({ id }) => id))
    }


    const runApi = async () => {
        getSoftwaresList()
    }


    React.useEffect(() => {
        runApi()
    }, [area, type])

    React.useEffect(() => {
        const data = async () => {
            setDisabled(true)
            setLoading(true)
            setTimeout(async () => {
                await getAreasList()
                await getTypesList()
                setDisabled(false)
                setLoading(false)
            }, 1000)
        }
        data()
    }, [])

    return <Grid container spacing={2} columns={{ xs: 1, sm: 1, md: 8, lg: 12 }} sx={{ mb: 2 }}>
        <Grid xs={12} alignItems="center" justifyContent="space-between" container item spacing={1} mb={1}>
            <Grid item xs={12} md>
                <Typography variant="h5">
                    Evaluations
                </Typography>
            </Grid>

            <Grid item xs={6} md={2}>
                <FormControl fullWidth >
                    <InputLabel>Type</InputLabel>
                    <Select
                        label="Type"
                        value={type}
                        onChange={(e) => {
                            let v = e.target.value
                            if (v.includes("ALL")) v = typeList.map(({ id }) => id)
                            setType(v)
                        }}
                        disabled={disabled}
                        multiple
                    >
                        <MenuItem value="ALL"><em>All</em></MenuItem>
                        {typeList.map(({ id, name }) => <MenuItem value={id}>{name}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
                <FormControl fullWidth >
                    <InputLabel>Area</InputLabel>
                    <Select
                        label="Area"
                        value={area}
                        onChange={(e) => {
                            let v = e.target.value
                            if (v.includes("ALL")) v = areaList.map(({ id }) => id)
                            setArea(v)
                        }}
                        disabled={disabled}
                        multiple
                    >
                        <MenuItem value="ALL"><em>All</em></MenuItem>
                        {areaList.map(({ id, name }) => <MenuItem value={id}>{name}</MenuItem>)}
                    </Select>
                </FormControl>
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

        {Array.from(loading ? Array(3) : softwares).map((data, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
                <SoftwareItem
                    ID={0}
                    data={data}
                />
            </Grid>
        ))}
        {softwares.length > 0
            ?
            <Grid xs={12} alignItems="center" justifyContent="center" container item mb={2} mt={2}>
                <Pagination
                    count={Math.ceil(total / pageSize)}
                    page={page}
                    onChange={(e, num) => setPage(num)}
                    variant="outlined"
                    disabled={disabled}
                />
            </Grid>
            :
            ""
        }
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