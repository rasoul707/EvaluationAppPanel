import axios from "axios";
import { useEffect, useReducer } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Card from "../../components/card"
import { BASE_URL } from "../../inc/constants";
import Cookies from "js-cookie";
import './index.css';
import {Button,Divider, Checkbox, FormControlLabel } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import MuiPhoneNumber from 'material-ui-phone-number';
import TextField from '@mui/material/TextField';
import Swal from "sweetalert2";
import { getDefaultHeaders } from "../../inc/functions";
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
// import PhoneInput from 'react-phone-input-2'


// const Title = styled.h1`
//     border-bottom: 1px solid #ccc;
//     padding-bottom: 10px;
//     margin-bottom: 15px;
//     font-size: 2rem;
// `

const Signup = ({match}) => {
    const id = match.params.id;

    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [email, setEmail] = useState();
    const [pass, setPass] = useState();
    const [pass2, setPass2] = useState();
    const [phonenumber, setPhoneNumber] = useState('09332306347');
    const [verificationCode, setVerificationCode] = useState('')
    const [enteredVerifCode, setEnteredVerifCode] = useState('')
    const [display, setDisplay] = useState('none')
    const [buttonDisplay, setButtonDisplay] = useState('')
    const history = useHistory();

    const sendSMS = () => {
        axios.get(`https://api.kavenegar.com/v1/336D63664A4365564D573742492B6F314F4A513974676F39337977765A597936/verify/lookup.json?receptor=${phonenumber}&token=852596&template=SendMessage`)
        .then(res => {
            setVerificationCode(res.data.entries[0].message.replace(/[^0-9]/g,''));
            setDisplay('')
            setButtonDisplay('none')
        }).catch(err => {
            alert('error with phone number')
            setVerificationCode('')
            setDisplay('none')
            setButtonDisplay('')
            return
      })
    }

    const handleSubmit = () => {
        if(verificationCode === enteredVerifCode){
            const data = {
                first_name: fname,
                last_name: lname,
                email: email,
                password: pass,
                password2: pass2,
                phone_number:phonenumber
            }
                axios.post(`${BASE_URL}/api/users/`, data, getDefaultHeaders())
                .then(res => {
                    Swal.fire({
                        text: 'User created succussfuly',
                        icon: 'success',
                    });
                })
            history.push(`/auth/login/`);
        }else{
            alert("Wrong OTP code")
            return
        }
        }

    const loadObject = () => {
        // axios.get(`${BASE_URL}/api/users/${id}/`, getDefaultHeaders()).then(res => {
        //     setName(res.data.name);
        // })
    }


    useEffect(() => {
        if (id) {
            loadObject();
        }
    }, [])
    return(
        
        <Card>
        <div>
            <div className="icon">
                <div className="icon_class"></div>
                <div className="icon_class">
                    <PersonAddRoundedIcon fontSize="large"/>
                </div>
                <div className="text">Sign Up</div>
            </div>
            
            <div className="row m-2">
                <div className="col-sm-4">
                <TextField id="firstname" type="text" variant="outlined" label="Enter First Name" fulwidth value={fname} onChange={(ev) => setFname(ev.target.value)}/>
                </div>
                <div className="col-sm-8">
                    <TextField id="lastname" type="text" variant="outlined" label="Enter Last Name" fullWidth value={lname} onChange={(ev) => setLname(ev.target.value)}/>
                </div>
            </div>

            <div className="row m-2">
                <TextField id="email" className="p-2" type="text" variant="outlined" label="Enter Email" fullWidth value={email} onChange={(ev) => setEmail(ev.target.value)}/>
                <TextField id="password" className="p-2" type="password" variant="outlined" label="Enter Password" fullWidth value={pass} onChange={(ev) => setPass(ev.target.value)}/>
                <TextField id="password2" className="p-2" type="password" variant="outlined" label="Password Confirm" fullWidth value={pass2} onChange={(ev) => setPass2(ev.target.value)}/>
                {/* <PhoneInput className="p-2" country="US" value={phonenumber} onChange={(ev) => setPhoneNumber(ev.target.value)} /> */}
                {/* <MuiPhoneNumber  className="p-2" defaultCountry={'us'} variant="outlined" label="Enter Phone Number" fullWidth value={phonenumber} onChange={(ev) => setPhoneNumber(ev.target.value)}/> */}
                    {/* <label className="form-label">Degree of Education</label>
                    <select required={true} className="form-control">
                        <option value={null} selected>Select an option</option>
                        {.map(software =>
                            <option value={software.id}>{software.software_name}</option>
                        )}
                    </select> */}
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Degree of Education"
                    >
          {/* {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))} */}
        </TextField>
             
                <br/>
                <hr/>
                <TextField id="phone" type="text" variant="outlined" label="Phone Number" fulwidth value={phonenumber} onChange={(ev) => setPhoneNumber(ev.target.value)}/>
                
                <FormControlLabel
                    control={
                        <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontsize="small"/>}
                        checkedIcon={<checkBoxIcon fontsize="small"/>}
                        name ="checkedI"
                        />
                    }
                    label="I agree to all terms and conditions."
                />
                <Button style={{display: `${buttonDisplay}`}} variant="contained" color="primary" fullWidth onClick={sendSMS}>Create Account</Button>
                {/* <Link to="/auth/register/"> */}
                {/* </Link> */}
            </div>
            <Divider variant="middle"/>

            <div style={{display: `${display}`}}>
                <TextField type="text" variant="outlined" label="OTP" fulwidth value={enteredVerifCode} onChange={(ev) => setEnteredVerifCode(ev.target.value)}/>
                <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>Create Account</Button>
            </div>

            <Divider variant="middle"/>
            <p className="text-center">
                <Link to="/auth/login/" className="text-block-50">
                    <h5>Already have an Account?</h5></Link>
            </p>
        </div>
       

        {/* // <Card>
        //     <Title>Login</Title>
        //     <div class="mb-3">
        //         <label for="email" class="form-label">Email address</label>
        //         <input onChange={(ev) => setUsername(ev.target.value)} value={username} type="email" class="form-control" id="email" />
        //     </div>
        //     <div class="mb-3">
        //         <label for="password" class="form-label">Password</label>
        //         <input onChange={ev => setPassword(ev.target.value)} value={password} type="password" class="form-control" id="password" />
        //     </div>
        //     <button onClick={handleSubmit} type="submit" class="btn btn-primary d-block w-100">Login</button>
        // </Card> */}
        </Card>
    )
}

export default Signup;