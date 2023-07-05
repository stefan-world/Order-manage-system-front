
import {
    SELECT_ORDER
} from 'src/actions/checkboxAction';

const initialState = {
   checkedRows: []
};

const checkboxReducer = (state = initialState, action) => {
    switch(action.type){

        case SELECT_ORDER: {
            return {
                ...state,
                checkedRows: action.payload
            };
        }

        default: {
            return state;
        }
    }
};

export default checkboxReducer;