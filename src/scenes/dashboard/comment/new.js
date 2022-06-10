
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import Swal from 'sweetalert2'
import Card from "../../../components/card";
import { getDefaultHeaders } from "../../../inc/functions";
import { Modal, Button } from 'react-bootstrap'
import { useHistory } from "react-router-dom";

const NewComment = ({ match }) => {
    const [software, setSoftware] = useState();
    const [softwares, setSoftwares] = useState();
    const [category, setCategory] = useState();
    const [categories, setCategories] = useState();
    const [metricCategories, setMetricCategories] = useState();
    const [people, setPeople] = useState(0);
    const [show, setShow] = useState(false);
    const id = match.params.id;
    const history = useHistory()

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        loadMetricsForCategory();
    }

    const loadSoftwares = () => {
        axios.get(`${BASE_URL}/api/software/`, getDefaultHeaders()).then(res => {
            setSoftwares(res.data);
        });
    }

    const loadCategories = () => {
        axios.get(`${BASE_URL}/api/category/`, getDefaultHeaders()).then(res => {
            setCategories(res.data);
        });
    }

    const handleSubmit = () => {
        const data = {
            software_id: software,
            metric_category_id: category,
            people: people
        }

        if (id) {
            // edit
            axios.put(`${BASE_URL}/api/metricEvaluate/${id}/`, data, getDefaultHeaders())
                .then(res => {
                    Swal.fire({
                        text: 'Metric evaluate updated succussfuly',
                        icon: 'success',
                    });
                });
        } else {
            // create
            axios.post(`${BASE_URL}/api/metricEvaluate/`, data, getDefaultHeaders())
                .then(res => {
                    Swal.fire({
                        text: 'Metric evaluate created succussfuly',
                        icon: 'success',
                    });
                    history.push(`/comment/`);
                })
        }

    }

    const loadObject = () => {
        axios.get(`${BASE_URL}/api/metricEvaluate/${id}/`, getDefaultHeaders()).then(res => {
            setCategory(res.data.metric_category_id);
            setSoftware(res.data.software_id);
            setPeople(res.data.people);
        });
    }

    const loadMetricsForCategory = () => {
        axios.get(`${BASE_URL}/api/metrics/?categorymetric_id=${category}`, getDefaultHeaders()).then(res => {
            setMetricCategories(res.data);
        });
    }

    useEffect(() => {
        loadSoftwares()
        loadCategories()
        if (id) {
            loadObject();
        }
    }, []);

    return (
        <Card>
            <h2>Metric Evaluate</h2>

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
                    <label className="form-label">Categories
                        <span class="badge btn btn-sm btn-secondary ms-3" onClick={handleShow}>Click to see related metrics</span>
                    </label>

                    <select required={true} className="form-control" value={category} onChange={ev => setCategory(ev.target.value)}>
                        <option value={null} selected>Select an option</option>
                        {categories?.map(category =>
                            <option value={category.id}>{category.name}</option>
                        )}
                    </select>
                </div>

                <div className="col-md-2">
                    <label className="form-label">People</label>
                    <input required={true} type="number" class="form-control" value={people} onChange={(ev) => setPeople(ev.target.value)} />
                </div>
            </div>

            <button onClick={handleSubmit} style={{ background: purpleColor }} type="submit" class="btn btn-primary">Submit</button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Metrics related to this category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {metricCategories?.map(metricCategory =>
                        <p>{metricCategory.title}</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    )
}

export default NewComment;