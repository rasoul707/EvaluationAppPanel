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

export default function DefineEvaluation() {

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
            const response = await API.GET()(`software/${softID}/`)
            setSoftData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
            history.replace("/softwares")
        }
    }










    React.useEffect(() => {
        if (isInitial) {
            getSoftware()
        }
    }, [params])


    const performData = async () => {
        await getMetricsCategories()
        await getMetricsParameters()
        await getSectionsList()
        await getTargetSoftwareList()
        await getQuestionnairesCategories()
        await getQuestionnairesParameters()

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

    const [metricsCategoriesList, setMetricsCategoriesList] = React.useState([])
    const [metricsParametersList, setMetricsParametersList] = React.useState({})
    const [sectionsList, setSectionsList] = React.useState([])
    const [targetSoftwareList, setTargetSoftwareList] = React.useState([])
    const [questionnairesCategoriesList, setQuestionnairesCategoriesList] = React.useState([])
    const [questionnairesParametersList, setQuestionnairesParametersList] = React.useState({})

    const getMetricsCategories = async () => {
        try {
            const response = await API.GET()('metric/category/')
            setMetricsCategoriesList(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getMetricsParameters = async () => {
        try {
            const response = await API.GET()(`metric/parameter/`)
            let v = {}
            response.data.map(({ category, id, title }) => {
                if (!v[category]) v[category] = []
                v[category].push({ id, title })
            })
            setMetricsParametersList(v)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getSectionsList = async () => {
        try {
            const response = await API.GET()(`software/section/`)
            setSectionsList([
                ...response.data?.map((option) => {
                    return {
                        ...option,
                    }
                })
            ])
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getTargetSoftwareList = async () => {
        try {
            const response = await API.GET()(`software/softs/?area=${softData.area_id}`)
            setTargetSoftwareList(response.data.filter(({ id }) => id !== softID))
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getQuestionnairesCategories = async () => {
        try {
            const response = await API.GET()('questionnaire/category/')
            setQuestionnairesCategoriesList(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getQuestionnairesParameters = async () => {
        try {
            const response = await API.GET()(`questionnaire/parameter/`)
            let v = {}
            response.data.map(({ category, id, title }) => {
                if (!v[category]) v[category] = []
                v[category].push({ id, title })
            })
            setQuestionnairesParametersList(v)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    /************************************** */


    const getMetricsItems = async () => {
        try {
            const response = await API.GET()(`metric/?software=${softID}`)
            setMetricData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getCommentsItems = async () => {
        try {
            const response = await API.GET()(`comment/?software=${softID}`)
            setCommentData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getRatingsItems = async () => {
        try {
            const response = await API.GET()(`rating/?software=${softID}`)
            setRatingData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getComparesItems = async () => {
        try {
            const response = await API.GET()(`compare/?software=${softID}`)
            setCompareData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    const getQuestionnairesItems = async () => {
        try {
            const response = await API.GET()(`questionnaire/?software=${softID}`)
            setQuestionnaireData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }

    // ************************************


    const addNewSection = async (title) => {
        try {
            const response = await API.POST()(`software/section/`, { title })
            setSectionsList([...sectionsList, response.data])
            await addSectionToSoftware(response.data.id)
            return response.data.id
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
            return 'error'
        }
    }

    const addSectionToSoftware = async (_id) => {
        const sections_id = [...softData.sections_id, _id]

        try {
            const response = await API.PATCH()(`software/${softID}/`, { sections_id })
            setSoftData(response.data)
        } catch (error) {
            API.ResponseError(enqueueSnackbar, error)
        }
    }
    /************************************** */

    let _sectionsList = []
    let _sectionsListIDs = []
    if (softData?.sections) {
        softData?.sections.map(({ id, title }) => {
            if (!_sectionsListIDs.includes(id)) {
                _sectionsListIDs.push(id)
                _sectionsList.push({ id, title, })
            }
        })
        sectionsList.map(({ id, title }) => {
            if (!_sectionsListIDs.includes(id)) {
                _sectionsListIDs.push(id)
                _sectionsList.push({ id, title, category: 'Not use before' })
            }
        })

    }

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

        <TabPanel value={activeTab} index={0} disabled={disabled}>
            <MetricForm
                softID={softID}
                data={metricData}
                set={setMetricData}
                disabled={disabled}
                variables={{
                    metricsCategoriesList,
                    metricsParametersList
                }}
            />
        </TabPanel>

        <TabPanel value={activeTab} index={1} disabled={disabled}>
            <CommentForm
                softID={softID}
                data={commentData}
                set={setCommentData}
                disabled={disabled}
                variables={{
                    sectionsList: _sectionsList,
                    addNewSection,
                    addSectionToSoftware,
                }}
            />
        </TabPanel>

        <TabPanel value={activeTab} index={2} disabled={disabled}>
            <RatingForm
                softID={softID}
                data={ratingData}
                set={setRatingData}
                disabled={disabled}
                variables={{
                    sectionsList: _sectionsList,
                    addNewSection,
                    addSectionToSoftware,
                }}
            />
        </TabPanel>

        <TabPanel value={activeTab} index={3} disabled={disabled}>
            <CompareForm
                softID={softID}
                data={compareData}
                set={setCompareData}
                disabled={disabled}
                variables={{
                    metricsCategoriesList,
                    metricsParametersList,
                    targetSoftwareList,
                }}
            />
        </TabPanel>

        <TabPanel value={activeTab} index={4} disabled={disabled}>
            <QuestionnaireForm
                softID={softID}
                data={questionnaireData}
                set={setQuestionnaireData}
                disabled={disabled}
                variables={{
                    questionnairesCategoriesList,
                    questionnairesParametersList,
                }}
            />
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