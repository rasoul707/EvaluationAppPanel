const initialState = {
    token: null,
    user: null
}

export const authReducer = (state = initialState, action) => {
    
    // const { name, payload } = action;
    
    switch (action.type) {
        case 'LOGIN':

            // update token & user
            const { token, user } = action.payload;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            
            return {
                ...state,
                token: token,
                user: user
            }
        case 'LOGOUT':
            // delete token & user

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            return {
                ...state,
                token: null,
                user: null
            }
        case 'PROFILE_UPDATE':
            // update user
            break

        default:
            const lsToken = localStorage.getItem("token");
            const lsUser = localStorage.getItem("user");

            return {
                ...state,
                token: lsToken, 
                user: lsUser ? JSON.parse(lsUser) : null
            };
    }
}