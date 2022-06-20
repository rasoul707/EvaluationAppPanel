import { TextField, Button, Typography, Alert, Link } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { Link as LinkRoute, useHistory } from "react-router-dom"
import { useState } from "react";
import Logo from "../../components/_Logo"
import * as api from "../../api";


const PhoneVerification = ({ phoneNumber }) => {

    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successAlert, setSuccessAlert] = useState(false);


    const [otp, setOtp] = useState('');

    const history = useHistory();


    const submit = async () => {
        setDisabled(true)
        setLoading(true)
        const data = { otp }
        try {
            await api.checkPhoneVerify(data)
            setError("")
            setLoading(false)
            setSuccessAlert(true)

            localStorage.removeItem("signup_isPhoneVerifyStep")
            localStorage.removeItem("signup_PhoneNumber")

            history.replace("/auth/signin")

        } catch (error) {
            setError(JSON.stringify(error.data.message))
            setDisabled(false)
            setLoading(false)
        }
    }


    // const resend = () => {
    // await api.checkPhoneVerify(data)
    // }


    return (
        <div className="auth-card">
            <Logo />
            <Typography align="center" variant="h6" className="mart15 marb15" style={{ color: "#4e4e4e" }}>Verify phone number</Typography>
            {error !== "" ? <Alert severity="error">{error}</Alert> : null}
            {successAlert ? <Alert severity="success">Phone verified</Alert> : null}
            <TextField
                label="Phone number"
                variant="filled"
                className="mart15"
                value={phoneNumber}
                disabled={true}
            />
            <TextField
                label="Verify Code"
                variant="filled"
                className="mart15"
                value={otp}
                onChange={(e) => { setOtp(e.target.value) }}
                disabled={disabled}
            />
            <Link
                href="#"
                className="mart15"
                children="Resend"
                variant="subtitle2"
                underline="none"
                onClick={() => alert("I'm not working yet :(")}
                disabled
            />
            <LoadingButton
                variant="contained"
                size="large"
                className="mart15"
                children="Verify"
                onClick={submit}
                disabled={disabled}
                loading={loading}
            />
            <Button
                component={LinkRoute}
                to="/auth/signin"
                size="small"
                className="mart15"
                children="Sign in"
                disabled={true}
            />
        </div>
    );


}

export default PhoneVerification; 