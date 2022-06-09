import Vue from 'vue'
import Vuex from 'vuex'
import getConfig from '@/config';
import * as nearAPI from 'near-api-js';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        keyStore: '',
        near: '',

        nearConfig: '',
        walletConnection: '',
        currentUser: null,
        contract: '',
    },
    mutations: {
        async setDefaultData(state) {
            state.nearConfig = getConfig(process.env.NEAR_ENV || 'testnet');
            state.keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
            state.near = await nearAPI.connect({keyStore: state.keyStore, ...state.nearConfig});

            state.walletConnection = new nearAPI.WalletConnection(state.near);

            if (state.walletConnection.getAccountId()) {
                state.currentUser = {
                    // Gets the accountId as a string
                    accountId: state.walletConnection.getAccountId(),
                    // Gets the user's token balance
                    balance: (await state.walletConnection.account().state()).amount,
                };
            }

            state.contract = await new nearAPI.Contract(
                state.walletConnection.account(),
                state.nearConfig.contractName,
                {
                    viewMethods: ['getMessages'],
                    changeMethods: ['addMessage'],
                    sender: state.walletConnection.getAccountId(),
                }
            );
        }
    },
    actions: {
        initContract({commit}) {
            commit('setDefaultData')
        },
    },
    getters: {
        getKeyStore: state => state.keyStore,
        getNear: state => state.near,

        getNearConfig: state => state.nearConfig,
        getWalletConnection: state => state.walletConnection,
        getCurrentUser: state => state.currentUser,
        getContract: state => state.contract,
    },
    modules: {}
})
