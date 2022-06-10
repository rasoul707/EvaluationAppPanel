import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";
import Cookies from "js-cookie";
import moment from "moment";



const Rate = () => {
      
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const userId = Cookies.get("userId");
    useEffect(() => {
        //fetch data
        load();
    }, [])

    const load = () => {

        setLoading(true);

        axios.get(`${BASE_URL}/api/rankEvaluate/`, getDefaultHeaders())
            .then(res => {
                setLoading(false);

                setData(res.data)
            })
    }
    return (
        <div>
            <div className="d-flex justify-content-between align-item-center">
                <h2>Rating Evaluation</h2>
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
                    {data?.map(rankEvaluate =>
                        <tr>
                            <td>{rankEvaluate.id}</td>
                            <td>{rankEvaluate.software.image && <a href={rankEvaluate.software.image.file}><img width="50" src={rankEvaluate.software.image.thumbnail} alt="" /></a>}</td>
                            <td>{rankEvaluate.software.software_name}</td>
                            <td>{rankEvaluate.people}</td>
                            <td>{rankEvaluate.created_by.first_name + ' ' + rankEvaluate.created_by.last_name + ' (' + rankEvaluate.created_by.email + ')'}</td>
                            <td>{moment(rankEvaluate.created_datetime).format("DD/MM/YYYY")}</td>
                            <td>
                                <div>
                                    {
                                        (rankEvaluate.evaluated_by?.indexOf(userId + ",") !== -1 && rankEvaluate.isEvaluated.toString() === 'true' || parseInt(rankEvaluate.people) === 0) ?
                                            <button className="btn btn-success" disabled>Evaluate</button>
                                            :
                                            < Link to={`../evaluateR/${rankEvaluate.id}/`}>
                                                <button className="btn btn-success">Evaluate</button>
                                            </Link>
                                    }
                                </div>

                            </td>
                        </tr>
                    )}
                </tbody>
            </table> : <span>Loading...</span>}
        </div>
    )
}
export default Rate;
