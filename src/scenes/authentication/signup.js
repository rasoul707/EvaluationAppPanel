import { TextField, Button, Checkbox, FormControlLabel, Typography, Select, MenuItem, FormControl, InputLabel, Grid, Card } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { Link as LinkRoute } from "react-router-dom"
import { useEffect, useState } from "react";
import Logo from "../../components/_Logo"
import * as api from "../../api";
import PhoneVerification from "./phoneVerification"
import { useSnackbar } from 'notistack';
import validex from 'validex'



const SignUp = () => {

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);


    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [degrees, setDegrees] = useState([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [acceptTerms, setAcceptTerms] = useState('');

    const [degreesList, setDegreesList] = useState([]);

    const [isPhoneVerifyStep, setIsPhoneVerifyStep] = useState(localStorage.getItem("signup_isPhoneVerifyStep"));

    const submit = async () => {

        if (!acceptTerms) {
            return enqueueSnackbar("You must accept terms", { variant: "error" })
        }



        const data = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            phone_number: phoneNumber,
            degrees: degrees,
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
            email: {
                nameAlias: "Email",
                required: true,
                type: 'string',
                email: true,
            },
            password: {
                nameAlias: "Password",
                required: true,
                type: 'string',
                mediumPassword: true,
                equal: [confirmPassword, new Error("$fields not match")],
            },
            phone_number: {
                nameAlias: "Phone number",
                required: true,
                type: 'string',
                regex: [
                    /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g,
                    new Error("$field is not valid")
                ],
            },
        }

        const validator = validex(data, schema)
        const isValidate = validator.validate()

        if (!isValidate) {
            const errors = validator.getError()
            Object.values(errors).reverse().map((errorText) => {
                return enqueueSnackbar(errorText, { variant: "error" })
            })
            return
        }



        setDisabled(true)
        setLoading(true)



        try {
            await api.signUp(data)
            enqueueSnackbar("Good, you must verify your phone number", { variant: 'success' })
            setLoading(false)
            setIsPhoneVerifyStep(true)
        } catch (error) {
            enqueueSnackbar("[signUp]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
            setDisabled(false)
            setLoading(false)
        }
    }

    const getDegreesList = async () => {
        setDisabled(true)

        try {
            const response = await api.getDegreesList()
            setDegreesList(response.data)
        } catch (error) {
            enqueueSnackbar("[getDegreesList]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
        }
        setDisabled(false)
    }


    useEffect(() => { getDegreesList() }, [])

    useEffect(() => {
        if (isPhoneVerifyStep && !localStorage.getItem("signup_isPhoneVerifyStep")) {
            localStorage.setItem("signup_isPhoneVerifyStep", true)
            localStorage.setItem("signup_PhoneNumber", phoneNumber)
        }
        if (localStorage.getItem("signup_PhoneNumber") !== phoneNumber) {
            setPhoneNumber(localStorage.getItem("signup_PhoneNumber"))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPhoneVerifyStep])

    if (isPhoneVerifyStep) {
        return <PhoneVerification phoneNumber={phoneNumber} />
    }


    return (
        <Card sx={{ width: 300, padding: 7, margin: "50px auto" }}>
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
                    <InputLabel>Degrees</InputLabel>
                    <Select
                        label="Degrees"
                        value={degrees}
                        onChange={(e) => { setDegrees(e.target.value) }}
                        multiple
                        disabled={disabled}
                    >
                        {degreesList.map(({ id, degree }) => <MenuItem value={id}>{degree}</MenuItem>)}
                        {degreesList.length === 0 ? <MenuItem value={null} disabled>Not found</MenuItem> : null}
                    </Select>
                </FormControl>
                <TextField
                    label="Email"
                    variant="filled"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                    disabled={disabled}
                />
                <TextField
                    label="Password"
                    variant="filled"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                    disabled={disabled}
                />
                <TextField
                    label="Confirm password"
                    variant="filled"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value) }}
                    disabled={disabled}
                />
                <TextField
                    label="Phone number"
                    helperText="+9892××××××××"
                    variant="filled"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    value={phoneNumber}
                    onChange={(e) => { setPhoneNumber(e.target.value) }}
                    disabled={disabled}
                />
                <FormControlLabel
                    label="I agree to all terms and conditions."
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
        </Card>
    );


}
export default SignUp; 