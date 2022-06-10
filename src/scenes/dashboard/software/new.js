
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import Swal from 'sweetalert2'
import {useHistory } from "react-router-dom";
import Card from "../../../components/card";
import { getDefaultHeaders } from "../../../inc/functions";

const NewRoom = ({ match }) => {


    const id = match.params.id;

    const [image, setImage] = useState();
    const [name, setName] = useState();
    const [user, setUser] = useState();

    const history = useHistory()

    const handleSubmit = () => {
        axios.get(`${BASE_URL}/api/software/?created_by=&software_name=${name}`, getDefaultHeaders()).then(res => {
            if (res.data.length > 0) {
                Swal.fire({
                    text: 'Record already exists',
                    icon: 'error',
                });
                return;
            }
            else {
        const data = {
            software_name: name,
            image_id: image?.id,
            user : user
        }

        if (id) {
            // edit
            axios.put(`${BASE_URL}/api/software/${id}/`, data, getDefaultHeaders())
                .then(res => {
                    Swal.fire({
                        text: 'Software Name updated succussfuly',
                        icon: 'success',
                    });
                });
        } else {
            // create
            axios.post(`${BASE_URL}/api/software/`, data, getDefaultHeaders())
                .then(res => {
                    Swal.fire({
                        text: 'Software Name created succussfuly',
                        icon: 'success',
                    });
                })
        }

        history.push(`/software/`);
    }
});
}


    const loadObject = () => {
        axios.get(`${BASE_URL}/api/software/${id}/`, getDefaultHeaders()).then(res => {
            setName(res.data.software_name);
            setImage(res.data.image);
        });
    }

    // const loadRoomTypes = () => {
    //     axios.get(`${BASE_URL}/api/room-types/`, getDefaultHeaders()).then(res => {
    //         setRoomTypes(res.data);
    //     });
    // }

    useEffect(() => {
        // loadRoomTypes();
        if (id) {
            loadObject();
        }
    }, []);

    const handleChangeImage = ev => {
        const file = ev.target.files[0];

        console.log(file);

        if (!file) return;

        if (file.size > 1000000) {
            Swal.fire({
                text: 'Please select file lower than 1MB.',
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        axios.post(`${BASE_URL}/api/images/`, formData, getDefaultHeaders())
            .then(res => {
                setImage(res.data);
            })
    }

    return (
        <Card>
            <h2>{id ? "Edit" : "New"} Software</h2>

            <hr />

            <div class="mb-3">
                <div className="row">
                    <div className="col-8">
                        <label className="form-label">Image</label>
                        <input required={true} type="file" accept="image/*" class="form-control" onChange={handleChangeImage} />
                    </div>
                    <div className="col-4">
                        {image && <img src={image.medium} width="200" />}
                        {image && <button className="btn btn-secondary btn-sm ms-2" onClick={() => setImage(undefined)}>Remove</button>}
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label className="form-label"> Software Name </label>
                <input required={true} type="text" class="form-control" value={name} onChange={(ev) => setName(ev.target.value)} />
            </div>
            <div className="col-md-5">
                    <label className="form-label">Application Area</label>
                    <select required={true} className="form-control">
                        <option value={null} selected>Select an option</option>
                        {/* {.map(software =>
                            <option value={software.id}>{software.software_name}</option>
                        )} */}
                    </select>
                </div>
                <br/>
            
            <button onClick={handleSubmit} style={{ background: purpleColor }} type="submit" class="btn btn-primary">Submit</button>
        </Card>
    )
}

export default NewRoom;