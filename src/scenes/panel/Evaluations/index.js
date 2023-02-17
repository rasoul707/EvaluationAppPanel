/* eslint-disable react-hooks/exhaustive-deps */
import React from "react"


import SoftwareItem from "../../../components/SoftwareItem"
import * as API from "../../../api";
import { useSnackbar } from 'notistack';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


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

    return <Grid container spacing={2} columns={{ xs: 1, sm: 1, md: 8, lg: 12 }} sx={{ mb: 2 }}>
        <Typography mb={2}>
            Evaluations
        </Typography>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={'text'}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            // onClick={handleClickShowPassword}
                            // onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            <Visibility />
                            {/* {showPassword ? <VisibilityOff /> : <Visibility />} */}
                        </IconButton>
                    </InputAdornment>
                }
                label="Password"
            />
        </FormControl>
        {Array.from(loading ? Array(3) : softwares).map((data, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
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