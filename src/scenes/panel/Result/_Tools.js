import * as React from 'react';


import { Typography, Button } from '@mui/material';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';


const COLORS = ['#FFBB28', '#FF8042', '#0088FE', '#00C49F',]
const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}



export const PieChart = ({ data, title }) => {
    return <>
        <ResponsiveContainer width="100%" height={200}>
            <RePieChart width={400} height={400}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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





export const Detail = ({ title, completed, deadline, published, max, evaluates, excelData }) => {

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
        <Button
            children="Get Excel"
            variant='contained'
            onClick={downloadExcel}
            sx={{ mt: 2 }}
        />
    </>
}


