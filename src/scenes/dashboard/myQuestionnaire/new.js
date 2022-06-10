import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import Swal from 'sweetalert2'
import Card from "../../../components/card";
import { getDefaultHeaders } from "../../../inc/functions";
import { Modal, Button } from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const NewMyQuestionnaire = ({ match }) => {

    const [software, setSoftware] = useState();
    const [softwares, setSoftwares] = useState();
    const [categoryquestion, setCategoryquestion] = useState();
    const [categories, setCategories] = useState();
    const [selectcategory, setSelectCategory] = useState();
    const [people, setPeople] = useState(0);
    const [show, setShow] = useState(false);
    const id = match.params.id;
    const history = useHistory()

    const handleClose = () => setShow(false);

    const handleShow = () => {
        setShow(true);
        loadQuestionsForCategory();
    }

    const loadSoftwares = () => {
        axios.get(`${BASE_URL}/api/software/?created_by=${Cookies.get("userId")}`, getDefaultHeaders()).then(res => {
            setSoftwares(res.data);
        });
    }

    const loadCategoryquestion = () => {
        axios.get(`${BASE_URL}/api/categoryquestion/`, getDefaultHeaders()).then(res => {
            setCategories(res.data);
        });
    }

    const handleSubmit = () => {
        axios.get(`${BASE_URL}/api/questionEvaluate/?created_by=&software_id=${software}&select_category_id=${categoryquestion}`, getDefaultHeaders()).then(res => {
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
                    select_category_id: categoryquestion,
                    people: people
                }

                if (id) {
                    // edit
                    axios.put(`${BASE_URL}/api/questionEvaluate/${id}/`, data, getDefaultHeaders())
                        .then(res => {
                            Swal.fire({
                                text: 'Record updated succussfuly',
                                icon: 'success',
                            });
                        });
                } else {
                    // create
                    axios.post(`${BASE_URL}/api/questionEvaluate/`, data, getDefaultHeaders())
                        .then(res => {
                            Swal.fire({
                                text: 'Record created succussfuly',
                                icon: 'success',
                            });
                        })
                }

                history.push(`/myQuestionnaire/`);
            }
        });
    }


    const loadObject = () => {
        axios.get(`${BASE_URL}/api/questionEvaluate/${id}/`, getDefaultHeaders()).then(res => {
            setCategoryquestion(res.data.select_category_id);
            setSoftware(res.data.software_id);
            setPeople(res.data.people);
        });
    }

    const loadQuestionsForCategory = () => {
        axios.get(`${BASE_URL}/api/questions/?questionClass_id=${categoryquestion}`, getDefaultHeaders()).then(res => {
            setSelectCategory(res.data);
        });
    }

    useEffect(() => {
        loadSoftwares()
        loadCategoryquestion()
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
                    <label className="form-label">Categories
                        <span class="badge btn btn-sm btn-info ms-3" onClick={handleShow}>Click to see related metrics</span>
                    </label>

                    <select required={true} className="form-control" value={categoryquestion} onChange={ev => setCategoryquestion(ev.target.value)}>
                        <option value={null} selected>Select an option</option>
                        {categories?.map(categoryquestion =>
                            <option value={categoryquestion.id}>{categoryquestion.name}</option>
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
                    {selectcategory?.map(selectcategory =>
                        <p style={{ color: 'green' }}>{selectcategory.questionText}</p>
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


export default NewMyQuestionnaire;