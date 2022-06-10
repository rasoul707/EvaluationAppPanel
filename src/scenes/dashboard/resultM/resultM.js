import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";
import Accordion from 'react-bootstrap/Accordion';

const ResultMetric = ({ match }) => {
    const [distinctEvaluatees, setDistinctEvaluatees] = useState();
    const [data, setData] = useState();
    const id = match.params.id;
    const [loading, setLoading] = useState(false);
    const [softwareName, setSoftwareName] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [recordsCount, setRecordsCount] = useState(0);

    useEffect(() => {
        load();

    }, [])

    const load = () => {
        axios.get(`${BASE_URL}/api/metricValues/?metricEvaluate=${id}`, getDefaultHeaders())
            .then(res => {
                setLoading(false);
                setData(res.data)
                setSoftwareName(res?.data[0]?.metricEvaluate?.software?.software_name);
                setCategoryName(res?.data[0]?.metricEvaluate?.metric_category?.name);

                // Get distinct evaluatees //
                const result = [];
                const map = new Map();
                for (const item of res.data) {
                    if (!map.has(item.created_by.id)) {
                        map.set(item.created_by.id, true);
                        result.push({
                            id: item.id,
                            evaluatedby_id: item.created_by.id,
                            evaluatedby: item.created_by.first_name + ' ' + item.created_by.last_name,
                        });
                    }
                }

                setDistinctEvaluatees(result)
                setRecordsCount(result?.length);
                // Get distinct evaluatees //
            });
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-item-center">
                <h5 style={{color:'#087436'}}>Result for Software: {softwareName}</h5>
                    <br/>
                   <h5 style={{color:'#087436'}}>Category: {categoryName} </h5> 
                <div>
                    <Link to="/myMetric">
                        <button className="btn btn-primary btn-sm">Back</button>
                    </Link>
                </div>
            </div>
            <br/>

            {!loading ? <Accordion defaultActiveKey="0">
                {distinctEvaluatees?.map(distinctStats =>
                    <Accordion.Item eventKey={distinctStats?.id}>
                        <Accordion.Header>{distinctStats?.evaluatedby}</Accordion.Header>
                        <Accordion.Body>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Metric</th>
                                        <th scope="col">value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.filter(el => el.created_by.id === distinctStats.evaluatedby_id).map(Stats =>
                                        <tr>
                                            <td>{Stats?.metric.title}</td>
                                            <td>{Stats?.value}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Accordion.Body>
                    </Accordion.Item>
                )}
            </Accordion> : <span>Loading...</span>}
            <br/>

            <h6 style={{color:'#fb9121'}}>Records count: {recordsCount}</h6>
            <Link to={'/ResultExcellMetric'}>
                <button className="btn btn-info ms-2">Export to Excel</button>
            </Link>
        </div>
    )
}
export default ResultMetric;