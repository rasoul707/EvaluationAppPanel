import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL, purpleColor } from "../../../inc/constants";
import Swal from 'sweetalert2'
import { useHistory } from "react-router-dom";
import Card from "../../../components/card";
import { getDefaultHeaders } from "../../../inc/functions";

const NewQuestionnaire = ({ match }) => {

    console.log(match);
    const id = match.params.id;


    // const [softwarename, setSoftwarename] = useState();
    const [people, setPeople] = useState();
    const [name,setName] = useState();

    // const [software,setSoftware] = useState();
    const [category,setCategory] = useState();

    const history = useHistory();

    const handleSubmit = () => {
        const data = {
            people: people
        }

        if (id) {
            // edit
            axios.put(`${BASE_URL}/api/metricEvaluate/${id}/`, data, getDefaultHeaders())
                .then(res => {
                    Swal.fire({
                        text: 'Room type updated succussfuly',
                        icon: 'success',
                    });
                });
        } else {
            // create
            axios.post(`${BASE_URL}/api/metricEvaluate/`, data, getDefaultHeaders())
                .then(res => {
                    Swal.fire({
                        text: 'Room type created succussfuly',
                        icon: 'success',
                    });
                    history.push(`/room-types/${res.data.id}/edit/`);
                })
        }


    }


    const loadObject = () => {
        axios.get(`${BASE_URL}/api/metricEvaluate/${id}/`, getDefaultHeaders()).then(res => {
            setPeople(res.data.people);
        })
    }

    // const loadSoftware = () => {
    //     axios.get(`${BASE_URL}/api/software/`,getDefaultHeaders()).then(res => {
    //         setSoftware(res.data);
    //     })

    // }

    const loadCategory = () => {

        axios.get(`${BASE_URL}/api/category/`,getDefaultHeaders()).then(res => {
            setCategory(res.data);
        })
    
    }

    useEffect(() => {

        // loadSoftware();
        loadCategory();
        if (id) {
            loadObject();
        }
    }, []);

    return (
        <Card>
            <h2>{id ? "Edit" : "New"} Metric Evaluate</h2>

            <hr />

            {/* <div class="mb-3">
                <label className="form-label">Software Name</label>
                <select className="form-select" value={softwarename} onChange={ev => setSoftwarename(ev.target.value)}>
                    {software?.results.map(rsoftwarename =>
                        <option value={rsoftwarename.id}>{rsoftwarename.name}</option>
                    )}
                </select>
            </div> */}

            <div class="mb-3">
                <label className="form-label">Select Category</label>
                <select className="form-select" value={name} onChange={ev => setName(ev.target.value)}>
                   {/* <option value = "1" >software 1</option>
                   <option value = "2" >software 2</option> */}
                    {category?.results.map(rname =>
                        <option value={rname.id}>{rname.name}</option>
                    )}
                </select>
            </div>


            <div class="mb-3">
                <label className="form-label">People</label>
                <input type="text" class="form-control" value={people} onChange={(ev) => setPeople(ev.target.value)} />
            </div>

            <div class="mb-3">
                <label className="form-label">People</label>
                <input type="text" class="form-control" value={people} onChange={(ev) => setPeople(ev.target.value)} />
            </div>
            
            <button onClick={handleSubmit} style={{ background: purpleColor }} type="submit" class="btn btn-primary">Submit</button>
        </Card>
    )
}

export default NewQuestionnaire;