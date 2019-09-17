import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import * as types from './mutation-types';

const savedLists = localStorage.getItem('trollo-lists');

const state = {
    lists:
        savedLists ? JSON.parse(savedLists) :
        [
        {
            title: 'To Do',
            cards: [
                {title: 'English', body: ''},
                {title: 'Mathematics', body: ''},
            ]
        },
        {
            title: 'In Progress',
            cards: [
                {title: 'Science', body: ''}
            ]
        },
        {
            title: 'Done',
            cards: []
        }
    ]
};

const mutations = {
    [types.ADD_LIST](state, {title}) {
        state.lists.push({title, cards: []});
    },
    [types.REMOVE_LIST](state, {listIndex}) {
        state.lists.splice(listIndex, listIndex);
    },
    [types.ADD_CARD_TO_LIST](state, {to, title}) {
        state.lists[to].cards.push({title});
    },
    [types.REMOVE_CARD_FROM_LIST](state, {from, cardIndex}) {
        state.lists[from].cards.splice(cardIndex, 1);
    },
    [types.MOVE_CARD_TO_LIST](state, {from, to}) {
        const targetCard = state.lists[from.listIndex].cards[from.cardIndex];
        state.lists[from.listIndex].cards.splice(from.cardIndex, 1);

        if (to.cardIndex !== null) {
            state.lists[to.listIndex].cards.splice(to.cardIndex, 0, targetCard);
        } else {
            state.lists[to.listIndex].cards.push(targetCard);
        }
    },
    [types.SWAP_LISTS](state, {from, to}) {
        const targetList = state.lists[from.listIndex];
        state.lists.splice(from.listIndex, 1);
        state.lists.splice(to.listIndex !== null ? to.listIndex : -1, 0, targetList);
    },
};

const getters = {
    listsCount: (state) => state.lists.length
};

const store = new Vuex.Store({
    state,
    mutations,
    getters,
});

store.subscribe((mutation, {lists}) => {
    localStorage.setItem('trollo-lists', JSON.stringify(lists));
});

export default store;
