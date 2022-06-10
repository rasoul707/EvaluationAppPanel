import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import Card from "../../../components/card";
import { getDefaultHeaders } from "../../../inc/functions";
import Swal from 'sweetalert2';
import { Link, useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const Evaluation = ({ match }) => {
    const [softwareId, setSoftwareId] = useState();
    const [softwareName, setSoftwareName] = useState('');
    const [categoryId, setCategoryId] = useState();
    const [categoryName, setCategoryName] = useState();
    const [metricCategories, setMetricCategories] = useState();
    const [metricValue, setMetricValue] = useState();
    const id = match.params.id;
    const userId = Cookies.get("userId");
    const history = useHistory()

    const loadCategory = () => {
        axios.get(`${BASE_URL}/api/category/${categoryId}`, getDefaultHeaders()).then(res => {
            setCategoryName(res.data.name);
        });
    }

    const loadSoftware = () => {
        axios.get(`${BASE_URL}/api/software/${softwareId}`, getDefaultHeaders()).then(res => {
            setSoftwareName(res.data.software_name);
        });
    }

    const loadMetricsForCategory = () => {
        axios.get(`${BASE_URL}/api/metricEvaluateDetails/?metricEvaluate=${id}`, getDefaultHeaders()).then(res => {
            setMetricCategories(res.data);
        });
    }

    const loadObject = () => {
        axios.get(`${BASE_URL}/api/metricEvaluate/${id}/`, getDefaultHeaders())
            .then(res => {
                setCategoryId(res.data.metric_category_id);
                setSoftwareId(res.data.software_id);

                loadSoftware()
                loadCategory()
                loadMetricsForCategory();
            });
    }

    useEffect(() => {
        loadObject();
    }, [categoryId, softwareId, id]);

    const handleSave = (metric_id) => {
        if (metricValue === '') {
            return
        }

        const data = {
            value: parseInt(metricValue),
            metric_id: metric_id,
            metricEvaluate_id: id,
        }

        axios.get(`${BASE_URL}/api/metricValues/?metricEvaluate=${id}&metric=${metric_id}&created_by=${userId}`, getDefaultHeaders())
            .then(res => {
                if (res.data.length !== 0) {
                    axios.put(`${BASE_URL}/api/metricValues/${res.data[0].id.toString()}/`, data, getDefaultHeaders())
                } else {
                    axios.post(`${BASE_URL}/api/metricValues/`, data, getDefaultHeaders())
                }
            });
    }

    const finishEvaluation = () => {
        axios.get(`${BASE_URL}/api/metricEvaluate/${id}`, getDefaultHeaders())
            .then(res => {
                const data = {
                    software_id: softwareId,
                    metric_category_id: categoryId,
                    isEvaluated: 'true',
                    people: parseInt(res.data.people) - 1,
                    evaluated_by: userId,
                }

                axios.put(`${BASE_URL}/api/metricEvaluate/${id}/`, data, getDefaultHeaders())
                    .then(res => {
                        Swal.fire({
                            text: 'Operation was successful',
                            icon: 'success',
                        });

                        history.push(`/metric/`)
                    })
            })
    }

    return (
        <Card>
            <h2>Metric Evaluate</h2>

            <hr />
            <div className="row mb-3">
                <div className="col-12">
                    <label className="form-label" style={{ fontWeight: 'bold' }}>Software Name:</label>&nbsp;<span style={{ color: 'green', fontSize: '20px' }}>{softwareName} </span>
                </div>

                <div className="col-12">
                    <label className="form-label" style={{ fontWeight: 'bold' }}>Category Name:</label>&nbsp;<span style={{ color: 'green', fontSize: '20px' }}>{categoryName} </span>
                </div>
                <br />
                <br />

                <label className="form-label" style={{ fontWeight: 'bold' }}>Enter Evaluations :</label> <br />

                {metricCategories?.map(metricCategory => (
                    <div className="col-md-6">
                        <p style={{ color: '#5C12CA' }} key={metricCategory.metric.id}>{metricCategory.metric.title}</p>

                        <input type="number" min="0" max="20" className="form-control" onChange={ev => setMetricValue(ev.target.value)} onBlur={ev => handleSave(metricCategory.metric.id)} required />

                    </div>
                ))}
                {/* {
                    recordUpdated &&
                    <h6 className="mt-3 text-success">Record successfully saved</h6>
                } */}
            </div>
            <div className="row">
                <div className="col-md-1">
                    <Link to={`/metric/`}>
                        <button className="btn btn-outline-primary">Back</button>
                    </Link>
                </div>
                <div className="col-md-4">
                    <button onClick={finishEvaluation} className="btn btn-outline-success">Finish Evaluation</button>
                </div>
            </div>

        </Card >
    )
}

export default Evaluation;