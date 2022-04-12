import { types } from "../types/types";


const initialState = {}

export const cryptoReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        case types.criptoLoad:
            return {
                ...state,
                ...action.payload
            }
            
    
        default:
            return state;
    }

}