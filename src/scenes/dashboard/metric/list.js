import axios from "axios";
import Cookies from "js-cookie";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/card";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";
import moment from "moment";

const Metric = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const searchRef = useRef();
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState();
    const userId = Cookies.get("userId");

    useEffect(() => {
        //fetch data
        load();
    }, [category])

    useEffect(() => {
        loadCategories();
    }, [])

    const load = () => {

        setLoading(true);
        axios.get(`${BASE_URL}/api/metricEvaluate/?created_by=${''}&software_id=${''}&metric_category_id=${category}`, getDefaultHeaders())
            .then(res => {
                setLoading(false);
                setData(res.data);
            })

        // axios.get(`${BASE_URL}/api/metricEvaluate/`, getDefaultHeaders())
        //     .then(res => {
        //         setLoading(false);

        //         setData(res.data)
        //     })
    }

    const loadCategories = () => {
        axios.get(`${BASE_URL}/api/category/`, getDefaultHeaders()).then(res => {
            setCategories(res.data);
        });
    }
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <h4>MetricEvaluation</h4>
                

                <select className="form-select mx-sm-3 mb-2" value={category} onChange={ev => setCategory(ev.target.value)}>
                    <option value="">All Category</option>
                    {categories?.map(category =>
                        <option value={category.id}>{category.name}</option>
                    )}
                </select>
                </div>
            </div>

            <hr />
            {!loading ? <div class="table-responsive"><table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">Image</th>
                        <th scope="col">Software_Name</th>
                        <th scope="col">Category</th>
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
                            <td>{MetricEvaluate.software.image && <a href={MetricEvaluate.software.image.file}><img width="50" src={MetricEvaluate.software.image.thumbnail} alt="" /></a>}</td>
                            <td>{MetricEvaluate.software.software_name}</td>
                            <td>{MetricEvaluate.metric_category.name}</td>
                            <td>{MetricEvaluate.people}</td>
                            <td>{MetricEvaluate.created_by?.first_name + ' ' + MetricEvaluate.created_by?.last_name + ' (' + MetricEvaluate.created_by?.email + ')'}</td>
                            <td>{moment(MetricEvaluate.created_datetime).format("DD/MM/YYYY")}</td>
                            <div>
                                {
                                    (MetricEvaluate.evaluated_by?.indexOf(userId + ",") !== -1 && MetricEvaluate.isEvaluated.toString() === 'true' || parseInt(MetricEvaluate.people) === 0) ?
                                        <button className="btn btn-success" disabled>Evaluate</button>
                                        :
                                        < Link to={`../evaluateMetric/${MetricEvaluate.id}/`}>
                                            <button className="btn btn-success">Evaluate</button>
                                        </Link>
                                }
                            </div>
                        </tr>
                    )}
                </tbody>
            </table> </div> : <span>Loading...</span>}
        </div>
    )
}
export default Metric;
