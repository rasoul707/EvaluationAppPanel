import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";
import moment from "moment";

const MyQuestionnaire = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        //fetch data
        load();
    }, [])

    const load = () => {

        setLoading(true);

        axios.get(`${BASE_URL}/api/questionEvaluate/?created_by=${Cookies.get("userId")}`, getDefaultHeaders())
            .then(res => {
                setLoading(false);

                setData(res.data)
            })
    }
    const handelDelete = (id) => {
        Swal.fire({
            text: 'Are you sure to delete this item?',
            showDenyButton: true,
            showConfirmButton: true
        }).then(({ isDenied }) => {

            if (isDenied) return;

            setLoading(true);

            axios.delete(`${BASE_URL}/api/questionEvaluate/${id}/`, getDefaultHeaders())
                .then(res => {
                    setData((prevData) =>
                        prevData.filter(item => item.id !== id)
                    );
                    setLoading(false);
                })
        })
    }
    return (
        <div>
            <div className="d-flex justify-content-between align-item-center">
                <h2>  My Questionnaire Evaluation</h2>
                <div>
                    <Link to="/myQuestionnaire/new">
                        <button className="btn btn-primary btn-sm">  + New </button>
                    </Link>
                </div>
            </div>

            <hr />
            {!loading ? <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        {/* <th scope="col">Image</th> */}
                        <th scope="col">Software_Name</th>
                        <th scope="col">Category</th>
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
                            {/* <td>{QuestionEvaluate.software.image && <a target="_blank" href={QuestionEvaluate.software.image.file}><img width="50" src={QuestionEvaluate.software.image.thumbnail} /></a>}</td> */}
                            <td>{QuestionEvaluate.software.software_name}</td>
                            <td>{QuestionEvaluate.select_category.name}</td>
                            <td>{QuestionEvaluate.people}</td>
                            <td>{QuestionEvaluate.created_by.first_name + ' ' + QuestionEvaluate.created_by.last_name + ' (' + QuestionEvaluate.created_by.email + ')'}</td>
                            <td>{moment(QuestionEvaluate.created_datetime).format("DD/MM/YYYY")}</td>
                            <td>
                                <button className="btn btn-outline-danger" onClick={() => handelDelete(QuestionEvaluate.id)}><i class="fas fa-trash-alt"></i>Delete</button>
                                <Link to={`/myQuestionnaire/${QuestionEvaluate.id}/edit/`}>
                                    <button className="btn btn-outline-primary ms-2"> <i class="fas fa-edit"></i>Edit </button>
                                </Link>

                                <Link to={`/resultQ/${QuestionEvaluate.software_id}/${QuestionEvaluate.select_category.id}`}>
                                    <button className="btn btn-outline-success ms-2">Result</button>
                                </Link>

                            </td>
                        </tr>
                    )}
                </tbody>
            </table> : <span>Loading...</span>}
        </div>
    )
}
export default MyQuestionnaire;
