/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react"
import { TextField, Button, Checkbox, InputLabel, MenuItem, Select, FormControlLabel, Typography, Grid, Card, Link, FormControl, InputAdornment } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { Link as LinkRoute, useHistory } from "react-router-dom"
import { useState } from "react";
import Logo from "../../components/Logo"
import * as API from "../../api";
import { useSnackbar } from 'notistack';
import validex from 'validex'
import TermsDialog from "../../components/TermsDialog"


const SignUp = () => {

    const { enqueueSnackbar } = useSnackbar()
    const history = useHistory()

    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const [openDialogTerms, setOpenDialogTerms] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [degree, setDegree] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);


    const [degreesList, setDegreesList] = useState([]);


    const getDegreesList = async () => {
        setDisabled(true)
        try {
            const response = await API.GET(false)('auth/degree/')
            setDegreesList(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
        setDisabled(false)
    }



    React.useEffect(() => {
        getDegreesList()
    }, [])

    const submit = async () => {

        if (!acceptTerms) {
            return enqueueSnackbar("You must accept terms", { variant: "error" })
        }



        const data = {
            first_name: firstName,
            last_name: lastName,
            username: username,
            email: email,
            phone_number: phoneNumber,
            degree: degree,
            password1: password,
            password2: password,
        }
        const schema = {
            first_name: {
                nameAlias: "First Name",
                required: true,
                type: 'string',
                min: 3,
            },
            last_name: {
                nameAlias: "Last Name",
                required: true,
                type: 'string',
                min: 3,
            },
            username: {
                nameAlias: "Username",
                required: true,
                type: 'string',
                min: 3,
            },
            email: {
                nameAlias: "Email",
                required: true,
                type: 'string',
                email: true,
            },
            phone_number: {
                nameAlias: "Phone Number",
                required: true,
                min: 10,
                max: 10,
            },
            password1: {
                nameAlias: "Password",
                required: true,
                type: 'string',
                mediumPassword: true,
            },
        }

        const validator = validex(data, schema)
        const isValidate = validator.validate()

        if (!isValidate) {
            const errors = validator.getError()
            return enqueueSnackbar(Object.values(errors)[0], { variant: "error" })
        }

        setDisabled(true)
        setLoading(true)


        data.phone_number = '+98' + data.phone_number

        try {
            await API.POST(false)('auth/register/', data)
            setLoading(false)
            localStorage.setItem('PhoneVerify', data.phone_number)
            enqueueSnackbar("Verify Code sent", { variant: 'success' })
            history.push('/auth/verify/')
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
            setDisabled(false)
            setLoading(false)
        }
    }



    return (
        <Card sx={{ maxWidth: 300, padding: 7, margin: "50px auto" }}>
            <Grid container direction="column">
                <Logo />
                <Typography align="center" variant="h6">Sign up</Typography>
                <TextField
                    label="First name"
                    variant="filled"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value) }}
                    disabled={disabled}
                />
                <TextField
                    label="Last name"
                    variant="filled"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value) }}
                    disabled={disabled}
                />
                <FormControl
                    variant="filled"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                >
                    <InputLabel>Degree</InputLabel>
                    <Select
                        label="Degree"
                        value={degree}
                        onChange={(e) => { setDegree(e.target.value) }}
                        disabled={disabled}
                    >

                        {degreesList.map(({ id, title }) => <MenuItem value={id}>{title}</MenuItem>)}
                        {degreesList.length === 0 ? <MenuItem value={null} disabled>Not found</MenuItem> : null}
                    </Select>
                </FormControl>
                <TextField
                    label="Username"
                    variant="filled"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    value={username}
                    onChange={(e) => { setUsername(e.target.value) }}
                    disabled={disabled}
                    autoComplete="false"
                />
                <TextField
                    label="Email"
                    variant="filled"

                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                    disabled={disabled}
                    autoComplete="false"
                />



                <TextField
                    label="Phone number"
                    variant="filled"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">+98</InputAdornment>,
                    }}
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => { setPhoneNumber(e.target.value) }}
                    disabled={disabled}
                    autoComplete="false"
                />

                <TextField
                    label="Password"
                    variant="filled"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    type="password"

                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                    disabled={disabled}
                    autoComplete="false"
                />

                <FormControlLabel
                    label={<>
                        I agree to all <Link component={LinkRoute} to="#" onClick={() => setOpenDialogTerms(true)}>terms and conditions.</Link>
                    </>}
                    control={<Checkbox />}
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    disabled={disabled}

                />
                <LoadingButton
                    variant="contained"
                    size="large"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    children="Sign Up"
                    onClick={submit}
                    disabled={disabled}
                    loading={loading}
                />
                <Button
                    component={LinkRoute}
                    to="/auth/signin"
                    size="small"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    children="Sign in instead"
                    disabled={disabled}
                />
            </Grid>
            <TermsDialog
                {...{
                    open: openDialogTerms,
                    handleClose: () => setOpenDialogTerms(false)
                }}
            />
        </Card>
    );


}
export default SignUp; 