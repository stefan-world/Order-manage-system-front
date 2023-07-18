
import {
    SET_QUANTITY
} from 'src/actions/quantityAction';

const initialState = {
   quantity: []
};

const quantityReducer = (state = initialState, action) => {
    switch(action.type){

        case SET_QUANTITY: {
            return {
                ...state,
                quantity: action.payload
            };
        }

        default: {
            return state;
        }
    }
};

export default quantityReducer;