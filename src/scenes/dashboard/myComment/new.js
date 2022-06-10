
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import Swal from 'sweetalert2'
import Card from "../../../components/card";
import { getDefaultHeaders } from "../../../inc/functions";
import { Modal, Button } from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const NewMyComment = ({ match }) => {
    const [software, setSoftware] = useState();
    const [softwares, setSoftwares] = useState();
    const [people, setPeople] = useState(0);
    const id = match.params.id;
    const history = useHistory()

    const loadSoftwares = () => {
        axios.get(`${BASE_URL}/api/software/?created_by=${Cookies.get("userId")}`, getDefaultHeaders()).then(res => {
            setSoftwares(res.data);
        });
    }

    const handleSubmit = () => {
    axios.get(`${BASE_URL}/api/commentEvaluate/?created_by=&software_id=${software}`, getDefaultHeaders()).then(res => {
        if (res.data.length > 0) {
            Swal.fire({
                text: 'Record already exists',
                icon: 'error',
            });
            return;
        } else if (people === 0) {
            Swal.fire({
                text: 'Please enter the number of people',
                icon: 'error',
            });
            return;
        }
        else {
            const data = {
                software_id: software,
                people: people
            }

            if (id) {
                // edit
                axios.put(`${BASE_URL}/api/commentEvaluate/${id}/`, data, getDefaultHeaders())
                    .then(res => {
                        Swal.fire({
                            text: 'metric Evaluate updated succussfuly',
                            icon: 'success',
                        });
                    });
            } else {
                // create
                axios.post(`${BASE_URL}/api/commentEvaluate/`, data, getDefaultHeaders())
                    .then(res => {
                        Swal.fire({
                            text: 'metric Evaluate created succussfuly',
                            icon: 'success',
                        });
                    })
            }

            history.push(`/myComment/`);
        }
    });
}


    const loadObject = () => {
        axios.get(`${BASE_URL}/api/commentEvaluate/${id}/`, getDefaultHeaders()).then(res => {
            setSoftware(res.data.software_id);
            setPeople(res.data.people);
        });
    }


    useEffect(() => {
        loadSoftwares()
        if (id) {
            loadObject();
        }
    }, []);

    return (
        <Card>
            <h2>Comment Evaluate</h2>

            <hr />
            <div class="row mb-3">
                <div className="col-md-5">
                    <label className="form-label">Software</label>
                    <select required={true} className="form-control" value={software} onChange={ev => setSoftware(ev.target.value)}>
                        <option value={null} selected>Select an option</option>
                        {softwares?.map(software =>
                            <option value={software.id}>{software.software_name}</option>
                        )}
                    </select>
                </div>

                <div className="col-md-2">
                    <label className="form-label">People</label>
                    <input required={true} type="number" class="form-control" value={people} onChange={(ev) => setPeople(ev.target.value)} />
                </div>
            </div>

            <button onClick={handleSubmit} style={{ background: purpleColor }} type="submit" class="btn btn-primary">Submit</button>

        </Card>
    )
}

export default NewMyComment;