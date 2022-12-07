/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import * as React from 'react';
import { useParams, useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';



import { Card, CircularProgress } from '@mui/material';
import Layout from "../../../components/Layout"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import PropTypes from 'prop-types';

import SoftwareItem from "../../../components/SoftwareItem"

import * as API from "../../../api";



import Metric from "./_Metric"
import Comment from "./_Comment"
import Rating from "./_Rating"
import Compare from "./_Compare"
import Questionnaire from "./_Questionnaire"



export default function Result() {

    const params = useParams()
    const history = useHistory()


    const { enqueueSnackbar, } = useSnackbar()


    const softID = parseInt(params.softID)

    const [isInitial, setInitial] = React.useState(true);
    const [softData, setSoftData] = React.useState(null);
    const [disabled, setDisabled] = React.useState(true);





    const [activeTab, setActiveTab] = React.useState(0);
    const handleChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    const getSoftware = async () => {
        try {
            const response = await API.GET()(`software/softs/${softID}/`)
            setSoftData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
            history.replace("/")
        }
    }






    React.useEffect(() => {
        if (isInitial) {
            getSoftware()
        }
    }, [params])


    const performData = async () => {
        await getMetricsItems()
        await getCommentsItems()
        await getRatingsItems()
        await getComparesItems()
        await getQuestionnairesItems()
        setDisabled(false)
        setInitial(false)
    }

    React.useEffect(() => {
        if (softData && isInitial) {
            performData()
        }
    }, [softData])





    /************************************** */
    const [metricData, setMetricData] = React.useState([])
    const [commentData, setCommentData] = React.useState([])
    const [ratingData, setRatingData] = React.useState([])
    const [compareData, setCompareData] = React.useState([])
    const [questionnaireData, setQuestionnaireData] = React.useState([])




    /************************************** */


    const getMetricsItems = async () => {
        try {
            const response = await API.GET()(`metric/result/?software=${softID}`)
            setMetricData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getCommentsItems = async () => {
        try {
            const response = await API.GET()(`comment/result/?software=${softID}`)
            setCommentData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getRatingsItems = async () => {
        try {
            const response = await API.GET()(`rating/result/?software=${softID}`)
            setRatingData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getComparesItems = async () => {
        try {
            const response = await API.GET()(`compare/result/?software=${softID}`)
            setCompareData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getQuestionnairesItems = async () => {
        try {
            const response = await API.GET()(`questionnaire/result/?software=${softID}`)
            setQuestionnaireData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    // ************************************



    let indexTabs = -1
    const panel = <Card sx={{ mt: 2 }}>
        <Tabs
            value={activeTab}
            onChange={handleChange}
            scrollButtons="false"
            variant='scrollable'
            sx={{ borderColor: 'divider', borderWidth: 1 }}
            allowScrollButtonsMobile
        >
            <Tab label="Metric" disabled={disabled} />
            <Tab label="Comment" disabled={disabled} />
            <Tab label="Rating" disabled={disabled} />
            <Tab label="Compare" disabled={disabled} />
            <Tab label="Questionnaire" disabled={disabled} />
        </Tabs>


        <TabPanel value={activeTab} index={++indexTabs} disabled={disabled}>
            <Metric data={metricData} />
        </TabPanel>


        <TabPanel value={activeTab} index={++indexTabs} disabled={disabled}>
            <Comment data={commentData} />
        </TabPanel>


        <TabPanel value={activeTab} index={++indexTabs} disabled={disabled}>
            <Rating data={ratingData} />
        </TabPanel>


        <TabPanel value={activeTab} index={++indexTabs} disabled={disabled}>
            <Compare data={compareData} />
        </TabPanel>


        <TabPanel value={activeTab} index={++indexTabs} disabled={disabled}>
            <Questionnaire data={questionnaireData} />
        </TabPanel>

    </Card>

    const loading = <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 30 }}>
        <CircularProgress size={20} />
    </div>

    return <Layout>
        <SoftwareItem data={softData} noTools />
        {isInitial ? loading : panel}
    </Layout >


}





function TabPanel(props) {
    const { children, value, index, disabled, ...other } = props;

    return (
        <div
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }} disabled>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};