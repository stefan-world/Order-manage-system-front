import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import accountReducer from './accountReducer';
import checkboxReducer from './checkboxReducer';

const rootReducer = combineReducers({
  account: accountReducer,
  selectedRows: checkboxReducer,
  form: formReducer
});

export default rootReducer;
