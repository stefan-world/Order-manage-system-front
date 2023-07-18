import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import accountReducer from './accountReducer';
import checkboxReducer from './checkboxReducer';
import quantityReducer from './quantityReducer'

const rootReducer = combineReducers({
  account: accountReducer,
  selectedRows: checkboxReducer,
  quantity: quantityReducer,
  form: formReducer
});

export default rootReducer;
