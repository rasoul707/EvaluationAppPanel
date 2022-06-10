import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";
import moment from "moment";

const Software = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        //fetch data
        load();
    }, [])

    const load = () => {
        setLoading(true);
        axios.get(`${BASE_URL}/api/software/?created_by=${Cookies.get("userId")}`, getDefaultHeaders())
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

            axios.delete(`${BASE_URL}/api/software/${id}/`, getDefaultHeaders())
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
                <h2>Software Presentation </h2>
                <div>
                    <Link to="/software/new">
                        <button className="btn btn-primary btn-sm">  + New </button>
                    </Link>
                </div>
            </div>

            <hr />
            {!loading ? <table class="table table-striped">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">Software</th>
                        <th scope="col">Image</th>
                        <th scope="col">Created By</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map(Software =>
                        <tr>
                            <td>{Software.id}</td>
                            <td>{Software.software_name}</td>
                            <td>{Software.image && <a target="#" href={Software.image.file}><img width="50" src={Software.image.thumbnail} alt="name" /></a>}</td>
                            <td>{Software.created_by.first_name + ' ' + Software.created_by.last_name + ' (' + Software.created_by.email + ')'}</td>
                            <td>{moment(Software.created_datetime).format("DD/MM/YYYY")}</td>
                            <td>
                                <button className="btn btn-outline-danger" onClick={() => handelDelete(Software.id)}><i class="fas fa-trash-alt"></i> Delete </button>
                                {/* <i class="fas fa-trash-alt" onClick={() => handelDelete(Software.id)}></i>  */}
                                <Link to={`/software/${Software.id}/edit/`}>
                                <button className="btn btn-outline-primary ms-2"><i class="fas fa-edit"></i>Edit</button>
                                </Link>

                            </td>
                        </tr>
                    )}
                </tbody>
            </table> : <span>Loading...</span>}
        </div>
    )
}
export default Software;
