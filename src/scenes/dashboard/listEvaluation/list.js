import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";
import Cookies from "js-cookie"

const ListEvaluation = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        //fetch data
        load();
    }, [])

    const load = () => {

        setLoading(true);

        axios.get(`${BASE_URL}/api/metricEvaluate/`, getDefaultHeaders())
            .then(res => {
                setLoading(false);

                setData(res.data)
            })
    }
    const handleDelete = (id) => {
        Swal.fire({
            text: 'Are you sure to delete this item?',
            showDenyButton: true,
            showConfirmButton: true
        }).then(({ isDenied }) => {

            if (isDenied) return;

            setLoading(true);

            axios.delete(`${BASE_URL}/api/metricEvaluate/${id}/`, getDefaultHeaders())
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
                <h2>Metric Evaluation</h2>
                <div>
                    <Link to="/rooms/new/">
                        <button style={{ background: purpleColor }} className="btn btn-primary btn-sm">+ New</button>
                    </Link>
                </div>
            </div>

            <hr />
            {!loading ? <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">Software_Name</th>
                        <th scope="col">Metric</th>
                        <th scope="col">People</th>
                        <th scope="col">User</th>
                        <th scope="col">Created_datetime</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map(MetricEvaluate =>
                        <tr>
                            <td>{MetricEvaluate.id}</td>
                            <td>{MetricEvaluate.software.software_name}</td>
                            <td>{MetricEvaluate.metric_category.name}</td>
                            <td>{MetricEvaluate.people}</td>
                            <td>{MetricEvaluate.created_by.first_name + ' ' + MetricEvaluate.created_by.last_name + ' (' + MetricEvaluate.created_by.email + ')'}</td>
                            <td>{Date(MetricEvaluate.created_datetime)}</td>
                            <td>
                                <button className="btn btn-outline-danger" onClick={() => handleDelete(MetricEvaluate.id)}>Delete</button>
                                <Link to={`/rooms/${MetricEvaluate.id}/edit/`}>
                                    <button className="btn btn-outline-primary ms-2">Edit</button>
                                </Link>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table> : <span>Loading...</span>}
        </div>
    )
}
export default ListEvaluation;
