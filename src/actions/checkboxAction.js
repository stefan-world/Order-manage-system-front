export const SELECT_ORDER = '@account/select-order';

export function selectOrder(selectedRows) {
    return (dispatch) => dispatch({
        type: SELECT_ORDER,
        payload: selectedRows
    })
}

