import React from 'react';
import { Grid,Paper,Box,Avatar,Button,Typography,Link as Nv } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {Link,NavLink} from "react-router-dom";
import { useState } from 'react';
import { ValidatorForm,TextValidator } from 'react-material-ui-form-validator';
import axios from 'axios';

const Register=() => {
    const paperStyle={padding :20,height:'70vh',width:280,margin:"60px auto"}
    const avatarStyle={backgroundColor:'#6d7f9f'}
    const btnstyle={marginTop:'28px',backgroundColor:'#6d7f9f'}

    const [user,setUser] = useState({
        otp:"",
    });

    const [phoneNumber, setPhoneNumber] = useState('6565656565')

    const [verificationCode, setVerificationCode] = useState('')

    const [enteredVerifCode, setEnteredVerifCode] = useState('')

    const {fname,lname,email,phone} = user;

    const handleChange = e =>{
        setUser({...user,[e.target.name]:e.target.value});
    };
    const handleSubmit = () =>{

    }

    const [counter,setCounter]= React.useState(59);
    React.useEffect(() => {
        const timer =
        counter > 0 && setInterval(() => setCounter(counter-1),1000);
        return () => clearInterval(timer);
    },[counter]);

    const sendSMS = () => {
        axios.get(`https://api.kavenegar.com/v1/336D63664A4365564D573742492B6F314F4A513974676F39337977765A597936/verify/lookup.json?receptor=${phoneNumber}&token=852596&template=SendMessage`)
        .then(res => {
            setVerificationCode(res.data.entries[0].message.replace(/[^0-9]/g,''));
          
      })
      }

    const CheckOTP = () => {
        if(verificationCode === enteredVerifCode){
            alert("OK")
        }else{
            alert("Wrong OTP code")
            return
        }
    }
    
    return(
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <h2>Register</h2>
                    <button onClick={sendSMS}>Send SMS</button>
                    <input type="text" value={enteredVerifCode} onChange={(e) => setEnteredVerifCode(e.target.value)} placeholder="please enter the OTP code" />

                    <button onClick={CheckOTP}>Submit</button>

                    <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
                    <h2>Register</h2>
                    <h4 style={{color:"green"}}></h4>
                    <Box color="text.secondary">
                        <Typography variant="body2">
                            Enter OTP sent to your mobile number *********47
                        </Typography>
                    </Box>
                </Grid><br/>
                
                <ValidatorForm
                onSubmit={handleSubmit}>
                    <TextValidator 
                    label="Enter 4 Digit OTP"
                    onChange={handleChange}
                    variant="outlined"
                    inputProps={{maxLength:4}}
                    name="otp"
                    size="small"
                    type="text"
                    fulwidth
                    validators={['required']}
                    errorMessages={['OTP is required']}
                    value={user.fname}
                    />
                <Button type='sumbit' color='primary' variant="contained" style={btnstyle} fullWidth >VERIFY</Button>
                </ValidatorForm>
                <Box mt={3}><Typography fontweight={500} align="center" color='textSecondary'>Resend OTP in <span style={{color:"green",fontweight:"bold"}}>00:{counter}</span></Typography></Box>

                <Typography align="center">
                    <NavLink to="/auth/Signup/">
                        <span style={{marginLeft:"5px"}}>Resend OTP</span>
                    </NavLink>
                </Typography>
            </Paper>
        </Grid>
    )

}
export default Register;