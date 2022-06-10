import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";
import Accordion from 'react-bootstrap/Accordion';

const ResultQuestion = ({ match }) => {
    const [distinctEvaluatees, setDistinctEvaluatees] = useState();
    const [data, setData] = useState();
    const softwareid = match.params.softwareid;
    const categoryid = match.params.categoryid;
    const [loading, setLoading] = useState(false);
    const [softwareName, setSoftwareName] = useState('');
    const [recordsCount, setRecordsCount] = useState(0);

    useEffect(() => {
        load();

    }, [])

    const load = () => {
        axios.get(`${BASE_URL}/api/questionnaireStats/?softwareid=${softwareid}&category_id=${categoryid}`, getDefaultHeaders())
            .then(res => {
                setLoading(false);
                setData(res.data)
                setSoftwareName(res?.data[0]?.software_name);

                // Get distinct evaluatees //
                const result = [];
                const map = new Map();
                for (const item of res.data) {
                    if (!map.has(item.evaluatedby_id)) {
                        map.set(item.evaluatedby_id, true);
                        result.push({
                            id: item.id,
                            evaluatedby_id: item.evaluatedby_id,
                            evaluatedby: item.evaluatedby,
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
                <h4 style={{color:'#087436'}}>Result for software: {softwareName}</h4>
                <div>
                    <Link to="/myQuestionnaire">
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
                                        <th scope="col">Question</th>
                                        <th scope="col">value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.filter(el => el.evaluatedby_id === distinctStats.evaluatedby_id).map(Stats =>
                                        <tr>
                                            <td>{Stats?.Question}</td>
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
        </div>
    )
}
export default ResultQuestion;