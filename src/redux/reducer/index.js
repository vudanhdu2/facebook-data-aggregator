import { ACTION_TYPE } from "../type";

const INITIAL_STATE = {
};
const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ACTION_TYPE.SAVE_USER: 
            return {
                ...state,
                data: action.payload
            };
        default:
            return state;    
    }
}

export default userReducer;