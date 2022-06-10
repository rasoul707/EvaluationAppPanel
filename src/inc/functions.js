export const getDefaultHeaders = () => {
    return {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    }
}