import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { BASE_URL } from '../../inc/constants';
import { getDefaultHeaders } from '../../inc/functions';
// import { Card, ListGroup } from 'react-bootstrap';
import Rating from '../../components/Rating';
// import "~slick-carousel/slick/slick.css"; 
// import "~slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
function HomeScreen() {

  const settings = {
    // dots: true,
    // infinite: true,
    // speed: 500,
    // slidesToShow: 1,
    // slidesToScroll: 1
    dots: true,
    className: "center",
    infinite: true,
    centerPadding: "50px",
    slidesToShow: 5,
    swipeToSlide: true,
    backgroundColor:"black",
    afterChange: function(index) {
      console.log(
        `Slider Changed to: ${index + 1}, background: #222; color: #bada55`
      );
  }
}
    
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        //fetch data
        load();
    }, [])

    const load = () => {
        setLoading(true);
                    axios.get(`${BASE_URL}/api/software`, getDefaultHeaders())
            .then(res => {
                setLoading(false);

                setData(res.data)
            })
    }
  return (
    // <div className="container-fluid tm-container-content tm-mt-60">
    //   <div className="row tm-mb-90 tm-gallery">
    //     {data?.map(Software =>
    //       <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
    //         <figure className="effect-ming tm-video-item">
    //           {/* <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Shaqi_jrvej.jpg/1200px-Shaqi_jrvej.jpg" className="img-fluid" /> */}
    //           <td>{Software.image && <a target="#" href={Software.image.file}><img width="200" src={Software.image.thumbnail} alt="name" className="img-fluid"/></a>}</td>
    //           <figcaption className="d-flex align-items-center justify-content-center">
    //             <h2>{Software.software_name}</h2>
    //             <a href="photo-detail.html">View more</a>
    //           </figcaption>
    //         </figure>
    //         <div className="d-flex justify-content-between tm-text-gray">
    //           <span className="tm-text-gray-light">{Software.created_by.last_name}</span>
    //           {/* <span>{Software.email}</span> */}
               
    //         <Rating value={Software.rating} color={"#F8E825"} />
                
           
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div>
      <br/>
      <p style={{fontWeight:'bold',color:'#591DB3',fontSize:'25px'}}>Top softwares</p>
      <br/>
      <Slider {...settings}>
      {data?.map(Software =>
      <div>
      {Software.image && <a target="#" href={Software.image.file}><img width="150" src={Software.image.thumbnail} alt="name" className="img-fluid"/></a>}
      <h6>{Software.software_name}</h6>
      <Rating value={Software.rating} color={"#F8E825"} />
      </div>
      )}
      </Slider>
      <br/>
      <p style={{fontWeight:'bold',color:'#591DB3',fontSize:'25px'}}>Recently registered software</p>
      <br/>
      <div>
      <Slider {...settings}>
      {data?.map(Software =>
      <div>
      {Software.image && <a target="#" href={Software.image.file}><img width="150" src={Software.image.thumbnail} alt="name" className="img-fluid"/></a>}
      <h6>{Software.software_name}</h6>
      </div>
      )}
      </Slider>
      </div>
    </div>
  );
}




export default HomeScreen