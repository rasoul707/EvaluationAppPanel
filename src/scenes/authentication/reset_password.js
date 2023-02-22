import * as React from "react"
import { TextField, Typography, Grid, Card, } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { useParams, useHistory } from "react-router-dom"
import { useState } from "react";
import Logo from "../../components/Logo"
import * as API from "../../api";
import { useSnackbar } from 'notistack';
import validex from 'validex'


const ResetPassword = () => {

    const { enqueueSnackbar } = useSnackbar()


    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);


    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');


    const params = useParams()
    const history = useHistory()

    const submit = async () => {

        const data = {
            new_password1: newPassword1,
            new_password2: newPassword2,
            uid: params.uid,
            token: params.token
        }
        const schema = {
            new_password1: {
                nameAlias: "New password",
                required: true,
                type: 'string',
                mediumPassword: true,
            },
            new_password2: {
                nameAlias: "Confirm new password",
                required: true,
                equal: [newPassword1, new Error('Confirm password must be match')]
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
            await API.POST(false)('auth/password/reset/confirm/', data)
            setLoading(false)

            enqueueSnackbar("Password has been reset successfully", { variant: 'success' })

            setTimeout(() => {
                history.replace("/")
            }, 1000)

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
                <Typography align="center" variant="h6" style={{ color: "#4e4e4e" }}>Reset password</Typography>
                <TextField
                    label="New Password"
                    variant="filled"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    autoComplete="off"
                    type="text"
                    value={newPassword1}
                    onChange={(e) => { setNewPassword1(e.target.value) }}
                    disabled={disabled}
                />
                <TextField
                    label="Repeat New Password"
                    variant="filled"
                    sx={{ marginTop: (theme) => theme.spacing(2) }}
                    autoComplete="off"
                    type="text"
                    value={newPassword2}
                    onChange={(e) => { setNewPassword2(e.target.value) }}
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
            </Grid>
        </Card>
    );


}
export default ResetPassword; 