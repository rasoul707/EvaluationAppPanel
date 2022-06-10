import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../inc/constants";
import { getDefaultHeaders } from "../../inc/functions";
import Software from "./software/list";

const App = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        //fetch data
        load();
    }, [])

    const load = () => {

        setLoading(true);

        axios.get(`${BASE_URL}/api/software/`, getDefaultHeaders())
            .then(res => {
                setLoading(false);

                setData(res.data)
            })
    }
    return (
        <div>
            <div className="container-fluid tm-container-content tm-mt-60">
                <div className="row tm-mb-90 tm-gallery">
                    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
                        {!loading ? <table className="table">
                            <tbody>
                                {data?.map(Software =>
                                    <figcaption className="d-flex align-items-center justify-content-center">
                                        <h1>{Software.software_Name}</h1>
                                    </figcaption>
                                    // <td>{Software.image && <a target="_blank" href={Software.image.file}><img width="50" src={Software.image.thumbnail} /></a>}</td>

                                )}
                            </tbody>
                        </table> : <span>Loading...</span>}
                    </div>

                </div>
            </div>
        </div>


    )
}
export default Software;
