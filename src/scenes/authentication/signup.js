import { TextField, Button, Checkbox, FormControlLabel, Alert, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { Link as LinkRoute } from "react-router-dom"
import { useEffect, useState } from "react";
import Logo from "../../components/_Logo"
import * as api from "../../api";
import PhoneVerification from "./phoneVerification"




const SignUp = () => {

    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successAlert, setSuccessAlert] = useState(false);


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
        // must accept terms
        if (!acceptTerms) {
            setError("You must agree to all terms and conditions")
            return;
        }
        if (password !== confirmPassword) {
            setError("Password not match")
            return;
        }


        setDisabled(true)
        setLoading(true)
        setError("")
        setSuccessAlert(false)
        const data = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            phone_number: phoneNumber,
            degrees: degrees,
        }

        try {
            await api.signUp(data)
            setLoading(false)
            setSuccessAlert(true)

            setIsPhoneVerifyStep(true)

        } catch (error) {
            setError(JSON.stringify(error.data.message))
            setSuccessAlert(false)
            setDisabled(false)
            setLoading(false)
        }
    }

    const getDegreesList = async () => {
        setDisabled(true)
        setLoading(true)

        try {
            const response = await api.getDegreesList()
            setDegreesList(response.data)
            setError("")
        } catch (error) {
            setError(JSON.stringify(error.data.message))
        }

        setSuccessAlert(false)
        setDisabled(false)
        setLoading(false)
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
        <div className="auth-card">
            <Logo />
            <Typography align="center" variant="h6" className="mart15 marb15" style={{ color: "#4e4e4e" }}>Sign up</Typography>
            {error !== "" ? <Alert severity="error">{error}</Alert> : null}
            {successAlert ? <Alert severity="success">Account created successfully</Alert> : null}
            <TextField
                label="First name"
                variant="filled"
                className="mart15"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value) }}
                disabled={disabled}
            />
            <TextField
                label="Last name"
                variant="filled"
                className="mart15"
                value={lastName}
                onChange={(e) => { setLastName(e.target.value) }}
                disabled={disabled}
            />
            <FormControl variant="filled" className="mart15">
                <InputLabel>Degrees</InputLabel>
                <Select
                    value={degrees}
                    onChange={(e) => { setDegrees(e.target.value) }}
                    multiple
                    disabled={disabled}
                >
                    {degreesList.map(({ id, degree }) => <MenuItem value={id}>{degree}</MenuItem>)}
                    {degreesList.length === 0 ? <MenuItem value={0} disabled>Not found</MenuItem> : null}
                </Select>
            </FormControl>
            <TextField
                label="Email"
                variant="filled"
                className="mart15"
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                disabled={disabled}
            />
            <TextField
                label="Password"
                variant="filled"
                className="mart15"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
                disabled={disabled}
            />
            <TextField
                label="Confirm password"
                variant="filled"
                className="mart15"
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value) }}
                disabled={disabled}
            />
            <TextField
                label="Phone number"
                helperText="+9892××××××××"
                variant="filled"
                className="mart15"
                value={phoneNumber}
                onChange={(e) => { setPhoneNumber(e.target.value) }}
                disabled={disabled}
            />
            <FormControlLabel
                label="I agree to all terms and conditions."
                control={<Checkbox />}
                className="mart15"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={disabled}
            />
            <LoadingButton
                variant="contained"
                size="large"
                className="mart15"
                children="Sign Up"
                onClick={submit}
                disabled={disabled}
                loading={loading}
            />
            <Button
                component={LinkRoute}
                to="/auth/signin"
                size="small"
                className="mart15"
                children="Sign in instead"
                disabled={disabled}
            />
        </div>
    );


}
export default SignUp; 