import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// TODO: import thunk from 'redux-thunk';
import {
    // TODO: applyMiddleware, compose,
    createStore, combineReducers
} from 'redux';
import App from './components/App';
import stageReducer from './reducers/stageReducer';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

const initialState = {
    stage: -1,
}

const allReducers = combineReducers({
    stage: stageReducer,
})

// TODO: async middleware
// const allStoreEnhancers = compose(
//     applyMiddleware(thunk),
// );

const store = createStore(
    allReducers,
    initialState
    // allStoreEnhancers,
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));