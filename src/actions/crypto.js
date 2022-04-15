import Swal from "sweetalert2";
import { fetchWithoutTokenCoinRanking } from "../helpers/fetch";

import { types } from "../types/types"



const loadData = ( cryptoApi ) => ({
    type: types.criptoLoad,
    payload: cryptoApi
});

export const getCryptos = ( count ) => {
    return async(dispatch) => {
        try {
            
            const resp = await fetchWithoutTokenCoinRanking(
                `coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers=1&orderBy=marketCap&orderDirection=desc&limit=${count}&offset=0`, 
                undefined, 
                'GET');
            const body = await resp.json();
    
            if ( resp.ok && body.status === 'success' ) {
                dispatch( loadData( body ) );
            };
    
        } catch (error) {
            Swal.fire('Error', error.toString(), 'error');
        }
    }
}

export const loadCoin = ( coin ) => ({
    type: types.criptoLoadCoin,
    payload: coin
});

export const getCrypto = ( cryptoId ) => {
    return async(dispatch) => {
        try {
            
            const resp = await fetchWithoutTokenCoinRanking(
                `coin/${cryptoId}?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h`,
                undefined,
                'GET'
            );

            const body = await resp.json();

            if ( resp.ok && body.status === 'success' ) {
                dispatch( loadCoin( body ) );
            };

        } catch (error) {
            Swal.fire('Error', error.toString(), 'error');
        }
    }
}