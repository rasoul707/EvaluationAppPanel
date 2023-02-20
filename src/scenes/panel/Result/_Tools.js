import * as React from 'react';


import { Typography, Button } from '@mui/material';
import { PieChart as RePieChart, Bar, BarChart as ReBarChart, Cell, XAxis, YAxis, CartesianGrid, Pie, Legend, ResponsiveContainer, Tooltip } from 'recharts';

import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import Popover from '@mui/material/Popover';


import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';


import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack';
import StarsIcon from '@mui/icons-material/Stars';

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



export const Detail = ({ title, completed, deadline, published, max, evaluates, showDetail, setShowDetail, extra }) => {

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
            children={showDetail ? "Hide detail" : "Show detail"}
            variant='contained'
            onClick={setShowDetail}
            sx={{ mt: 2 }}
        />


    </>
}






// =====================================


function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, headers } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headers.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'center'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}



export function UserDataTable({ headers = [], rows = [], defaultOrderBy = 'id', defaultOrder = 'asc' }) {
    const [order, setOrder] = React.useState(defaultOrder);
    const [orderBy, setOrderBy] = React.useState(defaultOrderBy);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);


    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }


    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                    >
                        <EnhancedTableHead
                            headers={headers}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={row.id}
                                    >
                                        {headers.map(({ id }) => {
                                            return <TableCell align="center">{row[id]}</TableCell>
                                        })}
                                    </TableRow>
                                })
                            }
                            {!rows.length && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" children="No data found" />
                                </TableRow>
                            )}
                            {emptyRows > 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}




export const StarUser = ({ type = "metric", pid, score = null }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const done = () => {
        //
        handleClose()
    }

    const open = Boolean(anchorEl);
    const id = open ? 'set-score-' + type + "-" + pid : undefined;

    const [_score, _setScore] = React.useState(0)

    React.useEffect(() => {
        if (open) _setScore(0)
    }, [open])


    return <>
        <Stack direction="row" spacing={1}>
            <IconButton color='secondary' onClick={handleClick}>
                <StarsIcon />
            </IconButton>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Stack direction="column" spacing={1}>
                    <Rating
                        max={5}
                        precision={0.5}
                        sx={{ p: 2 }}
                        readOnly={score !== null}
                        value={score !== null ? score / 2 : _score}
                        onChange={(e) => _setScore(e.target.value)}
                    />
                    <Button
                        children="Submit"
                        color='secondary'
                        onClick={done}
                        variant='contained'
                        disabled={score !== null}
                    />
                </Stack>
            </Popover>
        </Stack>
    </>
}
