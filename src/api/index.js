import axios from "axios";

const baseUrl = 'http://127.0.0.1:8000/api/';
const headers = () => {
    return {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    }
}

export const signIn = async (data) => {
    return await axios.post(`${baseUrl}auth/`, data).catch((error) => { throw error.response })
}

export const getMe = async () => {
    return await axios.get(`${baseUrl}auth/me/`, headers()).catch((error) => { throw error.response })
}

export const signUp = async (data) => {
    return await axios.post(`${baseUrl}auth/signup/`, data).catch((error) => { throw error.response })
}

export const phoneVerify = async (data) => {
    return await axios.post(`${baseUrl}auth/phoneVerify/`, data).catch((error) => { throw error.response })
}

export const checkPhoneVerify = async (data) => {
    return await axios.post(`${baseUrl}auth/checkPhoneVerify/`, data).catch((error) => { throw error.response })
}




export const getDegreesList = async () => {
    return await axios.get(`${baseUrl}degree/`).catch((error) => { throw error.response })
}



/****** applicationArea */
export const getApplicationAreaList = async () => {
    return await axios.get(`${baseUrl}applicationArea/`, headers()).catch((error) => { throw error.response })
}

/****** applicationArea */



/****** software */

export const getSoftwaresList = async (q = '') => {
    return await axios.get(`${baseUrl}software/?${q}`, headers()).catch((error) => { throw error.response })
}

// ***

export const getSoftware = async (id = 0) => {
    return await axios.get(`${baseUrl}software/${id}/`, headers()).catch((error) => { throw error.response })
}

export const newSoftware = async (data) => {
    return await axios.post(`${baseUrl}software/`, data, headers()).catch((error) => { throw error.response })
}

export const editSoftware = async (id, data) => {
    return await axios.put(`${baseUrl}software/${id}/`, data, headers()).catch((error) => { throw error.response })
}

export const deleteSoftware = async (id) => {
    return await axios.delete(`${baseUrl}software/${id}/`, headers()).catch((error) => { throw error.response })
}

/****** software */



/****** uploadImage */
export const uploadImage = async (data, config = {}) => {
    return await axios.post(`${baseUrl}image/`, data, { ...headers(), ...config }).catch((error) => { throw error.response })
}

/****** uploadImage */



/****** metrics */
export const getMetricsList = async (q = '') => {
    return await axios.get(`${baseUrl}metric/?${q}`, { ...headers() }).catch((error) => { throw error.response })
}

/****** metrics */


/****** MetricEvaluate */
export const getMetricEvaluateList = async (q = '') => {
    return await axios.get(`${baseUrl}metricEvaluate/?${q}`, { ...headers() }).catch((error) => { throw error.response })
}

/***/

export const newMetricEvaluate = async (data) => {
    return await axios.post(`${baseUrl}metricEvaluate/`, data, headers()).catch((error) => { throw error.response })
}

export const editMetricEvaluate = async (id, data) => {
    return await axios.put(`${baseUrl}metricEvaluate/${id}/`, data, headers()).catch((error) => { throw error.response })
}

export const deleteMetricEvaluate = async (id) => {
    return await axios.delete(`${baseUrl}metricEvaluate/${id}/`, headers()).catch((error) => { throw error.response })
}

/****** MetricEvaluate */



/****** softwareSection */
export const getSoftwareSectionsList = async (q = '') => {
    return await axios.get(`${baseUrl}softwareSection/?${q}`, { ...headers() }).catch((error) => { throw error.response })
}

/***/


export const newSoftwareSection = async (data) => {
    return await axios.post(`${baseUrl}softwareSection/`, data, headers()).catch((error) => { throw error.response })
}
/****** softwareSection */


/****** commentEvaluate */
export const getCommentEvaluateList = async (q = '') => {
    return await axios.get(`${baseUrl}commentEvaluate/?${q}`, { ...headers() }).catch((error) => { throw error.response })
}

/***/

export const newCommentEvaluate = async (data) => {
    return await axios.post(`${baseUrl}commentEvaluate/`, data, headers()).catch((error) => { throw error.response })
}

export const editCommentEvaluate = async (id, data) => {
    return await axios.put(`${baseUrl}commentEvaluate/${id}/`, data, headers()).catch((error) => { throw error.response })
}

export const deleteCommentEvaluate = async (id) => {
    return await axios.delete(`${baseUrl}commentEvaluate/${id}/`, headers()).catch((error) => { throw error.response })
}

/****** commentEvaluate */



/****** ratingEvaluate */
export const getRatingEvaluateList = async (q = '') => {
    return await axios.get(`${baseUrl}ratingEvaluate/?${q}`, { ...headers() }).catch((error) => { throw error.response })
}

/***/

export const newRatingEvaluate = async (data) => {
    return await axios.post(`${baseUrl}ratingEvaluate/`, data, headers()).catch((error) => { throw error.response })
}

export const editRatingEvaluate = async (id, data) => {
    return await axios.put(`${baseUrl}ratingEvaluate/${id}/`, data, headers()).catch((error) => { throw error.response })
}

export const deleteRatingEvaluate = async (id) => {
    return await axios.delete(`${baseUrl}ratingEvaluate/${id}/`, headers()).catch((error) => { throw error.response })
}

/****** ratingEvaluate */



/****** compareEvaluate */
export const getCompareEvaluateList = async (q = '') => {
    return await axios.get(`${baseUrl}compareEvaluate/?${q}`, { ...headers() }).catch((error) => { throw error.response })
}

/***/

export const newCompareEvaluate = async (data) => {
    return await axios.post(`${baseUrl}compareEvaluate/`, data, headers()).catch((error) => { throw error.response })
}

export const editCompareEvaluate = async (id, data) => {
    return await axios.put(`${baseUrl}compareEvaluate/${id}/`, data, headers()).catch((error) => { throw error.response })
}

export const deleteCompareEvaluate = async (id) => {
    return await axios.delete(`${baseUrl}compareEvaluate/${id}/`, headers()).catch((error) => { throw error.response })
}

/****** compareEvaluate */






/****** metrics */
export const getQuestionnaireList = async (q = '') => {
    return await axios.get(`${baseUrl}questionnaire/?${q}`, { ...headers() }).catch((error) => { throw error.response })
}

/****** metrics */



/****** questionnaireEvaluate */
export const getQuestionnaireEvaluateList = async (q = '') => {
    return await axios.get(`${baseUrl}questionnaireEvaluate/?${q}`, { ...headers() }).catch((error) => { throw error.response })
}

/***/

export const newQuestionnaireEvaluate = async (data) => {
    return await axios.post(`${baseUrl}questionnaireEvaluate/`, data, headers()).catch((error) => { throw error.response })
}

export const editQuestionnaireEvaluate = async (id, data) => {
    return await axios.put(`${baseUrl}questionnaireEvaluate/${id}/`, data, headers()).catch((error) => { throw error.response })
}

export const deleteQuestionnaireEvaluate = async (id) => {
    return await axios.delete(`${baseUrl}questionnaireEvaluate/${id}/`, headers()).catch((error) => { throw error.response })
}

/****** questionnaireEvaluate */