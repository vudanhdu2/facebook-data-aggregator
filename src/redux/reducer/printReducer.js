import { ACTION_TYPE } from "../type";

const INITIAL_STATE = {
};
const printReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ACTION_TYPE.SAVE_DATA_PRINT: 
            return {
                ...state,
                data: action.payload
            };
        default:
            return state;    
    }
}

export default printReducer;