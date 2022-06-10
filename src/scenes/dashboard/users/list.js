import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Card from "../../../components/card";
import { BASE_URL } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";

const Users = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // fetch data
        load();
    }, [])

    const load = () => {

        setLoading(true);

        axios.get(`${BASE_URL}/api/users/`, getDefaultHeaders())
            .then(res => {
                setLoading(false);
                setData(res.data);
            })
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure to delete this user?',
            showDenyButton: true,
            showConfirmButton: true
        }).then(({ isDenied }) => {

            if (isDenied) return;

            setLoading(true);

            axios.delete(`${BASE_URL}/api/users/${id}/`, getDefaultHeaders())
                .then(res => {
                    setData((prevData) =>
                    ({
                        ...prevData,
                        results: prevData.results.filter(item => item.id !== id)
                    })

                    );
                    setLoading(false);
                })
        })
    }

    const cardMeta = <Link to="/users/new/">
        <button className="btn btn-primary btn-sm">+ New</button>
    </Link>
    return (
        <Card title="Users" meta={cardMeta}>
            {!loading ? <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.results?.map(user =>
                        <tr>
                            <td>{user.id}</td>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                                <Link to={`/users/${user.id}/edit/`}>
                                    <button className="btn btn-secondary ms-2">Edit</button>
                                </Link>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table> : <span>Loading...</span>}


        </Card>
    )
}

export default Users;