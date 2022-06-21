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
    return await axios.get(`${baseUrl}degrees/`).catch((error) => { throw error.response })
}



/****** applicationArea */
export const getApplicationAreaList = async () => {
    return await axios.get(`${baseUrl}applicationArea/`, headers()).catch((error) => { throw error.response })
}

/****** applicationArea */



/****** software */

export const getSoftwaresList = async () => {
    return await axios.get(`${baseUrl}software/`, headers()).catch((error) => { throw error.response })
}

// ***

export const getSoftwareByID = async (id) => {
    return await axios.get(`${baseUrl}software/${id}/`, headers()).catch((error) => { throw error.response })
}

export const getSoftwareQuery = async (q) => {
    return await axios.get(`${baseUrl}software/${q}`, headers()).catch((error) => { throw error.response })
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
export const uploadImage = async (data, config) => {
    return await axios.post(`${baseUrl}images/`, data, { ...headers(), ...config }).catch((error) => { throw error.response })
}

/****** uploadImage */