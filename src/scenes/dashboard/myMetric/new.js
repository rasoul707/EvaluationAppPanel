import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import Swal from 'sweetalert2'
import Card from "../../../components/card";
import { getDefaultHeaders } from "../../../inc/functions";
import { Modal, Button } from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import Select from 'react-select'

const NewMyMetric = ({ match }) => {
    const [software, setSoftware] = useState();
    const [softwares, setSoftwares] = useState();
    const [category, setCategory] = useState();
    const [categories, setCategories] = useState();
    const [metricCategories, setMetricCategories] = useState([]);
    const [people, setPeople] = useState(0);
    const [show, setShow] = useState(false);
    const id = match.params.id;
    const history = useHistory()
    const userId = Cookies.get("userId");
    const [selectedValue, setSelectedValue] = useState();
    let tmpSelectedMetrics = [];
    const [selectedMetrics, setSelectedMetrics] = useState([]);

    const handleSaveMetrics = (e) => {
        if (selectedValue) {
            selectedValue.forEach(element => {
                tmpSelectedMetrics.push(element.id)
            });

            setSelectedMetrics(tmpSelectedMetrics)
            handleClose();
        } else {
            Swal.fire({
                text: 'Please select a metric first',
                icon: 'warning',
            });
            return;
        }
    }
    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    }
    const loadSoftwares = () => {
        axios.get(`${BASE_URL}/api/software/?created_by=${userId}`, getDefaultHeaders()).then(res => {
            setSoftwares(res.data);
        });
    }
    const loadCategories = () => {
        axios.get(`${BASE_URL}/api/category/`, getDefaultHeaders()).then(res => {
            setCategories(res.data);
        });
    }
    const handleSubmit = () => {
        //console.log(selectedMetrics);

        axios.get(`${BASE_URL}/api/metricEvaluate/?created_by=${userId}&software_id=${software}&metric_category_id=${category}`, getDefaultHeaders()).then(res => {
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
                    metric_category_id: category,
                    people: people
                }

                if (id) {
                    // edit
                    axios.put(`${BASE_URL}/api/metricEvaluate/${id}/`, data, getDefaultHeaders())
                        .then(res => {
                            Swal.fire({
                                text: 'metric Evaluate updated succussfuly',
                                icon: 'success',
                            });
                        });
                } else {
                    // create
                    axios.post(`${BASE_URL}/api/metricEvaluate/`, data, getDefaultHeaders())
                        .then(res => {
                            const metricEvaluateId = res.data.id;
                            selectedMetrics.forEach((item) => {
                                let data2 = {
                                    metricEvaluate_id: metricEvaluateId,
                                    metric_id: item,
                                }

                                axios.post(`${BASE_URL}/api/metricEvaluateDetails/`, data2, getDefaultHeaders())
                                    .then(res => { })
                            });

                            Swal.fire({
                                text: 'metric Evaluate created succussfuly',
                                icon: 'success',
                            });
                        }).catch(err => {
                            console.log('err' + err);
                        })
                }

                history.push(`/myMetric/`);
            }
        });
    }
    const loadObject = () => {
        axios.get(`${BASE_URL}/api/metricEvaluate/${id}/`, getDefaultHeaders()).then(res => {
            setCategory(res.data.metric_category_id);
            setSoftware(res.data.software_id);
            setPeople(res.data.people);
        });
    }
    const handleChange = value => {
        setSelectedValue(value);
    }
    const loadMetricsForCategory = value => {
        setCategory(value.target.value);

        setSelectedMetrics([]);
        tmpSelectedMetrics = [];

        axios.get(`${BASE_URL}/api/metrics/?categorymetric_id=${value.target.value}`, getDefaultHeaders()).then(res => {
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
            <h3>{id ? "Edit" : "New"} Metric Evaluation</h3>

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
                        <span class="badge btn btn-sm btn-info ms-3" onClick={handleShow}>Click to see related metrics</span>
                    </label>

                    <select required={true} className="form-control" value={category} onChange={ev => loadMetricsForCategory(ev)} >
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
                    <Select
                        getOptionLabel={e => e.title}
                        getOptionValue={e => e.id}
                        options={metricCategories}
                        isMulti
                        onChange={handleChange}
                    // defaultValue={selectedMetrics2}
                    />

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSaveMetrics}>
                        Save
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    )
}

export default NewMyMetric;



