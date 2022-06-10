import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../inc/constants";
import Swal from 'sweetalert2'
import { useHistory } from 'react-router-dom';
import Card from "../../../components/card";
import { getDefaultHeaders } from "../../../inc/functions";

const NewUser = ({match}) => {

    const id = match.params.id;

    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [email, setEmail] = useState();
    const [role, setRole] = useState();
    const [pass, setPass] = useState();
    const [pass2, setPass2] = useState();

    const history = useHistory();

    const handleSubmit = () => {
        const data = {
            first_name: fname,
            last_name: lname,
            email: email,
            role: role,
            password: pass,
            password2: pass2
        }

        if (id) {
            // edit
            axios.put(`${BASE_URL}/api/users/${id}/`, data, getDefaultHeaders())
            .then(res => {
                Swal.fire({
                    text: 'User updated succussfuly',
                    icon: 'success',
                });
            });
        } else {
            // create
            axios.post(`${BASE_URL}/api/users/`, data, getDefaultHeaders())
            .then(res => {
                Swal.fire({
                    text: 'User created succussfuly',
                    icon: 'success',
                });
                history.push(`/users/${res.data.id}/edit/`);
            })
        }
        history.push(`/users/`);
        
    }


    const loadObject = () => {
        // axios.get(`${BASE_URL}/api/users/${id}/`, getDefaultHeaders()).then(res => {
        //     setName(res.data.name);
        // })
    }


    useEffect(() => {
        if (id) {
            loadObject();
        }
    }, [])

    return (
        <Card>
            <h2>{id ? "Edit" : "New"} User</h2>

            <hr/>

            <div class="mb-3">
                <label className="form-label">First Name</label>
                <input type="text" class="form-control" value={fname} onChange={(ev) => setFname(ev.target.value)} />
            </div>
            <div class="mb-3">
                <label className="form-label">Last Name</label>
                <input type="text" class="form-control" value={lname} onChange={(ev) => setLname(ev.target.value)} />
            </div>
            <div class="mb-3">
                <label className="form-label">Email</label>
                <input type="email" class="form-control" value={email} onChange={(ev) => setEmail(ev.target.value)} />
            </div>
            <div class="mb-3">
                <label className="form-label">Role</label>
                <select className="form-select" value={role} onChange={ev => setRole(ev.target.value)}>
                        <option disabled={true} selected={true}>Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="producer">Producer</option>
                        <option value="superadmin">Super Admin</option>
                        <option value="avaluator">Avaluator</option>
                </select>
            </div>
            <div class="mb-3">
                <label className="form-label">Password</label>
                <input type="password" class="form-control" value={pass} onChange={(ev) => setPass(ev.target.value)} />
            </div>
            <div class="mb-3">
                <label className="form-label">Password Confirm</label>
                <input type="password" class="form-control" value={pass2} onChange={(ev) => setPass2(ev.target.value)} />
            </div>
            <button onClick={handleSubmit} type="submit" class="btn btn-primary">Submit</button>
        </Card>
    )
}

export default NewUser;