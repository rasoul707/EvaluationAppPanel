import * as React from "react"
import { TextField, Button, Typography, Grid, Card, Alert } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { Link as LinkRoute, } from "react-router-dom"
import { useState } from "react";
import Logo from "../../components/Logo"
import * as API from "../../api";
import { useSnackbar } from 'notistack';
import validex from 'validex'


const ForgetPassword = () => {

    const { enqueueSnackbar } = useSnackbar()


    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);


    const [email, setEmail] = useState('');


    const [showSuccessAlert, setShowSuccessAlert] = useState(false);




    const submit = async () => {

        const data = {
            email: email,
        }
        const schema = {
            email: {
                nameAlias: "Email",
                required: true,
                type: 'string',
                email: true,
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

        try {
            await API.POST(false)('auth/password/reset/', data)
            setLoading(false)

            enqueueSnackbar("Password reset e-mail has been sent. Check your inbox", { variant: 'success' })

            setShowSuccessAlert(true)



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
                <Typography align="center" variant="h6" style={{ color: "#4e4e4e" }}>Forget password</Typography>
                {showSuccessAlert && <Alert >Password reset e-mail has been sent. Check your inbox</Alert>}
                <TextField
                    label="Email"
                    variant="filled"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    autoComplete="true"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                    disabled={disabled}
                />
                <LoadingButton
                    variant="contained"
                    size="large"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    children="Submit"
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
                // disabled={disabled}
                />
            </Grid>
        </Card>
    );


}
export default ForgetPassword; 