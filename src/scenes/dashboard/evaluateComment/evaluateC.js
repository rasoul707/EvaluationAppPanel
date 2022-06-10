
import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import Card from "../../../components/card";
import { getDefaultHeaders } from "../../../inc/functions";
import Swal from 'sweetalert2';
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const EvaluationComment = ({ match }) => {
    const [softwareId, setSoftwareId] = useState();
    const [softwareName, setSoftwareName] = useState('');
    const [Comment, setComment] = useState('');
    const id = match.params.id;
    const history = useHistory()
    const userId = Cookies.get("userId")

    const loadSoftware = () => {
        axios.get(`${BASE_URL}/api/software/${softwareId}`, getDefaultHeaders()).then(res => {
            setSoftwareName(res.data.software_name);
        });
    }

    const loadObject = () => {
        axios.get(`${BASE_URL}/api/commentEvaluate/${id}/`, getDefaultHeaders())
            .then(res => {
                setSoftwareId(res.data.software_id);

                loadSoftware()
            });
    }

    useEffect(() => {
        loadObject();
    }, [softwareId, id]);

    const handleSubmit = () => {
        if (Comment === '') {
            return
        }

        const data = {
            commentEvaluate_id: parseInt(id),
            textComment: Comment,
            created_by: parseInt(userId),
        }
        axios.post(`${BASE_URL}/api/comment/`, data, getDefaultHeaders())

        axios.get(`${BASE_URL}/api/commentEvaluate/${id}/`, getDefaultHeaders())
            .then(res => {
                const data = {
                    software_id: res.data.software_id,
                    software: res.data.software_id,
                    isEvaluated: 'true',
                    people: parseInt(res.data.people) - 1,
                    evaluated_by: parseInt(userId),
                }

                axios.put(`${BASE_URL}/api/commentEvaluate/${id}/`, data, getDefaultHeaders())
                    .then(res => {
                        Swal.fire({
                            text: 'Operation was successful',
                            icon: 'success',
                        });
                        history.push('/comment/')
                    })
            })
    }

    return (
        <Card>
            <h2 style={{color:'#096a82'}}>Comment Evaluate</h2>

            <hr />
            <div className="row mb-3">
                <div className="col-12">
                    <label className="form-label"><span style={{ fontWeight: 'bold' }}>Software Name: </span>{softwareName}</label>
                </div>
                <br />
                <div class="form-group">
                    <label style={{color:'#fb9121' }}>Insert Comment :</label>
                    <br />
                    <textarea class="form-control" value={Comment} onChange={ev => setComment(ev.target.value)} rows="3"></textarea>
                    <br />
                    <button onClick={handleSubmit} style={{ background: purpleColor }} type="submit" class="form-control btn btn-primary">Submit</button>
                </div>
            </div>
        </Card >
    )
}

export default EvaluationComment;