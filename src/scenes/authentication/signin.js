import { TextField, Button, Typography, Alert } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { Link as LinkRoute } from "react-router-dom"
import { useState } from "react";
import Logo from "../../components/_Logo"
import * as api from "../../api";
import { useSnackbar } from 'notistack';
import validex from 'validex'


const SignIn = () => {

    const { enqueueSnackbar, closeSnackbar } = useSnackbar()

    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');




    const submit = async () => {

        const data = {
            username: email,
            password: password
        }
        const schema = {
            username: {
                nameAlias: "Email",
                required: true,
                type: 'string',
                email: true,
            },
            password: {
                nameAlias: "Password",
                required: true,
                type: 'string',
                mediumPassword: true
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
            const response = await api.signIn(data)
            setLoading(false)

            localStorage.setItem("token", response.data.token);
            enqueueSnackbar("Welcome :) Please wait...", { variant: 'success' })

            setTimeout(() => {
                window.location.reload();
            }, 1000)

        } catch (error) {
            enqueueSnackbar("[signIn]: ".toUpperCase() + JSON.stringify(error?.data?.message), { variant: 'error' })
            setDisabled(false)
            setLoading(false)
        }

    }

    return (
        <div className="auth-card">
            <Logo />
            <Typography align="center" variant="h6" style={{ color: "#4e4e4e" }}>Sign in</Typography>
            <TextField
                label="Email"
                variant="filled"
                sx={{ marginTop: (theme) => theme.spacing(2) }}
                autoComplete={true}
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                disabled={disabled}
            />
            <TextField
                label="Password"
                variant="filled"
                sx={{ marginTop: (theme) => theme.spacing(2) }}
                autoComplete={true}
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
                disabled={disabled}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
            <LoadingButton
                variant="contained"
                size="large"
                sx={{ marginTop: (theme) => theme.spacing(2) }}
                children="Login"
                onClick={submit}
                disabled={disabled}
                loading={loading}
            />
            <Button
                component={LinkRoute}
                to="/auth/signup"
                size="small"
                sx={{ marginTop: (theme) => theme.spacing(2) }}
                children="Create account"
                disabled={disabled}
            />
        </div>
    );


}
export default SignIn; 