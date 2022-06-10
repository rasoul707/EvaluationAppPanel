

import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

const MyMetric = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        //fetch data
        load();
    }, [])

    const load = () => {
        setLoading(true);

        axios.get(`${BASE_URL}/api/metricEvaluate/?created_by=${Cookies.get("userId")}`, getDefaultHeaders())
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
                <h4> MY Metric Evaluation</h4>
                <div>
                    <Link to="/myMetric/new">
                        <button className="btn btn-primary btn-sm">  + New </button>
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
                            <td>{moment(MetricEvaluate.created_datetime).format("DD/MM/YYYY")}</td>
                            <td>
                                {/* <FontAwesomeIcon onClick={() => handelDelete(MetricEvaluate.id)} icon="trash" /> */}
                                <button className="btn btn-outline-danger" onClick={() => handelDelete(MetricEvaluate.id)}><i class="fas fa-trash-alt"></i>Delete</button>
                                <Link to={`/myMetric/${MetricEvaluate.id}/edit/`}>
                                    <button className="btn btn-outline-primary ms-2"> <i class="fas fa-edit"></i>Edit </button>
                                </Link>

                                <Link to={`/resultMetric/${MetricEvaluate.id}`}>
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
export default MyMetric;



// import axios from "axios";
// import Cookies from "js-cookie";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
// import { BASE_URL } from "../../../inc/constants";
// import { getDefaultHeaders } from "../../../inc/functions";

// const MyMetric = () => {
//     const [data, setData] = useState();
//     const [loading, setLoading] = useState(false);
//     useEffect(() => {
//         //fetch data
//         load();
//     }, [])

//     const load = () => {

//         setLoading(true);

//         axios.get(`${BASE_URL}/api/metricEvaluate/?created_by=${Cookies.get("userId")}`, getDefaultHeaders())
//             .then(res => {
//                 setLoading(false);

//                 setData(res.data)
//             })
//     }
//     const handelDelete = (id) => {
//         Swal.fire({
//             text: 'Are you sure to delete this item?',
//             showDenyButton: true,
//             showConfirmButton: true
//         }).then(({ isDenied }) => {

//             if (isDenied) return;

//             setLoading(true);

//             axios.delete(`${BASE_URL}/api/metricEvaluate/${id}/`, getDefaultHeaders())
//                 .then(res => {
//                     setData((prevData) =>
//                         prevData.filter(item => item.id !== id)
//                     );
//                     setLoading(false);
//                 })
//         })
//     }
//     return (
//         <div>
//             <div className="d-flex justify-content-between align-item-center">
//                 <h2>  My Metric Evaluation</h2>
//                 <div>
//                     <Link to="/myMetric/new">
//                         <button className="btn btn-primary btn-sm">  + New </button>
//                     </Link>
//                 </div>
//             </div>

//             <hr />
//             {!loading ? <table className="table table-striped">
//                 <thead>
//                     <tr>
//                         <th scope="col">id</th>
//                         <th scope="col">Image</th>
//                         <th scope="col">Software_Name</th>
//                         <th scope="col">Category</th>
//                         <th scope="col">People</th>
//                         <th scope="col">User</th>
//                         <th scope="col">Created_datetime</th>
//                         <th scope="col">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data?.map(MetricEvaluate =>
//                         <tr>
//                             <td>{MetricEvaluate.id}</td>
//                             <td>{MetricEvaluate.software.image && <a target="_blank" href={MetricEvaluate.software.image.file}><img width="50" src={MetricEvaluate.software.image.thumbnail} /></a>}</td>
//                             <td>{MetricEvaluate.software.software_name}</td>
//                             <td>{MetricEvaluate.metric_category.name}</td>
//                             <td>{MetricEvaluate.people}</td>
//                             <td>{MetricEvaluate.created_by.first_name + ' ' + MetricEvaluate.created_by.last_name + ' (' + MetricEvaluate.created_by.email + ')'}</td>
//                             <td>{MetricEvaluate.created_datetime}</td>
//                             <td>
//                                 <button className="btn btn-outline-danger" onClick={() => handelDelete(MetricEvaluate.id)}><i class="fas fa-trash-alt"></i>Delete</button>
//                                 <Link to={`/myMetric/${MetricEvaluate.id}/edit/`}>
//                                     <button className="btn btn-outline-primary ms-2"> <i class="fas fa-edit"></i>Edit </button>
//                                 </Link>

//                                 <Link to={`/resultM/${MetricEvaluate.software_id}/${MetricEvaluate.select_category.id}`}>
//                                     <button className="btn btn-outline-success ms-2"><i class="bi bi-file-bar-graph"></i>Result</button>
//                                 </Link>

//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table> : <span>Loading...</span>}
//         </div>
//     )
// }
// export default MyMetric;

