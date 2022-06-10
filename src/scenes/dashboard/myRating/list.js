import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";
import Cookies from "js-cookie";
import moment from "moment";

const MyRating= () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        //fetch data
        load();
    }, [])

    const load = () => {

        setLoading(true);

        axios.get(`${BASE_URL}/api/rankEvaluate/?created_by=${Cookies.get("userId")}`, getDefaultHeaders())
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

            axios.delete(`${BASE_URL}/api/rankEvaluate/${id}/`, getDefaultHeaders())
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
                <h2> Rating Evaluation</h2>
                <div>
                    <Link to="/myRating/new">
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
                    {data?.map(RankEvaluate =>
                        <tr>
                            <td>{RankEvaluate.id}</td>
                            <td>{RankEvaluate.software.software_name}</td>
                            <td>{RankEvaluate.people}</td>
                            <td>{RankEvaluate.created_by.first_name + ' ' + RankEvaluate.created_by.last_name + ' (' + RankEvaluate.created_by.email + ')'}</td>
                            <td>{moment(RankEvaluate.created_datetime).format("DD/MM/YYYY")}</td>
                            <td>
                                <button className="btn btn-outline-danger" onClick={() => handelDelete(RankEvaluate.id)}><i class="fas fa-trash-alt"></i>Delete</button>
                                <Link to={`/myRating/${RankEvaluate.id}/edit/`}>
                                    <button className="btn btn-outline-primary ms-2"> <i class="bi bi-file-bar-graph"></i>Edit </button>
                                </Link>

                                <Link to={`/resultRating/${RankEvaluate.id}`}>
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
export default MyRating;
