import { ACTION_TYPE } from "../type";

const INITIAL_STATE = {
    count: 0
};
const uploadReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ACTION_TYPE.COUNT_ATTACH_FILE: 
            return {
                ...state,
                count: action.payload
            };
        default:
            return state;    
    }
}

export default uploadReducer;