import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";
import Cookies from "js-cookie";
import moment from "moment";

const Compare = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const userId = Cookies.get("userId");

    useEffect(() => {
        load();
    }, [])

    const load = () => {

        setLoading(true);

        axios.get(`${BASE_URL}/api/compare/`, getDefaultHeaders())
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

            axios.delete(`${BASE_URL}/api/compare/${id}/`, getDefaultHeaders())
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
                <h2>compare Evaluation</h2>
            </div>

            <hr />
            {!loading ? <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">Software_Name</th>
                        <th scope="col">Software_Name2</th>
                        <th scope="col">People</th>
                        <th scope="col">User</th>
                        <th scope="col">Created_datetime</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map(Compare =>
                        <tr>
                            <td>{Compare.id}</td>
                            <td>{Compare.software.software_name}</td>
                            <td>{Compare.software_2.software_name}</td>
                            <td>{Compare.people}</td>
                            <td>{Compare.created_by.first_name + ' ' + Compare.created_by.last_name + ' (' + Compare.created_by.email + ')'}</td>
                            <td>{moment(Compare.created_datetime).format("DD/MM/YYYY")}</td>
                            <td>
                                <div>
                                    {
                                        (Compare.evaluated_by?.indexOf(userId + ",") !== -1 && Compare.isEvaluated.toString() === 'true' || parseInt(Compare.people) === 0) ?
                                            <button className="btn btn-success" disabled>Evaluate</button>
                                            :
                                            < Link to={`../evaluateCompare/${Compare.id}/`}>
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
export default Compare;
