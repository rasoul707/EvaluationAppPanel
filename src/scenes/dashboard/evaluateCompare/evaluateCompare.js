
import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import Card from "../../../components/card";
import { getDefaultHeaders } from "../../../inc/functions";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const CompareEva = ({ match }) => {
    const [softwareId, setSoftwareId] = useState();
    const [softwareId2, setSoftwareId2] = useState();
    const [softwareName, setSoftwareName] = useState('');
    const [softwareName2, setSoftwareName2] = useState('');
    const [image, setImage] = useState();
    const [image2, setImage2] = useState();
    const [rsoftwareId, setRsoftwareid] = useState();
    const userId = Cookies.get("userId")
    const id = match.params.id;
    let history = useHistory();

    useEffect(() => {
        axios.get(`${BASE_URL}/api/compare/${id}/`, getDefaultHeaders())
            .then(res => {
                setSoftwareId(res.data.software_id);
                setSoftwareName(res.data.software.software_name);
                setImage(res.data.software.image)

                setSoftwareId2(res.data.software_2_id);
                setSoftwareName2(res.data.software_2.software_name);
                setImage2(res.data.software_2.image)
            });
    }, []);

    const finishEvaluation = () => {
        const data = {
            software_id: parseInt(rsoftwareId),
            compare_id: parseInt(id),
            nameSoft: "",
            created_by: parseInt(userId),
        }

        axios.post(`${BASE_URL}/api/compareValue/`, data, getDefaultHeaders())

        axios.get(`${BASE_URL}/api/compare/${id}/`, getDefaultHeaders())
            .then(res => {
                const data = {
                    software_id: res.data.software_id,
                    software_2_id: res.data.software_2_id,
                    software: res.data.software_id,
                    software2: res.data.software_2_id,
                    isEvaluated: 'true',
                    people: parseInt(res.data.people) - 1,
                    evaluated_by: parseInt(userId),
                }

                axios.put(`${BASE_URL}/api/compare/${id}/`, data, getDefaultHeaders())
                    .then(res => {
                        Swal.fire({
                            text: 'Operation was successful',
                            icon: 'success',
                        });
                        history.push('/compare/')
                    })
            })
    }
    return (
        <Card>
            <h2>Compare Evaluate</h2>

            <hr />
            <p style={{ color: "#fb9121" }}>Which software do you like the most?</p>
            <div class="row">
                <div class="col-md-4">
                    <label className="form-label" style={{ fontWeight: 'bold' }}>Software Name: </label>&nbsp;<span  style={{ color: 'green' ,fontSize:'20px'}}>{softwareName}</span>
                    <div>
                        {image && <img src={image.medium} width="200" alt="mm" />}
                    </div>
                    <div class="form-check-inline">
                        <input className="form-check-input" type="radio" onClick={(ev) => setRsoftwareid(softwareId)} />
                    </div>
                </div>

                <div class="col-md-4 offset-md-4">
                <label className="form-label" style={{ fontWeight: 'bold' }}>Software Name: </label>&nbsp;<span  style={{ color: 'green' ,fontSize:'20px'}}>{softwareName2}</span>
                    <div> {image2 && <img src={image2.medium} width="200" alt="mm" />}</div>

                    <div class="form-check-inline">
                        <input className="form-check-input" type="radio" onClick={(ev) => setRsoftwareid(softwareId2)} />
                    </div>
                </div>
            </div>
            <div class="row">
                <div className="col-md-1">
                    <Link to={`/compare/`}>
                        <button className="btn btn-outline-primary">Back</button>
                    </Link>
                </div>
                <div className="col-md-2">
                    <button className="btn btn-outline-success" onClick={finishEvaluation}>Finish Evaluation</button>
                </div>
            </div>


        </Card >
    )
}

export default CompareEva;