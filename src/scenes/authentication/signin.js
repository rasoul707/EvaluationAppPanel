import { TextField, Button, Typography, Alert } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { Link as LinkRoute } from "react-router-dom"
import { useState } from "react";
import Logo from "../../components/_Logo"
import * as api from "../../api";



const SignIn = () => {

    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successAlert, setSuccessAlert] = useState(false);


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const submit = async () => {
        setDisabled(true)
        setLoading(true)
        setSuccessAlert(false)
        setError("")

        const data = {
            username: email,
            password: password
        }

        try {
            const response = await api.signIn(data)
            setError("")
            setLoading(false)
            setSuccessAlert(true)

            localStorage.setItem("token", response.data.token);

            setTimeout(() => {
                window.location.reload();
            }, 1000)

        } catch (error) {
            setError(JSON.stringify(error.data.message))
            setSuccessAlert(false)
            setDisabled(false)
            setLoading(false)
        }

    }

    return (
        <div className="auth-card">
            <Logo />
            <Typography align="center" variant="h6" className="mart15 marb15" style={{ color: "#4e4e4e" }}>Sign in</Typography>
            {error !== "" ? <Alert severity="error">{error}</Alert> : null}
            {successAlert ? <Alert severity="success">Login successfully</Alert> : null}
            <TextField
                label="Email"
                variant="filled"
                className="mart15"
                autoComplete={true}
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                disabled={disabled}
            />
            <TextField
                label="Password"
                variant="filled"
                className="mart15"
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
                className="mart15"
                children="Login"
                onClick={submit}
                disabled={disabled}
                loading={loading}
            />
            <Button
                component={LinkRoute}
                to="/auth/signup"
                size="small"
                className="mart15"
                children="Create account"
                disabled={disabled}
            />
        </div>
    );


}
export default SignIn; 