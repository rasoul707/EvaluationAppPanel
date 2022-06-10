import { Container } from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import {CSVLink} from 'react-csv';
import { BASE_URL } from "../../../inc/constants";
import { getDefaultHeaders } from "../../../inc/functions";

const Exportexcel = () => {
    const [data, setData] = useState();
 
    const [softwareName, setSoftwareName] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [recordsCount, setRecordsCount] = useState(0);

    alert("hi");
    const [userdata,,setUserdata]=useState([]);

    const load = () => {
        axios.get(`${BASE_URL}/api/metricValues/`, getDefaultHeaders())
            .then(res => {
                setData(res.data)
                setSoftwareName(res?.data[0]?.metricEvaluate?.software?.software_name);
                setCategoryName(res?.data[0]?.metricEvaluate?.metric_category?.name);

            });
        }
useEffect(() => {
    load();
            
}, []);

  return (
<div>

</div>
    
 )
}
export default Exportexcel;