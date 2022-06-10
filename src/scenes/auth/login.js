import axios from "axios";
import { useReducer } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Card from "../../components/card"
import { BASE_URL } from "../../inc/constants";
import Cookies from "js-cookie";
import './index.css';
import { Button,Divider, FormControlLabel } from "@material-ui/core";
import { Link } from "react-router-dom";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { CheckBoxOutlineBlank, CheckBoxOutlineBlankOutlined, TextFields } from "@material-ui/icons";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { CheckBox } from "@mui/icons-material";
import PersonIcon from '@material-ui/icons/Person';
import TextField from '@mui/material/TextField';
import { Col,Container,Form,Row } from "react-bootstrap";
import uiImg from "../../static/img/login5.png";


// const Card = styled.h1`
//     border-bottom: 1px solid #ccc;
//     padding-bottom: 10px;
//     margin-bottom: 15px;
//     font-size: 2rem;
// `
const Login = () => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const dispatch = useDispatch();

    const handleSubmit = () => {
        const data = {
            username: username,
            password: password
        }

        axios.post(`${BASE_URL}/api/auth/login/`, data).then(res => {
            Cookies.set("firstname", res.data.user.first_name)
            Cookies.set("lastname", res.data.user.last_name)
            Cookies.set("userId", res.data.user.id)
            dispatch({
                type: 'LOGIN',
                payload: res.data
            })
          
        })
    }

    return(
        <div class="card" style={{width: '952px',height:'450px',position:'relative'}}>
       
            <Row>
                <Col lg={6} md={12} sm={16} className="text-center mt-4 p-3" >
                <div className="icon">
                <div className="icon_class">
                   <PersonIcon fontSize="large"/>
              </div>
              <div className="text">Login</div>
         </div>

          <div className="row m-2">
           <TextField id="email" className="p-2" type="text" variant="outlined" label="Enter Email" fullWidth value={username} onChange={(ev) => setUsername(ev.target.value)} />
               <TextField id="password" className="p-2" type="password" variant="outlined" label="Enter Password" fullWidth  value={password} onChange={ev => setPassword(ev.target.value)} />
            <FormControlLabel
                    control={
                        <CheckBox
                        icon={<CheckBoxOutlineBlankIcon fontsize="small"/>}
                        checkedIcon={<checkBoxIcon fontsize="small"/>}
                        name ="checkedI"
                        />
                    }

                    label="Remember me"
                />
                <br/>
                <Button className="p-2" onClick={handleSubmit} type="submit" variant="contained" color="primary">Log in</Button>
                {/* <button onClick={handleSubmit} type="submit" class="btn btn-primary d-block w-100">Login</button> */}
            </div>
            <Divider variant="middle"/>
            <p className="text-center">
                <Link to="/auth/Signup/" className="text-block-50">
                    <h5>Don't have an account?</h5></Link>
            </p>
                </Col>
                <Col lg={4} md={6} sm={12}>
                    <img width="500" height="500" src={uiImg} alt=""/>
                </Col>
            </Row>
          
         </div>    






        // <Card>
        // <div>
        //     <div className="icon">
        //         <div className="icon_class">
        //             <PersonIcon fontSize="large"/>
        //         </div>
        //         <div className="text">Login</div>
        //     </div>

        //     <div className="row m-2">
        //         <TextField id="email" className="p-2" type="text" variant="outlined" label="Enter Email" fullWidth value={username} onChange={(ev) => setUsername(ev.target.value)} />
        //         <TextField id="password" className="p-2" type="password" variant="outlined" label="Enter Password" fullWidth  value={password} onChange={ev => setPassword(ev.target.value)} />
        //         <FormControlLabel
        //             control={
        //                 <CheckBox
        //                 icon={<CheckBoxOutlineBlankIcon fontsize="small"/>}
        //                 checkedIcon={<checkBoxIcon fontsize="small"/>}
        //                 name ="checkedI"
        //                 />
        //             }
        //             label="Remember me"
        //         />
        //         <Button className="p-2" onClick={handleSubmit} type="submit" variant="contained" color="primary">Log in</Button>
        //         {/* <button onClick={handleSubmit} type="submit" class="btn btn-primary d-block w-100">Login</button> */}
        //     </div>
        //     <Divider variant="middle"/>
        //     <p className="text-center">
        //         <Link to="/auth/Signup/" className="text-block-50">
        //             <h5>Don't have an account?</h5></Link>
        //     </p>
        // </div>
        // </Card>

    )
}

export default Login;