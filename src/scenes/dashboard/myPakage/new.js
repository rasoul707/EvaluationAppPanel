
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import Swal from 'sweetalert2'
import Card from "../../../components/card";
import { getDefaultHeaders } from "../../../inc/functions";
import { Modal, Button, Form } from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import Accordion from 'react-bootstrap/Accordion';
import Select from 'react-select'

const MyNewPackage = ({ match }) => {
    const [software, setSoftware] = useState();
    const [softwares, setSoftwares] = useState();
    const [packageName, setPackageName] = useState('');
    const id = match.params.id;
    const history = useHistory()
    const userId = Cookies.get("userId");

    const [isPackageATemplate, setIsPackageATemplate] = useState(false);
    const [activeMetric, setActiveMetric] = useState(false);
    const [activeComment, setActiveComment] = useState(false);
    const [activeRating, setAtiveRating] = useState(false);
    const [activeCompare, setActiveCompare] = useState(false);
    const [activeQuestionnaire, setActiveQuestionnaire] = useState(false);
    const [activateAll, setActivateAll] = useState(false);

    const setActiveAll = () => {
        setActivateAll(!activateAll);

        activateAll ? setActiveMetric(false) : setActiveMetric(true);
        activateAll ? setActiveComment(false) : setActiveComment(true);
        activateAll ? setAtiveRating(false) : setAtiveRating(true);
        activateAll ? setActiveCompare(false) : setActiveCompare(true);
        activateAll ? setActiveQuestionnaire(false) : setActiveQuestionnaire(true);
    }

    const loadSoftwares = () => {
        axios.get(`${BASE_URL}/api/software/?created_by=${Cookies.get("userId")}`, getDefaultHeaders()).then(res => {
            setSoftwares(res.data);
        });
    }

    // Metrics
    const [metricPeople, setMetricPeople] = useState(0);
    const [metricTabCategory, setMetricTabCategory] = useState();
    const [metricTabCategories, setMetricTabCategories] = useState();
    const [metricCategories, setMetricCategories] = useState([]);
    const [metricShow, setMetricShow] = useState(false);
    const [metricSelectedValue, setMetricSelectedValue] = useState();
    let tmpSelectedMetrics = [];
    const [selectedMetrics, setSelectedMetrics] = useState([]);

    const handleSaveMetrics = (e) => {
        if (metricSelectedValue) {
            metricSelectedValue.forEach(element => {
                tmpSelectedMetrics.push(element.id)
            });

            setSelectedMetrics(tmpSelectedMetrics)

            handleMetricClose();
        } else {
            Swal.fire({
                text: 'Please select a metric first',
                icon: 'warning',
            });
            return;
        }
    }

    const handleMetricClose = () => {
        setMetricShow(false);
    }

    const handleMetricShow = () => {
        setMetricShow(true);
    }

    const loadCategories = () => {
        axios.get(`${BASE_URL}/api/category/`, getDefaultHeaders()).then(res => {
            setMetricTabCategories(res.data);
        });
    }

    const handleMetricChange = value => {
        setMetricSelectedValue(value);
    }

    const loadMetricsForCategory = value => {
        setMetricTabCategory(value.target.value);

        setSelectedMetrics([]);
        tmpSelectedMetrics = [];

        axios.get(`${BASE_URL}/api/metrics/?categorymetric_id=${value.target.value}`, getDefaultHeaders()).then(res => {
            setMetricCategories(res.data);
        });
    }
    // Metrics

    // Comments
    const [commentPeople, setCommentPeople] = useState(0);
    // Comments

    // Ratings
    const [ratingPeople, setRatingPeople] = useState(0);
    // Ratings

    // Compares
    const [software2, setSoftware2] = useState();
    const [softwares2, setSoftwares2] = useState();
    const [comparePeople, setComparePeople] = useState(0);

    const loadSoftwares2 = () => {
        axios.get(`${BASE_URL}/api/software/`, getDefaultHeaders()).then(res => {
            setSoftwares2(res.data);
        });
    }
    // Compares

    // questionnaire
    const [questionnaireCategoryquestion, setQuestionnaireCategoryquestion] = useState();
    const [questionnaireCategories, setQuestionnaireCategories] = useState();
    const [questionnaireSelectcategory, setQuestionnaireSelectCategory] = useState();
    const [questionnairePeople, setQuestionnairePeople] = useState(0);
    const [questionnaireShow, setQuestionnaireShow] = useState(false);

    const handleQuestionnaireClose = () => setQuestionnaireShow(false);

    const handleQuestionnaireShow = () => {
        setQuestionnaireShow(true);
        loadQuestionsForCategory();
    }

    const loadCategoryquestion = () => {
        axios.get(`${BASE_URL}/api/categoryquestion/`, getDefaultHeaders()).then(res => {
            setQuestionnaireCategories(res.data);
        });
    }

    const loadQuestionsForCategory = () => {
        axios.get(`${BASE_URL}/api/questions/?questionClass_id=${questionnaireCategoryquestion}`, getDefaultHeaders()).then(res => {
            setQuestionnaireSelectCategory(res.data);
        });
    }
    // questionnaire

    useEffect(() => {
        loadSoftwares()
        loadCategories()
        loadSoftwares2()
        loadCategoryquestion()
        // if (id) {
        //     loadObject();
        // }
    }, []);

    const HandleSaveSections = () => {
        const metricData = {
            software_id: software,
            metric_category_id: metricTabCategory,
            people: metricPeople
        }

        const commentData = {
            software_id: software,
            people: commentPeople
        }

        const ratingData = {
            software_id: software,
            people: ratingPeople
        }

        const compareData = {
            software_id: software,
            software_2_id: software2,
            people: comparePeople
        }

        const questionnaireData = {
            software_id: software,
            select_category_id: questionnaireCategoryquestion,
            people: questionnairePeople
        }

        let allPromises = []

        activeMetric && allPromises.push(axios.post(`${BASE_URL}/api/metricEvaluate/`, metricData, getDefaultHeaders()))
        activeComment && allPromises.push(axios.post(`${BASE_URL}/api/commentEvaluate/`, commentData, getDefaultHeaders()))
        activeRating && allPromises.push(axios.post(`${BASE_URL}/api/rankEvaluate/`, ratingData, getDefaultHeaders()))
        activeCompare && allPromises.push(axios.post(`${BASE_URL}/api/compare/`, compareData, getDefaultHeaders()))
        activeQuestionnaire && allPromises.push(axios.post(`${BASE_URL}/api/questionEvaluate/`, questionnaireData, getDefaultHeaders()))

        return new Promise(
            (resolve, reject) => {
                let responseData = {
                    metricId: null,
                    commentId: null,
                    ratingId: null,
                    compareId: null,
                    questionnaireId: null,
                }

                Promise.all(allPromises)
                    .then((responses) => {
                        if (activeMetric) {
                            responseData.metricId = responses.shift().data.id
                        }
                        if (activeComment) {
                            responseData.commentId = responses.shift().data.id
                        }
                        if (activeRating) {
                            responseData.ratingId = responses.shift().data.id
                        }
                        if (activeCompare) {
                            responseData.compareId = responses.shift().data.id
                        }
                        if (activeQuestionnaire) {
                            responseData.questionnaireId = responses.shift().data.id
                        }

                        resolve(responseData)
                    });
            }
        )
    }

    const handleSavePackage = (response) => {
        const packageData = {
            package_name: packageName,
            metricEvaluate_id: response.metricId || null,
            questionEvaluate_id: response.questionnaireId || null,
            compare_id: response.compareId || null,
            comment_id: response.commentId || null,
            rank_id: response.ratingId || null,
            istemplate: isPackageATemplate
        }

        selectedMetrics.forEach((item) => {
            let metricEvaluateDetailsData = {
                metricEvaluate_id: response.metricId,
                metric_id: item,
            }

            axios.post(`${BASE_URL}/api/metricEvaluateDetails/`, metricEvaluateDetailsData, getDefaultHeaders())
        });

        axios.post(`${BASE_URL}/api/package/`, packageData, getDefaultHeaders())
            .then(res => {
                Swal.fire({
                    text: 'A new package created succussfuly',
                    icon: 'success',
                });
            })

        history.push(`/myPakage/`);
    }

    const handleSubmit = async () => {
        const res = await HandleSaveSections()
        handleSavePackage(res)
    }

    return (
        <Card>
            <h2>Packages</h2>
            <div >
                <h5 className="form-label mt-3">Enter the package name</h5>
                <input type='text' value={packageName} onChange={(e) => setPackageName(e.target.value)} className="form-control" />
            </div>

            <hr />
            <div class="row">
                <div className="col-md-12">
                    <h5 className="form-label">Select the desired software</h5>
                    <select required={true} className="form-select" value={software} onChange={ev => setSoftware(ev.target.value)}>
                        <option value={null} selected>Select an option</option>
                        {softwares?.map(software =>
                            <option value={software.id}>{software.software_name}</option>
                        )}
                    </select>
                </div>
            </div>
            <hr />

            <h5>What sections do you need to add in this package?</h5>
            <Form>
                <div>
                    <Form.Check
                        inline
                        type="switch"
                        id="custom-switch"
                        label="Use Metric"
                        onChange={() => activeMetric ? setActiveMetric(false) : setActiveMetric(true)}
                        {...(activateAll && { disabled: activateAll })}
                        {...(activateAll && { checked: activateAll })}
                    />

                    <Form.Check
                        inline
                        type="switch"
                        id="custom-switch"
                        label="Use Comment"
                        onChange={() => activeComment ? setActiveComment(false) : setActiveComment(true)}
                        {...(activateAll && { disabled: activateAll })}
                        {...(activateAll && { checked: activateAll })}
                    />

                    <Form.Check
                        inline
                        type="switch"
                        id="custom-switch"
                        label="Use Rating"
                        onChange={() => activeRating ? setAtiveRating(false) : setAtiveRating(true)}
                        {...(activateAll && { disabled: activateAll })}
                        {...(activateAll && { checked: activateAll })}
                    />

                    <Form.Check
                        inline
                        type="switch"
                        id="custom-switch"
                        label="Use Compare"
                        onChange={() => activeCompare ? setActiveCompare(false) : setActiveCompare(true)}
                        {...(activateAll && { disabled: activateAll })}
                        {...(activateAll && { checked: activateAll })}
                    />

                    <Form.Check
                        inline
                        type="switch"
                        id="custom-switch"
                        label="Use Questionnaire"
                        onChange={() => activeQuestionnaire ? setActiveQuestionnaire(false) : setActiveQuestionnaire(true)}
                        {...(activateAll && { disabled: activateAll })}
                        {...(activateAll && { checked: activateAll })}
                    />

                    <Form.Check
                        inline
                        type="switch"
                        id="custom-switch"
                        label="Use All"
                        onChange={setActiveAll}
                    />
                </div>
            </Form>

            <hr />

            <h5>Select options</h5>

            <Accordion defaultActiveKey="0">
                {/* Metric */}
                <Accordion.Item eventKey='Metric' className={activeMetric ? '' : 'd-none'}>
                    <Accordion.Header className={activeMetric ? '' : 'd-none'}>Metric</Accordion.Header>
                    <Accordion.Body>
                        <div className="row">
                            <div className="col-md-5">
                                <label className="form-label">Categories
                                    <span class="badge btn btn-sm btn-info ms-3" onClick={handleMetricShow}>Click to see related metrics</span>
                                </label>

                                <select required={true} className="form-select" value={metricTabCategory} onChange={ev => loadMetricsForCategory(ev)} >
                                    <option value={null} selected>Select an option</option>
                                    {metricTabCategories?.map(category =>
                                        <option value={category.id}>{category.name}</option>
                                    )}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">People</label>
                                <input required={true} type="number" class="form-control" value={metricPeople} onChange={(ev) => setMetricPeople(ev.target.value)} />
                            </div>
                        </div>

                        <Modal show={metricShow} onHide={handleMetricClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Metrics related to this category</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Select
                                    getOptionLabel={e => e.title}
                                    getOptionValue={e => e.id}
                                    options={metricCategories}
                                    isMulti
                                    onChange={handleMetricChange}
                                // defaultValue={selectedMetrics2}
                                />

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={handleSaveMetrics}>
                                    Save
                                </Button>
                                <Button variant="secondary" onClick={handleMetricClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Accordion.Body>
                </Accordion.Item>
                {/* Metric */}

                {/* Comment */}
                <Accordion.Item eventKey='Comment' className={activeComment ? '' : 'd-none'}>
                    <Accordion.Header className={activeComment ? '' : 'd-none'}>Comment</Accordion.Header>
                    <Accordion.Body>
                        <div class="row">
                            <div className="col-md-2">
                                <label className="form-label">People</label>
                                <input required={true} type="number" class="form-control" value={commentPeople} onChange={(ev) => setCommentPeople(ev.target.value)} />
                            </div>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                {/* Comment */}

                {/* Rating */}
                <Accordion.Item eventKey='Rating' className={activeRating ? '' : 'd-none'}>
                    <Accordion.Header className={activeRating ? '' : 'd-none'}>Rating</Accordion.Header>
                    <Accordion.Body>
                        <div class="row">
                            <div className="col-md-2">
                                <label className="form-label">People</label>
                                <input required={true} type="number" class="form-control" value={ratingPeople} onChange={(ev) => setRatingPeople(ev.target.value)} />
                            </div>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                {/* Rating */}

                {/* Compare */}
                <Accordion.Item eventKey='Compare' className={activeCompare ? '' : 'd-none'}>
                    <Accordion.Header className={activeCompare ? '' : 'd-none'}>Compare</Accordion.Header>
                    <Accordion.Body>
                        <div className="row">
                            <div className="col-md-5">
                                <label className="form-label">Software 2</label>
                                <select required={true} className="form-select" value={software2} onChange={ev => setSoftware2(ev.target.value)}>
                                    <option value={null} selected>Select an option</option>
                                    {softwares2?.map(software2 =>
                                        <option value={software2.id}>{software2.software_name}</option>
                                    )}
                                </select>
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">People</label>
                                <input required={true} type="number" class="form-control" value={comparePeople} onChange={(ev) => setComparePeople(ev.target.value)} />
                            </div>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                {/* Compare */}

                {/* questionnaire */}
                <Accordion.Item eventKey='questionnaire' className={activeQuestionnaire ? '' : 'd-none'}>
                    <Accordion.Header className={activeQuestionnaire ? '' : 'd-none'}>Questionnaire</Accordion.Header>
                    <Accordion.Body>
                        <div class="row">
                            <div className="col-md-5">
                                <label className="form-label">Categories
                                    <span class="badge btn btn-sm btn-info ms-3" onClick={handleQuestionnaireShow}>Click to see related metrics</span>
                                </label>

                                <select required={true} className="form-select" value={questionnaireCategoryquestion} onChange={ev => setQuestionnaireCategoryquestion(ev.target.value)}>
                                    <option value={null} selected>Select an option</option>
                                    {questionnaireCategories?.map(categoryquestion =>
                                        <option value={categoryquestion.id}>{categoryquestion.name}</option>
                                    )}
                                </select>
                            </div>

                            <div className="col-md-2">
                                <label className="form-label">People</label>
                                <input required={true} type="number" class="form-control" value={questionnairePeople} onChange={(ev) => setQuestionnairePeople(ev.target.value)} />
                            </div>
                        </div>

                        <Modal show={questionnaireShow} onHide={handleQuestionnaireClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Metrics related to this category</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {questionnaireSelectcategory?.map(selectcategory =>
                                    <p style={{ color: 'green' }}>{selectcategory.questionText}</p>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleQuestionnaireClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Accordion.Body>
                </Accordion.Item>
                {/* questionnaire */}
            </Accordion>

            <hr />

            <div>
                <Form.Check
                    inline
                    type="switch"
                    id="custom-switch"
                    label="Save as a package template"
                    onChange={() => setIsPackageATemplate(!isPackageATemplate)}
                />

                <button style={{ background: purpleColor }} type="submit" onClick={handleSubmit} class="btn btn-primary">Submit</button>
            </div>
        </Card>
    )
}

export default MyNewPackage;