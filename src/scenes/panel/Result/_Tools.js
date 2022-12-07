import * as React from 'react';


import { Typography, Button } from '@mui/material';
import { PieChart as RePieChart, Bar, BarChart as ReBarChart, Cell, XAxis, YAxis, CartesianGrid, Pie, Legend, ResponsiveContainer, Tooltip } from 'recharts';

import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

const colors = scaleOrdinal(schemeCategory10).range();



const RADIAN = Math.PI / 180
const renderCustomizedLabel = (data) => ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return "(" + (percent * 100).toFixed(0) + "%)"
}




export const PieChart = ({ data, title }) => {

    return <>
        <ResponsiveContainer width={"100%"} height={200}>
            <RePieChart >
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel(data)}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                    ))}
                </Pie>
                <Tooltip />
            </RePieChart>
        </ResponsiveContainer>
        <Typography variant='subtitle1' textAlign='center'>
            {title}
        </Typography>
    </>
}







export const BarChart = ({ data, params, title }) => {
    return <>
        <ResponsiveContainer width="100%" height={200}>
            <ReBarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {params?.map(({ name, fill }, index) => (
                    <Bar dataKey={name} fill={colors[index % 20]} />
                ))}
            </ReBarChart>
        </ResponsiveContainer>
        <Typography variant='subtitle1' textAlign='center'>
            {title}
        </Typography>
    </>
}



export const Detail = ({ title, completed, deadline, published, max, evaluates, excelData, extra }) => {

    const downloadExcel = () => {
        alert("coming soon...")
    }


    return <>
        <Typography variant='h6' textAlign='center'>
            {title}
        </Typography>
        <Typography variant='subtitle1' textAlign='center'>
            <b>Evaluators: </b>{evaluates} / {max}
        </Typography>
        <Typography variant='subtitle1' textAlign='center'>
            <b>Published:</b> {published}
        </Typography>
        {evaluates === max &&
            <Typography variant='subtitle1' textAlign='center'>
                <b>Completed:</b> {completed}
            </Typography>
        }
        <Typography variant='subtitle1' textAlign='center'>
            <b>Deadline:</b> {deadline}
        </Typography>
        {extra}
        <Button
            children="Get Excel"
            variant='contained'
            onClick={downloadExcel}
            sx={{ mt: 2 }}
        />

    </>
}


