/* eslint-disable react-hooks/exhaustive-deps */
import { TextField, Button, Typography, Grid, Card, } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { useHistory } from "react-router-dom"
import { useState, useEffect } from "react";
import Logo from "../../components/Logo"
import * as API from "../../api";
import { useSnackbar } from 'notistack';



const PhoneVerification = ({ noSpace, phoneVerify, callback }) => {

    const { enqueueSnackbar } = useSnackbar()

    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(null);


    const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem('PhoneVerify'));
    const [otp, setOtp] = useState('');

    const history = useHistory();


    const submit = async () => {
        setDisabled(true)
        setLoading(true)
        const data = { otp }

        try {
            await API.POST(false)('auth/verify/phone/', data)
            setLoading(false)

            enqueueSnackbar("Phone verified successfully.", { variant: 'success' })

            localStorage.removeItem('PhoneVerify')
            localStorage.removeItem('PhoneVerifyTimer')

            setTimeout(() => {
                if (callback) callback()
                else history.replace("/auth/signin")
            }, 1000)

        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
            setDisabled(false)
            setLoading(false)
        }
    }

    const startTimer = (sec) => {
        sec = parseInt(sec)
        if (sec <= 0) return
        setResendTimer(sec)
        localStorage.setItem('PhoneVerifyTimer', sec)
        const ins = setInterval(() => {
            sec = sec - 1
            setResendTimer(sec)
            localStorage.setItem('PhoneVerifyTimer', sec)
            if (sec <= 0) clearInterval(ins)
        }, 1000)
    }

    const resendCode = async () => {
        setDisabled(true)
        setLoading(true)

        const data = { phone_number: phoneNumber }
        try {
            await API.POST(false)('auth/verify/phone/resend/', data)
            enqueueSnackbar("Verify Code sent", { variant: 'success' })
            startTimer(120)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }

        setDisabled(false)
        setLoading(false)
    }

    useEffect(() => {
        const s = localStorage.getItem('PhoneVerifyTimer')
        if (!phoneNumber) {
            if (phoneVerify) {
                setPhoneNumber(phoneVerify)
                startTimer(s)
            }
            else history.replace('/')
        }
        else {
            startTimer(s)
        }
    }, [])





    return (
        <Card sx={{ width: 300, padding: 7, margin: noSpace ? null : "50px auto" }}>
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
                <Button
                    size="small"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    children={"Resend " + (resendTimer ? "(" + resendTimer + ")" : "")}

                    onClick={resendCode}
                    disabled={resendTimer > 0}
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

            </Grid>
        </Card>
    );


}

export default PhoneVerification; 