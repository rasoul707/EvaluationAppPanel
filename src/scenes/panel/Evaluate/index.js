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



import MetricForm from "./_Metric"
import CommentForm from "./_Comment"
import RatingForm from "./_Rating"
import CompareForm from "./_Compare"
import QuestionnaireForm from "./_Questionnaire"

export default function Evaluation() {

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
        if (softData?.evaluations?.includes('metric')) await getMetricsItems()
        if (softData?.evaluations?.includes('comment')) await getCommentsItems()
        if (softData?.evaluations?.includes('rating')) await getRatingsItems()
        if (softData?.evaluations?.includes('compare')) await getComparesItems()
        if (softData?.evaluations?.includes('questionnaire')) await getQuestionnairesItems()
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
            const response = await API.GET()(`metric/evaluation/?software=${softID}`)
            setMetricData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getCommentsItems = async () => {
        try {
            const response = await API.GET()(`comment/evaluation/?software=${softID}`)
            setCommentData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getRatingsItems = async () => {
        try {
            const response = await API.GET()(`rating/evaluation/?software=${softID}`)
            setRatingData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getComparesItems = async () => {
        try {
            const response = await API.GET()(`compare/evaluation/?software=${softID}`)
            setCompareData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getQuestionnairesItems = async () => {
        try {
            const response = await API.GET()(`questionnaire/evaluation/?software=${softID}`)
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
            {softData?.evaluations?.includes('metric') && <Tab label="Metric" disabled={disabled} />}
            {softData?.evaluations?.includes('comment') && <Tab label="Comment" disabled={disabled} />}
            {softData?.evaluations?.includes('rating') && <Tab label="Rating" disabled={disabled} />}
            {softData?.evaluations?.includes('compare') && <Tab label="Compare" disabled={disabled} />}
            {softData?.evaluations?.includes('questionnaire') && <Tab label="Questionnaire" disabled={disabled} />}
        </Tabs>

        {softData?.evaluations?.includes('metric') &&
            <TabPanel value={activeTab} index={++indexTabs} disabled={disabled}>
                <MetricForm
                    data={metricData}
                    set={setMetricData}
                    disabled={disabled}
                />
            </TabPanel>
        }

        {softData?.evaluations?.includes('comment') &&
            <TabPanel value={activeTab} index={++indexTabs} disabled={disabled}>
                <CommentForm
                    data={commentData}
                    set={setCommentData}
                    disabled={disabled}
                    softID={softID}
                />
            </TabPanel>
        }

        {softData?.evaluations?.includes('rating') &&
            <TabPanel value={activeTab} index={++indexTabs} disabled={disabled}>
                <RatingForm
                    data={ratingData}
                    set={setRatingData}
                    disabled={disabled}
                />
            </TabPanel>
        }

        {softData?.evaluations?.includes('compare') &&
            <TabPanel value={activeTab} index={++indexTabs} disabled={disabled}>
                <CompareForm
                    data={compareData}
                    set={setCompareData}
                    disabled={disabled}
                />
            </TabPanel>
        }

        {softData?.evaluations?.includes('questionnaire') &&
            <TabPanel value={activeTab} index={++indexTabs} disabled={disabled}>
                <QuestionnaireForm
                    data={questionnaireData}
                    set={setQuestionnaireData}
                    disabled={disabled}
                />
            </TabPanel>
        }

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