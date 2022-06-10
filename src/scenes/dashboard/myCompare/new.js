
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import Swal from 'sweetalert2'
import Card from "../../../components/card";
import { getDefaultHeaders } from "../../../inc/functions";
import { Modal, Button } from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const NewMyCompare = ({ match }) => {
    const [software, setSoftware] = useState();
    const [softwares, setSoftwares] = useState();
    const [software2, setSoftware2] = useState();
    const [softwares2, setSoftwares2] = useState();
    const [people, setPeople] = useState(0);
    const id = match.params.id;
    const history = useHistory()

    const loadSoftwares = () => {
        axios.get(`${BASE_URL}/api/software/?created_by=${Cookies.get("userId")}`, getDefaultHeaders()).then(res => {
            setSoftwares(res.data);
        });
    }
    const loadSoftwares2 = () => {
        axios.get(`${BASE_URL}/api/software/`, getDefaultHeaders()).then(res => {
            setSoftwares2(res.data);
        });
    }

    const handleSubmit = () => {

        axios.get(`${BASE_URL}/api/compare/?created_by=&software_id=${software}&software_2_id=${software2}`, getDefaultHeaders()).then(res => {
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
                    software_2_id: software2,
                    people: people
                }

                if (id) {
                    // edit
                    axios.put(`${BASE_URL}/api/compare/${id}/`, data, getDefaultHeaders())
                        .then(res => {
                            Swal.fire({
                                text: 'Record updated succussfuly',
                                icon: 'success',
                            });
                        });
                } else {
                    // create
                    axios.post(`${BASE_URL}/api/compare/`, data, getDefaultHeaders())
                        .then(res => {
                            console.log(res)
                            Swal.fire({
                                text: 'Record created succussfuly',
                                icon: 'success',
                            });
                        })
                }

                history.push(`/myCompare/`);
            }
        });
    }



    const loadObject = () => {
        axios.get(`${BASE_URL}/api/compare/${id}/`, getDefaultHeaders()).then(res => {
            setSoftware(res.data.software_id);
            setSoftware2(res.data.software_2_id);
            setPeople(res.data.people);
        });
    }

    useEffect(() => {
        loadSoftwares()
        loadSoftwares2()
        if (id) {
            loadObject();
        }
    }, []);

    return (
        <Card>
            <h2>New Evaluate</h2>

            <hr />
            <div class="row mb-3">
                <div className="col-md-5">
                    <label className="form-label">Softwares</label>
                    <select required={true} className="form-control" value={software} onChange={ev => setSoftware(ev.target.value)}>
                        <option value={null} selected>Select an option</option>
                        {softwares?.map(software =>
                            <option value={software.id}>{software.software_name}</option>
                        )}
                    </select>
                </div>
                <div className="col-md-5">
                    <label className="form-label">Softwares 2</label>
                    <select required={true} className="form-control" value={software2} onChange={ev => setSoftware2(ev.target.value)}>
                        <option value={null} selected>Select an option</option>
                        {softwares2?.map(software2 =>
                            <option value={software2.id}>{software2.software_name}</option>
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

export default NewMyCompare;