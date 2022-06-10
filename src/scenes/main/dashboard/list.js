import axios from "axios";
import './App.css';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";

// const Software = () => {
//     const[data,setData] = useState();
//     const [loading, setLoading] = useState(false);
//     useEffect(() => {
//         //fetch data
//         load();
//     },[])
    
//     const load = () => {

//         setLoading(true);
function App() {
    const [data, setData] = useState();
  
    useEffect(() => {
      load();
    }, []);
  
    const load = () => {
      axios.get('http://127.0.0.1:8000/api/software/')
        .then(res => {
          setData(res.data);
        })
    }

    //     axios.get(`${BASE_URL}/api/software/`, getDefaultHeaders())
    //         .then(res => {
    //                 setLoading(false);

    //                 setData(res.data)
    //         })
    // }
    // const handelDelete = (id) => {
    //     Swal.fire({
    //         text :'Are you sure to delete this item?',
    //         showDenyButton: true,
    //         showConfirmButton: true
    //     }).then (({isDenied}) => {

    //         if (isDenied) return;  

    //     setLoading(true); 

    //     axios.delete(`${BASE_URL}/api/software/${id}/`,getDefaultHeaders())
    //         .then(res => {
    //                 setData((prevData) =>
    //                 prevData.filter(item => item.id !== id)
    //             );
    //             setLoading(false);
    //         })
    //     })
    // }
    return (
        <div className="container-fluid tm-container-content tm-mt-60">
          <div className="row tm-mb-90 tm-gallery">
            {!data?.map(res =>
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
                <figure className="effect-ming tm-video-item">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Shaqi_jrvej.jpg/1200px-Shaqi_jrvej.jpg" className="img-fluid" />
                  <figcaption className="d-flex align-items-center justify-content-center">
                    <h2>{res.name}</h2>
                    <a href="photo-detail.html">View more</a>
                  </figcaption>
                </figure>
                <div className="d-flex justify-content-between tm-text-gray">
                  <span className="tm-text-gray-light">{res.username}</span>
                  <span>{res.email}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
export default App;
