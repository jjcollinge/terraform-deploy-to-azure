import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// TODO: import thunk from 'redux-thunk';
import {
    // TODO: applyMiddleware, compose,
    createStore, combineReducers
} from 'redux';
import { reducer as formReducer } from 'redux-form'
import App from './components/App';
import stageReducer from './reducers/stageReducer';
import variablesReducer  from './reducers/variablesReducer';
import userReducer from './reducers/userReducer';
import gitReducer from './reducers/gitReducer';
import './indexApp.css';
import 'bootstrap/dist/css/bootstrap.css';

const initialState = {
    stage: -1,
    variables: [],
    user: {},
}

const allReducers = combineReducers({
    stage: stageReducer,
    variables: variablesReducer,
    form: formReducer,
    user: userReducer,
    git: gitReducer,
})

// TODO: async middleware
// const allStoreEnhancers = compose(
//     applyMiddleware(thunk),
// );

const store = createStore(
    allReducers,
    initialState,
    // allStoreEnhancers,
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));