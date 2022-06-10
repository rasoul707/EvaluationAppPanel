
import React from 'react';
import "../././index.css";
// import ReactDOM from 'react-dom';
import ReactStars from 'react-rating-stars-component'
import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import Card from "../../../components/card";
import { getDefaultHeaders } from "../../../inc/functions";
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom";
import { Alert } from 'react-bootstrap';
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';

const EvaluationR = ({ match }) => {
    const [softwareId, setSoftwareId] = useState();
    const [softwareName, setSoftwareName] = useState('');
    const [rating, setRankValue] = useState('');
    const [image, setImage] = useState();
    const userId = Cookies.get("userId")
    const id = match.params.id;
    const history = useHistory()

    const loadSoftware = () => {
        axios.get(`${BASE_URL}/api/software/${softwareId}`, getDefaultHeaders()).then(res => {
            setSoftwareName(res.data.software_name);
        });
    }
    const loadObject = () => {
        axios.get(`${BASE_URL}/api/rankEvaluate/${id}/`, getDefaultHeaders())
            .then(res => {
                setSoftwareId(res.data.software_id);
                setImage(res.data.software.image)

                loadSoftware()
            });

        axios.get(`${BASE_URL}/api/rankVlaue/?rankEvaluate_id=${id}`, getDefaultHeaders())
            .then(res => {
                if (res.data.length !== 0) {
                    setRankValue(res.data[0].rankValue)
                } else {
                    setRankValue('')
                }
            });
    }

    useEffect(() => {
        loadObject();
        return;
    }, [softwareId, id]);

    const ratingChanged = (rating) => {
        swal("Thanks for your rating!", `You rated us ${rating}`, "success")

        if (rating === '') {
            return
        }

        const data = {
            rankEvaluate_id: parseInt(id),
            rankValue: rating,
            created_by: parseInt(userId),
        }

        axios.post(`${BASE_URL}/api/rankVlaue/`, data, getDefaultHeaders())

        axios.get(`${BASE_URL}/api/rankEvaluate/${id}/`, getDefaultHeaders())
            .then(res => {
                const data = {
                    software_id: res.data.software_id,
                    software: res.data.software_id,
                    isEvaluated: 'true',
                    people: parseInt(res.data.people) - 1,
                    evaluated_by: parseInt(userId),
                }

                axios.put(`${BASE_URL}/api/rankEvaluate/${id}/`, data, getDefaultHeaders())
                    .then(res => {
                        swal("Thanks for your rating!", `You rated us ${rating}`, "success")

                        history.push('/rating/')
                    })
            })
    }
    return (

        <Card>
            <h2>Rating</h2>

            <hr />
            <div className="row mb-3" >
                <div className="col-12">
                    <label className="form-label" style={{ fontWeight: 'bold' }} >Software Name:</label>&nbsp;<span style={{ color: 'green' ,fontSize:'20px'}}>{softwareName} </span>
                </div>
                <br />

                <label className="form-label" style={{color:'#fb9121'}}>Rate this software :</label> <br />
                <div className="Rating-App">
                {image && <img src={image.medium} width="200" alt="mm" />}
                    <ReactStars size={30} isHalf={true} onChange={ratingChanged} />
                </div>
                <br />
            </div>
        </Card> 
    )
}
export default EvaluationR;






//   function Rotbe() {
//     const ratingChanged = (rating) => {
//       alert (`you have given ${rating} star rating for us.`);
//     }
//   return (
//     <div className="Rating-App">
//       <ReactStars
//        size={30}
//       isHalf={true}
//       onChange={ratingChanged}
//       />
//     </div>
//   );
// }
// export default EvaluationR;