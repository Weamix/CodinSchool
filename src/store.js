import Vue from 'vue'
import Vuex from 'vuex'

import {
  saveToStorage,
  loadFromStorage,
  notificationTypes,
  debug
} from './functions.js'

const stripHtml = str => str.replace(/[\u00A0-\u9999<>&]/gim, i => '&#' + i.charCodeAt(0) + ';')
const stripObjHtml = obj => {
  const temp = {}
  for (let x in obj) temp[x] = stripHtml(obj[x])
  return temp
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notifications: loadFromStorage('notifications') || [],
    userData: loadFromStorage('userData') || {
      firstname: '',
      lastname: '',
      username: ''
    }
  },
  getters: {
    getNotifications: state => state.notifications,
    getNotificationsCount: state => state.notifications.length,
    getUserData: state => stripObjHtml(state.userData)
  },
  mutations: {
    ADD_NOTIFICATION (state, notif) {
      let notifTypeData = ''
      // Check if type exists and get its corresponding header text
      if (notif.type && notif.message && (notifTypeData = notificationTypes.find(x => x.type === notif.type))) {
        debug(`Mutation : ADD_NOTIFICATION=type:${notif.type}, message:${notif.message}`)
        state.notifications.push({
          id: state.notifications.length === 0 ? 0 : state.notifications[state.notifications.length - 1].id + 1,
          type: notif.type,
          icon: notifTypeData.icon,
          header: notifTypeData.header,
          message: notif.message
        })
        saveToStorage('notifications', state.notifications)
      }
    },
    CLOSE_NOTIFICATION (state, id) {
      let index = -1
      if ((index = state.notifications.findIndex(x => x.id === id)) >= 0) {
        debug(`Mutation : CLOSE_NOTIFICATION=id:${id}, index:${index}`)
        state.notifications.splice(index, 1)
        saveToStorage('notifications', state.notifications)
      }
    },
    CLOSE_ALL_NOTIFICATIONS (state) {
      debug(`Mutation : CLOSE_ALL_NOTIFICATIONS`)
      state.notifications = []
      saveToStorage('notifications', state.notifications)
    },
    SET_USER_DATA (state, data) {
      debug(`Mutation : SET_USER_DATA=firstname:${data.firstname}, lastname:${data.lastname}, username:${data.username}`)
      state.userData = data
    }
  },
  actions: {
    addNotification: ({commit}, notif) => commit('ADD_NOTIFICATION', notif),
    closeNotification: ({commit}, id) => commit('CLOSE_NOTIFICATION', id),
    closeAllNotifications: ({commit}) => commit('CLOSE_ALL_NOTIFICATIONS'),
    setUserData: ({commit}, data) => commit('SET_USER_DATA', data)
  },
  strict: true
})
