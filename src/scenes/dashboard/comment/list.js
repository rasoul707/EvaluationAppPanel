import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";
import Cookies from "js-cookie";
import moment from "moment";

const Comment = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const userId = Cookies.get("userId");
    useEffect(() => {
        //fetch data
        load();
    }, [])

    const load = () => {

        setLoading(true);

        axios.get(`${BASE_URL}/api/commentEvaluate/`, getDefaultHeaders())
            .then(res => {
                setLoading(false);

                setData(res.data)
            })
    }
    return (
        <div>
            <div className="d-flex justify-content-between align-item-center">
                <h2>Comment Evaluation</h2>
            </div>

            <hr />
            {!loading ? <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">Image</th>
                        <th scope="col">Software_Name</th>
                        <th scope="col">People</th>
                        <th scope="col">User</th>
                        <th scope="col">Created_datetime</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map(CommentEvaluate =>
                        <tr>
                            <td>{CommentEvaluate.id}</td>
                            <td>{CommentEvaluate.software.image && <a href={CommentEvaluate.software.image.file}><img width="50" src={CommentEvaluate.software.image.thumbnail} alt="" /></a>}</td>
                            <td>{CommentEvaluate.software.software_name}</td>
                            <td>{CommentEvaluate.people}</td>
                            <td>{CommentEvaluate.created_by?.first_name + ' ' + CommentEvaluate.created_by?.last_name + ' (' + CommentEvaluate.created_by?.email + ')'}</td>
                            <td>{moment(CommentEvaluate.created_datetime).format("DD/MM/YYYY")}</td>
                            <div>
                                {
                                    (CommentEvaluate.evaluated_by?.indexOf(userId + ",") !== -1 && CommentEvaluate.isEvaluated.toString() === 'true' || parseInt(CommentEvaluate.people) === 0) ?
                                        <button className="btn btn-success" disabled>Evaluate</button>
                                        :
                                        < Link to={`../evaluateComment/${CommentEvaluate.id}/`}>
                                            <button className="btn btn-success">Evaluate</button>
                                        </Link>
                                }
                            </div>
                        </tr>
                    )}
                </tbody>
            </table> : <span>Loading...</span>}
        </div>
    )
}
export default Comment;
