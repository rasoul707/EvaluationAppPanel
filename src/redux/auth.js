const initialState = {
    user: null
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_INFO':
            return {
                ...state,
                user: action.payload.user
            }
        default:
            return { ...state };
    }
}