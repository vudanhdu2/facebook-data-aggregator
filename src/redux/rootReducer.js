import { combineReducers } from 'redux';
import userReducer from './reducer';
import printReducer from './reducer/printReducer';
import uploadReducer from './reducer/uploadReducer';
import shiftReducer from './reducer/shiftReducer';

const rootReducer = combineReducers({
    userReducer: userReducer,
    printReducer: printReducer,
    uploadReducer: uploadReducer,
    shiftReducer: shiftReducer,
});

export default rootReducer;