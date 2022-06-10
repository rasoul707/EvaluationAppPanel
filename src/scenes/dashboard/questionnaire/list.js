import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";
import Cookies from "js-cookie";
import moment from "moment";

const Questionnaire = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const userId = Cookies.get("userId");
    const [categories, setCategories] = useState();
    const [categoryquestion, setCategoryquestion] = useState("");

    useEffect(() => {
        //fetch data
        load();
    }, [categoryquestion])

    useEffect(() => {
        loadCategoryquestion();
    }, [])

    const loadCategoryquestion = () => {
        axios.get(`${BASE_URL}/api/categoryquestion/`, getDefaultHeaders()).then(res => {
            setCategories(res.data);
        });
    }

    const load = () => {
        setLoading(true);

        setLoading(true);
        axios.get(`${BASE_URL}/api/questionEvaluate/?created_by=${''}&isEvaluated=${''}&evaluated_by=${''}&software_id=${''}&select_category_id=${categoryquestion}`, getDefaultHeaders())
            .then(res => {
                setLoading(false);
                setData(res.data);
            })

    }


    return (
        <div>
            <div className="d-flex justify-content-between align-item-center">
                <div className="d-flex align-items-center">
                    <h4>QuestionnaireEvaluation</h4>

                    <select required={true} className="form-select mx-sm-3 mb-2" value={categoryquestion} onChange={ev => setCategoryquestion(ev.target.value)}>
                        <option value="">All Category</option>
                        {categories?.map(categoryquestion =>
                            <option value={categoryquestion.id}>{categoryquestion.name}</option>
                        )}
                    </select>
                </div>
            </div>
            <hr />
            {!loading ? <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">Image</th>
                        <th scope="col">Software_Name</th>
                        <th scope="col">Questionnaire</th>
                        <th scope="col">People</th>
                        <th scope="col">User</th>
                        <th scope="col">Created_datetime</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map(QuestionEvaluate =>
                        <tr>
                            <td>{QuestionEvaluate.id}</td>
                            <td>{QuestionEvaluate.software.image && <a href={QuestionEvaluate.software.image.file}><img width="50" src={QuestionEvaluate.software.image.thumbnail} alt="" /></a>}</td>
                            <td>{QuestionEvaluate.software.software_name}</td>
                            <td>{QuestionEvaluate.select_category.name}</td>
                            <td>{QuestionEvaluate.people}</td>
                            <td>{QuestionEvaluate.created_by?.first_name + ' ' + QuestionEvaluate.created_by?.last_name + ' (' + QuestionEvaluate.created_by?.email + ')'}</td>
                            <td>{moment(QuestionEvaluate.created_datetime).format("DD/MM/YYYY")}</td>
                            <div>
                                {
                                    (QuestionEvaluate.evaluated_by?.indexOf(userId + ",") !== -1 && QuestionEvaluate.isEvaluated.toString() === 'true' || parseInt(QuestionEvaluate.people) === 0) ?
                                        <button className="btn btn-success" disabled>Evaluate</button>
                                        :
                                        < Link to={`../evaluateQuestion/${QuestionEvaluate.id}/`}>
                                            <button className="btn btn-success">Evaluate</button>
                                        </Link>
                                }
                            </div>
                        </tr>
                    )}
                </tbody>
            </table> : <span>Loading...</span>
            }
        </div >
    )
}
export default Questionnaire;
