import Firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'
import conf from '../conf'

const firebase = Firebase.initializeApp(conf.firebase)
const db = firebase.firestore()

const message = window.localStorage.getItem('message') ? JSON.parse(window.localStorage.getItem('message')) : { key: 'noMessage', params: {} }

export default {
  conf,
  reqPage: null,
  firebase,
  db,
  loading: [ 'start' ],
  message,
  me: null,
  groups: [],
  accounts: [],
  users: [],
  profiles: {},
  service: {},
  unsub: {},
  preferences: {
    menuPosition: conf.styles.defaultMenuPosition,
    locale: conf.styles.defaultLocale
  }
}
