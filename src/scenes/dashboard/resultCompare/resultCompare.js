import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";

const ResultCompare = ({ match }) => {
    const [data, setData] = useState();
    const id = match.params.id;
    const [loading, setLoading] = useState(false);
    const [softwareName, setSoftwareName] = useState('');
    const [software2Name, setSoftware2Name] = useState('');
    const [recordsCount, setRecordsCount] = useState(0);
    const [software1Count, setSoftware1Count] = useState(0);
    const [software2Count, setSoftware2Count] = useState(0);

    useEffect(() => {
        load();
    }, [])

    const load = () => {
        axios.get(`${BASE_URL}/api/compareValue/?compare_id=${id}`, getDefaultHeaders())
            .then(res => {
                setLoading(false);
                setData(res.data)
                setSoftwareName(res?.data[0]?.compare.software.software_name);
                setSoftware2Name(res?.data[0]?.compare.software_2.software_name);
                setRecordsCount(res?.data.length);

                axios.get(`${BASE_URL}/api/compareValue/?software=${res?.data[0]?.compare.software.id}&compare_id=${id}`, getDefaultHeaders())
                    .then(res => {
                        setSoftware1Count(res.data.length)
                    });

                axios.get(`${BASE_URL}/api/compareValue/?software=${res?.data[0]?.compare.software_2.id}&compare_id=${id}`, getDefaultHeaders())
                    .then(res => {
                        setSoftware2Count(res.data.length)
                    });
            });
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-item-center">
                <h4 style={{color:'#087436'}}>Results for software : {softwareName}</h4>
                <div>
                    <Link to="/myCompare">
                        <button className="btn btn-primary btn-sm">Back</button>
                    </Link>
                </div>
            </div>
            <br/>
            <div class="container">
            <div class="row">
              <div class="col">
              <h6 style={{color:'#068984'}}>{softwareName}: {software1Count}</h6>
                   </div>
                    <div class="col">
                    <h6 style={{color:'#068984'}}>{software2Name} : {software2Count}</h6>
                 </div>
            </div>
            </div>
            <hr />

            {!loading ? <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Evaluated by</th>
                        <th scope="col">Software Evaluated</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map(Stats =>
                        <tr>
                            <td>{Stats?.created_by?.first_name + ' ' + Stats?.created_by?.last_name}</td>
                            <td>{Stats?.software?.software_name}</td>
                        </tr>
                    )}
                </tbody>
            </table> : <span>Loading...</span>}
            <h6 style={{color:'#fb9121'}}>Records count: {recordsCount}</h6>
        </div>
    )
}
export default ResultCompare;