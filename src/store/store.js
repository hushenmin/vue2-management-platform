/* eslint-disable */
import Vuex from 'vuex'
import Vue from 'vue'


export const LOGIN = 'login';

export const LOGOUT = 'logout';

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        accessToken: null,
        refreshToken: null,
        loginUrl: 'http://10.141.12.33:8080/?location='
    },
    mutations: {
        [LOGIN]: (state, data) => {
            if('accessToken' == data.tokenType){
                localStorage.accessToken = data.accessToken;
                state.accessToken = data.accessToken;

            }else{
                localStorage.refreshToken = data.refreshToken;
                state.refreshToken = data.refreshToken;
            }

        },
        [LOGOUT]: (state) => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            state.accessToken = null
            state.refreshToken = null
        }
    }
})
