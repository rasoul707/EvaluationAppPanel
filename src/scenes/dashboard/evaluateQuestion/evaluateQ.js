
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../inc/constants";
import Card from "../../../components/card";
import { getDefaultHeaders } from "../../../inc/functions";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const EvaluationQuestion = ({ match }) => {
    const [softwareId, setSoftwareId] = useState();
    const [softwareName, setSoftwareName] = useState('');
    const [categoryquestionId, setcategoryquestionId] = useState();
    const [categoryquestionName, setcategoryquestionName] = useState();
    const [questionCategories, setQuestionCategories] = useState();
    const [questionValue, setQuestionValue] = useState();
    const [questionId, setQuestionId] = useState();
    const id = match.params.id;
    const userId = Cookies.get("userId")
    const history = useHistory()

    const loadCategory = () => {
        axios.get(`${BASE_URL}/api/categoryquestion/${categoryquestionId}`, getDefaultHeaders()).then(res => {
            setcategoryquestionName(res.data.name);
        });
    }

    const loadSoftware = () => {
        axios.get(`${BASE_URL}/api/software/${softwareId}`, getDefaultHeaders()).then(res => {
            setSoftwareName(res.data.software_name);
        });
    }

    const loadMetricsForCategory = () => {
        axios.get(`${BASE_URL}/api/questions/?questionClass_id=${categoryquestionId}`, getDefaultHeaders()).then(res => {
            setQuestionCategories(res.data);
        });
    }

    const loadObject = () => {
        axios.get(`${BASE_URL}/api/questionEvaluate/${id}/`, getDefaultHeaders())
            .then(res => {
                setcategoryquestionId(res.data.select_category_id);
                setSoftwareId(res.data.software_id);

                loadSoftware()
                loadCategory()
                loadMetricsForCategory();
            });
    }

    useEffect(() => {
        loadObject();
    }, [categoryquestionId, softwareId, id]);

    const handleSave = (ev, questionId) => {
        setQuestionId(questionId)

        const data = {
            question_id: parseInt(questionId),
            questionEvaluate_id: parseInt(id),
            value: ev.target.value,
        }

        axios.get(`${BASE_URL}/api/questionValue/?questionEvaluate=${id}&question=${questionId}&created_by=${userId}`, getDefaultHeaders())
            .then(res => {
                if (res.data.length !== 0) {
                    axios.put(`${BASE_URL}/api/questionValue/${res.data[0].id.toString()}/`, data, getDefaultHeaders())
                } else {
                    axios.post(`${BASE_URL}/api/questionValue/`, data, getDefaultHeaders())
                }
            });
    }

    const finishEvaluation = () => {
        axios.get(`${BASE_URL}/api/questionEvaluate/${id}`, getDefaultHeaders())
            .then(res => {
                const data = {
                    software_id: softwareId,
                    select_category_id: categoryquestionId,
                    isEvaluated: 'true',
                    people: parseInt(res.data.people) - 1,
                    evaluated_by: userId,
                }

                axios.put(`${BASE_URL}/api/questionEvaluate/${id}/`, data, getDefaultHeaders())
                    .then(res => {
                        Swal.fire({
                            text: 'Operation was successful',
                            icon: 'success',
                        });

                        history.push(`/questionnaire/`);
                    })
            })
    }

    return (
        <Card>
            <h2>questionnaire Evaluate</h2>
            <hr />
            <div className="row mb-3">
                <div className="col-12">
                    <label className="form-label" style={{ fontWeight: 'bold' }} >Software Name: </label>&nbsp;<span style={{ color: 'green' ,fontSize:'20px'}}>{softwareName}</span>
                </div>

                <div className="col-12">
                    <label className="form-label" style={{ fontWeight: 'bold' }}>questionnaire Name: </label><span  style={{ color: 'green' ,fontSize:'20px'}}>{categoryquestionName}</span>
                </div>
                <br />
                <br />

                <label className="form-label" style={{color:'#fb9121' }}>Please answer the questions :</label> <br />

                {questionCategories?.map(questionCategory => (
                    <form>
                        <div className="col-md-12">
                            <p style={{color:'#5C12CA'}}key={questionCategory.id}>{questionCategory.questionText}</p>

                            <div class="form-check-inline">
                                <input className="form-check-input" type="radio" name="value" value="bad"
                                    onClick={(ev) => handleSave(ev, questionCategory.id)}
                                /> Bad
                            </div>

                            <div class="form-check-inline">
                                <input className="form-check-input" type="radio" name="value" value="medium"
                                    onClick={(ev) => handleSave(ev, questionCategory.id)}
                                /> Medium
                            </div>

                            <div class="form-check-inline">
                                <input className="form-check-input" type="radio" name="value" value="good"
                                    onClick={(ev) => handleSave(ev, questionCategory.id)}
                                /> Good
                            </div>

                            <div class="form-check-inline">
                                <input className="form-check-input" type="radio" name="value" value="verygood" onClick={(ev) => handleSave(ev, questionCategory.id)}
                                /> Very Good
                            </div>

                            <div class="form-check-inline">
                                <input className="form-check-input" type="radio" name="value" value="excellent" onClick={(ev) => handleSave(ev, questionCategory.id)}
                                /> Excellent
                            </div>
                        </div>
                        <hr />
                    </form>
                ))}
                <div className="col-md-1">
                    <Link to={`/questionnaire/`}>
                        <button className="btn btn-outline-primary">Back</button>
                    </Link>
                </div>
                <div className="col-md-2">
                    <button onClick={finishEvaluation} className="btn btn-outline-success">Finish Evaluation</button>
                </div>
            </div>
        </Card >
    )
}

export default EvaluationQuestion;