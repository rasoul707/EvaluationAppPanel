import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "../../../components/Rating";
import { BASE_URL } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";

const ResultRating = ({ match }) => {
    const [data, setData] = useState();
    const id = match.params.id;
    const [loading, setLoading] = useState(false);
    const [softwareName, setSoftwareName] = useState('');
    const [recordsCount, setRecordsCount] = useState(0);

    useEffect(() => {
        load();
    }, [])

    const load = () => {
        axios.get(`${BASE_URL}/api/rankVlaue/?rankEvaluate_id=${id}`, getDefaultHeaders())
            .then(res => {
                setLoading(false);
                setData(res.data)
                setSoftwareName(res?.data[0]?.rankEvaluate.software.software_name);
                setRecordsCount(res?.data.length);
            });
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-item-center">
                <h4 style={{color:'#087436'}}>Results for software : {softwareName}</h4>
                <div>
                    <Link to="/myRating">
                        <button className="btn btn-primary btn-sm">Back</button>
                    </Link>
                </div>
            </div>
            
            <hr />

            {!loading ? <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Evaluated by</th>
                        <th scope="col">Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map(Stats =>
                        <tr>
                            <td>{Stats?.created_by?.first_name + ' ' + Stats?.created_by?.last_name}</td>
                            <td><Rating value={Stats?.rankValue} color={"#F8E825"} /></td>
                        </tr>
                    )}
                </tbody>
            </table> : <span>Loading...</span>}
            <h6 style={{color:'#fb9121'}}>Records count: {recordsCount}</h6>
        </div>
    )
}
export default ResultRating