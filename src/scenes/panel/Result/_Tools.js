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
import EqualizerIcon from '@mui/icons-material/Equalizer';

import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack';
import StarsIcon from '@mui/icons-material/Stars';


import { Dialog, DialogTitle, DialogContent, Collapse, } from '@mui/material';
import moment from 'moment';
import UserBioDialog from "../../../components/UserBioDialog"

import VerifiedIcon from '@mui/icons-material/Verified';
import Avatar from '@mui/material/Avatar'
import { MEDIABaseUrl } from "../../../config/server"

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { CSVLink } from 'react-csv'


import * as API from "../../../api";


import { useSelector, } from "react-redux";





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



export const Detail = ({ title, completed, deadline, published, max, evaluates, showDetail, setShowDetail, extra, chart, chartWidth = 500 }) => {

    const [openChart, setOpenChart] = React.useState(false);

    return <>
        <Typography variant='h6' textAlign='center'>
            {title}
        </Typography>
        <Typography variant='subtitle1' textAlign='center'>
            <b>Evaluators: </b>{evaluates} / {max}
        </Typography>
        <Typography variant='subtitle1' textAlign='center'>
            <b>Published:</b> {moment(published).format("YYYY-MM-DD HH:mm")}
        </Typography>
        {evaluates === max &&
            <Typography variant='subtitle1' textAlign='center'>
                <b>Completed:</b> {completed}
            </Typography>
        }
        <Typography variant='subtitle1' textAlign='center'>
            <b>Deadline:</b> {moment(deadline).format("YYYY-MM-DD")}
        </Typography>

        <Stack direction="row" columnGap={1} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
            <Button
                children={showDetail ? "Hide detail" : "Show detail"}
                variant='contained'
                onClick={setShowDetail}
            />
            {chart &&
                <IconButton color='warning' onClick={() => setOpenChart(true)}>
                    <EqualizerIcon />
                </IconButton>
            }
            {extra}
        </Stack>


        <Dialog
            open={openChart}
            onClose={() => setOpenChart(false)}
            sx={{ "& .MuiPaper-root": { maxWidth: "1000px" } }}
        >
            <DialogTitle>Charts</DialogTitle>
            <DialogContent sx={{ width: `${chartWidth}px` }}>
                {chart}
            </DialogContent>
            {/* <DialogActions> */}
            <Button children="ok" onClick={() => setOpenChart(false)} />
            {/* </DialogActions> */}
        </Dialog>

    </>
}






// =====================================

const _headers = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    {
        id: 'degree',
        numeric: false,
        disablePadding: false,
        label: 'Degree',
    },
    {
        id: 'date',
        numeric: false,
        disablePadding: false,
        label: 'Date',
    },
    {
        id: 'tools',
        numeric: false,
        disablePadding: false,
        label: 'Tools',
    },
]


function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell />
                {_headers.map((headCell) => (
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



export function UserDataTable({ rows = [], defaultOrderBy = 'id', defaultOrder = 'asc', csvData = [] }) {
    const [order, setOrder] = React.useState(defaultOrder);
    const [orderBy, setOrderBy] = React.useState(defaultOrderBy);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [openDetail, setOpenDetail] = React.useState(null);

    const csvLink = React.useRef()

    const downloadCSV = () => {
        csvLink.current.link.click()
    }


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
                <Button
                    children={"Export CSV"}
                    variant='outlined'
                    size='small'
                    onClick={downloadCSV}
                />
                <CSVLink
                    data={csvData}
                    filename='export_evaluation.csv'
                    className='hidden'
                    ref={csvLink}
                    target='_blank'
                />


                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>

                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return <>
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={row.id}
                                        >
                                            <TableCell>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => {
                                                        if (openDetail === row.id) setOpenDetail(null)
                                                        else setOpenDetail(row.id)
                                                    }}
                                                >
                                                    {openDetail === row.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </IconButton>
                                            </TableCell>
                                            {_headers.map(({ id }) => {
                                                return <TableCell align="center">{row[id]}</TableCell>
                                            })}
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                                <Collapse in={openDetail === row.id} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: 1 }}>
                                                        {row.detail}
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>
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




export const StarUser = ({ type = "metric", pid, uid, }) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [disabled, setDisabled] = React.useState(true);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const done = () => {
        setScore()
        handleClose()
    }

    const open = Boolean(anchorEl);
    const id = open ? 'set-score-' + type + "-" + pid : undefined;

    const [_score, _setScore] = React.useState(0)


    const getScore = async () => {
        setDisabled(true)
        try {
            const response = await API.GET()(`score/?user=${uid}&${type}=${pid}`)
            if (response.data && response.data[0]) {
                const sc = response.data[0].score
                _setScore(sc)
                setDisabled(true)
            }
            else {
                setDisabled(false)
            }
        } catch (error) {
            setDisabled(true)
        }
    }

    const setScore = async () => {
        try {
            await API.POST()(`score/`, { user: uid, [type]: pid, score: parseFloat(_score) })
        } catch (error) {

        }
    }


    React.useEffect(() => {
        if (open) getScore()
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
                        readOnly={disabled}
                        value={_score / 2}
                        onChange={(e) => _setScore(e.target.value * 2)}
                    />
                    <Button
                        children="Submit"
                        color='secondary'
                        onClick={done}
                        variant='contained'
                        disabled={disabled}
                    />
                </Stack>
            </Popover>
        </Stack>
    </>
}





export const UserDetail = ({ user }) => {
    const [openUserBioDialog, setUserBioDialog] = React.useState(false)
    return <>
        <Stack sx={{ cursor: "pointer" }} onClick={() => setUserBioDialog(true)}>
            <Stack direction="row" alignItems="center">
                <Avatar
                    alt={user.first_name + " " + user.last_name}
                    src={user.avatar ? MEDIABaseUrl + user.avatar?.medium : "/NO-AVATAR"}
                    sx={{ mr: 2 }}
                />
                <Rating
                    max={5}
                    value={user.stars / 2}
                    precision={0.5}
                    readOnly
                />
                ({user.evaluator_scores})
            </Stack>
            <Stack direction="row" alignItems="center">
                {user.first_name + " " + user.last_name}{user.is_verified && <VerifiedIcon sx={{ ml: 1, color: "rgb(29, 155, 240)" }} fontSize="small" />}
            </Stack>
            <Stack direction="row" alignItems="center">
                {user.email}
            </Stack>
        </Stack>
        <UserBioDialog
            open={openUserBioDialog}
            handleClose={() => { setUserBioDialog(false) }}
            userID={user?.id}
            name={user?.first_name + ' ' + user?.last_name}
            bio={user?.bio}
            is_verified={user?.is_verified}
            avatar={user?.avatar}
            stars={user?.stars}
            evaluator_scores={user?.evaluator_scores}
        />
    </>
}