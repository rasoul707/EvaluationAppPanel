import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";
import Cookies from "js-cookie";
import moment from "moment";

const MyComment = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        //fetch data
        load();
    }, [])

    const load = () => {

        setLoading(true);

        axios.get(`${BASE_URL}/api/commentEvaluate/?created_by=${Cookies.get("userId")}`, getDefaultHeaders())
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

            if (isDenied) return

            setLoading(true);

            axios.delete(`${BASE_URL}/api/commentEvaluate/${id}/`, getDefaultHeaders())
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
                <h2> Comment Evaluation</h2>
                <div>
                    <Link to="/myComment/new">
                        <button style={{ background: purpleColor }} className="btn btn-primary btn-sm">  + New </button>
                    </Link>
                </div>
            </div>

            <hr />
            {!loading ? <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">id</th>
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
                            <td>{CommentEvaluate.software.software_name}</td>
                            <td>{CommentEvaluate.people}</td>
                            <td>{CommentEvaluate.created_by.first_name + ' ' + CommentEvaluate.created_by.last_name + ' (' + CommentEvaluate.created_by.email + ')'}</td>
                            <td>{moment(CommentEvaluate.created_datetime).format("DD/MM/YYYY")}</td>
                            <td>
                                <button className="btn btn-outline-danger" onClick={() => handelDelete(CommentEvaluate.id)}><i class="fas fa-trash-alt"></i>Delete</button>
                                <Link to={`/myComment/${CommentEvaluate.id}/edit/`}>
                                    <button className="btn btn-outline-primary ms-2"> <i class="fas fa-edit"></i>Edit </button>
                                </Link>
                                <Link to={`/resultcomment/${CommentEvaluate.id}`}>
                                    <button className="btn btn-outline-success ms-2"><i class="bi bi-file-bar-graph"></i>Result</button>
                                </Link>


                            </td>
                        </tr>
                    )}
                </tbody>
            </table> : <span>Loading...</span>}
        </div>
    )
}
export default MyComment;
