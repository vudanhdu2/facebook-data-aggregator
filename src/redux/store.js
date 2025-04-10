import { createStore, applyMiddleware } from 'redux'
import rootReducer from './rootReducer';

const localStorageMiddleware = ({getState}) => { // <--- FOCUS HERE
    return (next) => (action) => {
        const result = next(action);
        localStorage.setItem('applicationState', JSON.stringify(
            getState()
        ));
        return result;
    };
};


const reHydrateStore = () => { // <-- FOCUS HERE

    if (localStorage.getItem('applicationState') !== null) {
        return JSON.parse(localStorage.getItem('applicationState')) // re-hydrate the store

    }
}


const store = createStore(
    rootReducer,
    reHydrateStore(),// <-- FOCUS HERE
    applyMiddleware(
        localStorageMiddleware,// <-- FOCUS HERE 
    )
);


export default store;