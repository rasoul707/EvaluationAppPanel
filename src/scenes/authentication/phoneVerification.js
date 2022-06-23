import { TextField, Button, Typography, Grid, Card, Link } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { Link as LinkRoute, useHistory } from "react-router-dom"
import { useState } from "react";
import Logo from "../../components/_Logo"
import * as api from "../../api";
import { useSnackbar } from 'notistack';



const PhoneVerification = ({ phoneNumber }) => {

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);


    const [otp, setOtp] = useState('');

    const history = useHistory();


    const submit = async () => {
        setDisabled(true)
        setLoading(true)
        const data = { otp }
        try {
            await api.checkPhoneVerify(data)
            setLoading(false)

            enqueueSnackbar("Phone verified successfully. Redirecting...", { variant: 'success' })

            localStorage.removeItem("signup_isPhoneVerifyStep")
            localStorage.removeItem("signup_PhoneNumber")

            setTimeout(() => {
                history.replace("/auth/signin")
            }, 1000)

        } catch (error) {
            enqueueSnackbar("[checkPhoneVerify]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
            setDisabled(false)
            setLoading(false)
        }
    }


    // const resend = () => {
    // await api.checkPhoneVerify(data)
    // }


    return (
        <Card sx={{ width: 300, padding: 7, margin: "50px auto" }}>
            <Grid container direction="column">
                <Logo />
                <Typography align="center" variant="h6" style={{ color: "#4e4e4e" }}>Verify phone number</Typography>
                <TextField
                    label="Phone number"
                    variant="filled"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    value={phoneNumber}
                    disabled={true}
                />
                <TextField
                    label="Verify Code"
                    variant="filled"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value) }}
                    disabled={disabled}
                />
                <Link
                    href="#"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    children="Resend"
                    variant="subtitle2"
                    underline="none"
                    onClick={() => alert("I'm not working yet :(")}
                    disabled
                />
                <LoadingButton
                    variant="contained"
                    size="large"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    children="Verify"
                    onClick={submit}
                    disabled={disabled}
                    loading={loading}
                />
                <Button
                    component={LinkRoute}
                    to="/auth/signin"
                    size="small"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    children="Sign in"
                    disabled={true}
                />
            </Grid>
        </Card>
    );


}

export default PhoneVerification; 