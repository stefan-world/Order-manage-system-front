export const SET_QUANTITY = '@account/set-quantity';

export function saveQuantity(quantity) {
    return (dispatch) => dispatch({
        type: SET_QUANTITY,
        payload: quantity
    })
}

