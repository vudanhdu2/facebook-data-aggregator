import { ACTION_TYPE } from "../type";

const INITIAL_STATE = {
};
const shiftReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ACTION_TYPE.SAVE_DATA_SHIFT: 
            return {
                ...state,
                data: action.payload
            };
        default:
            return state;    
    }
}

export default shiftReducer;