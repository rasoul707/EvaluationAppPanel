// import { Link } from "react-router-dom"
// import styled from "styled-components"
// //import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { media } from "./mixins"
// import { useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import Swal from "sweetalert2"
import { Link } from "react-router-dom"
import styled from "styled-components"
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { media } from "./mixins"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { faFontAwesome } from "@fortawesome/free-brands-svg-icons";
import icon from "../static/img/icon.jfif"
import '../App.css';
import user from "../static/img/images.jfif"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const Logo = styled.div`
    font-weight: 500;
    text-transform: uppercase;
    text-align: center;
    font-size: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, .1);
    padding-bottom: 15px;
    margin-bottom: 25px;
    color :#88DAE6;
`
const Navstyles = styled.div`
    ul {
        list-style-type: none;
        padding-left: 15px;
        margin: 0;
        li {
            a {
                display: block;
                text-decoration: none;
                color: #E8F0FE;
                padding: 10px 0;
                &:hover {
                    color: #FEC516;
                }
            }
            
            &:focus-within {
                .submenu {
                    li {
                        a {
                            height: 38px;
                            padding-top: 7px;
                            padding-bottom: 7px;
                            opacity: 1;
                        }
                        
                    }
                }
                &.has-submenu > a {
                    &::before {
                        content: '-';
                    }
                }
            }
        }
        & > li {
            &.has-submenu {
                & > a {
                    position: relative;
                    &::before {
                        position: absolute;
                        content: '+';
                        right: 10px;
                        top: 50%;
                        transform: translateY(-50%);
                        font-size: 1.3rem;
                    }
                }
            }
        }
    }
    .submenu {
        padding-left: 25px;
        margin-left: 10px;
        border-left: 1px solid rgba(255, 255, 255, .2);
        li {
            a {
                overflow: hidden;
                height: 0;
                padding: 0;
                opacity: 0;
                transition: height .25s, padding .25s, opacity .25s;
            }
        }
    }
    & > ul > li:last-child {
        border-top: 1px solid rgba(255, 255, 255, .1);
    }

`
const Nav = ({ isOpened }) => {

    const role = useSelector(state => state.auth.user.role);

    const dispatch = useDispatch()

    const handleLogout = (ev) => {
        ev.preventDefault();

        Swal.fire({
            text: 'Are you sure to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Logout'
        }).then(val => {
            if (val) {
                Cookies.remove("firstname")
                Cookies.remove("lastname")
                Cookies.remove("userId")
                dispatch({
                    type: 'LOGOUT'
                });
            }
        })
    }
    return (
        <Navstyles>
            <ul>
                <li>
                    <Link to="Software"> 
                     My Software</Link>
                </li>

                <li className="has-submenu">
                    <a href="#"> My Software Evaluation </a>
                    <ul className="submenu">
                        <li>
                            <Link to="/myMetric"> Metric</Link>
                        </li>
                        <li>
                            <Link to="/myComment"> 
                          Comment </Link>
                        </li>
                        <li>
                            <Link to="/myRating"> Rating</Link>
                        </li>
                        <li>
                            <Link to="/myCompare"> Compare</Link>
                        </li>
                        <li>
                            <Link to="/myQuestionnaire"> Quessionnaire</Link>
                        </li>

                        <li>
                            <Link to="/myPakage">Pakages</Link>
                        </li>

                    </ul>
                </li>

                <hr />
                <li>
                    <Link to="/">
                        {/* <i class="fas fa-tachometer-alt"></i> */}
                        Dashboard
                    </Link>

                </li>
                <li className="has-submenu">
               
                    <a href="#">Evaluate a Software </a>
                    <ul className="submenu">
                        <li>
                            <Link to="/metric"> Metric</Link>
                        </li>
                        <li>
                            <Link to="/comment"> Comment </Link>
                        </li>
                        <li>
                            <Link to="/rating"> Rating</Link>
                        </li>
                        <li>
                            <Link to="/compare"> Compare</Link>
                        </li>
                        <li>
                            <Link to="/questionnaire"> Quessionnaire</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    {/* <Link to="/users">Users</Link> */}
                </li>
                <li>
                    <a onClick={handleLogout} href="#">
                        Logout
                    </a>
                </li>
            </ul>
        </Navstyles>
    )
}
const SidebarStyles = styled.div`
    width : 300px;
    background-color : #1D1B44;
    color : #fff;
    padding : 25px;
    position:fix;
`
export const Sidebar = () => {
    return (
        <SidebarStyles>
            <p style={{ color: "white", font: "bold" }}>Welcome</p><Logo> {Cookies.get("firstname") + ' ' + Cookies.get("lastname")}
            </Logo>
            {/* <div className="side-menu-footer">
            <div className="avatar">
            <img src={user} alt="user"/>
            </div>
            <div className="user-info">
                <h5>{Cookies.get("firstname") + ' ' + Cookies.get("lastname")}</h5>
                <p>reyhanenaserzade1991@gmail.com</p>
            </div>
            
        </div> */}
            <Nav />
        </SidebarStyles>
        
    )

}
