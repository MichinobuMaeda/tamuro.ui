const { apiKeyValidator } = require('./api')
const { updateVersion } = require('./service')
const { signInWithLineMe } = require('./line_me')
const {
  guardValidAccount,
  guardGroups,
  guardUserSelfOrGroups
} = require('./guards')
const {
  rejectCreateUserWithoutAccount,
  createAccount,
  setEmail,
  setPassword,
  resetUserAuth
} = require('./accounts')
const {
  getProfile
} = require('./profiles')
const {
  invite,
  validateInvitation,
  setEmailWithInvitation,
  setEmailAndPasswordWithInvitation
} = require('./invitation')
const {
  notifyMessage
} = require('./notification')
const {
  provideImage
} = require('./images')

const handleUpdateServiceVersion = firebase => async (req, res) => res.send(await updateVersion(firebase))
const handleValidateInvitation = firebase => async (req, res) => res.send(await validateInvitation(req.params, firebase))

const entries = (firebase, api, router, axios) => {
  router.use(
    '/updateServiceVersion',
    apiKeyValidator(firebase)
  )

  router.get(
    '/updateServiceVersion',
    handleUpdateServiceVersion(firebase)
  )

  router.get(
    '/invitation/:invitation',
    handleValidateInvitation(firebase)
  )

  api.use('/', router)

  const ctx = context => ({ ...context.auth, ...firebase, axios })
  const { logger } = firebase
  const adminsOrManagers = ['admins', 'managers']

  return {
    // HTTP API
    api,
    // Callables
    createAccount: (data, context) => guardGroups(
      data, ctx(context), adminsOrManagers, createAccount
    ),
    setEmail: (data, context) => guardUserSelfOrGroups(
      data, ctx(context), adminsOrManagers, setEmail
    ),
    setPassword: (data, context) => guardUserSelfOrGroups(
      data, ctx(context), adminsOrManagers, setPassword
    ),
    invite: (data, context) => guardGroups(
      data, ctx(context), adminsOrManagers, invite
    ),
    validateInvitation: (data, context) => validateInvitation(data, ctx(context)),
    setEmailWithInvitation: (data, context) => guardValidAccount(
      data, ctx(context), setEmailWithInvitation
    ),
    setEmailAndPasswordWithInvitation: (data, context) => {
      logger.log(JSON.stringify(data))
      return guardValidAccount(
        data, ctx(context), setEmailAndPasswordWithInvitation
      )
    },
    signInWithLineMe: (data, context) => {
      return signInWithLineMe(data, ctx(context))
    },
    resetUserAuth: (data, context) => guardGroups(
      data, ctx(context), adminsOrManagers, resetUserAuth
    ),
    getProfile: (data, context) => guardValidAccount(
      data, ctx(context), getProfile
    ),
    provideImage: (data, context) => guardValidAccount(
      data, ctx(context), provideImage
    ),
    // Triggers
    rejectCreateUserWithoutAccount: user => rejectCreateUserWithoutAccount(user, firebase),
    onGroupCharCreate: async snap => {
      await notifyMessage(snap, firebase)
    },
    onHotlineCreate: async snap => {
      await notifyMessage(snap, firebase)
    },
    // for Unit test
    handleUpdateServiceVersion: handleUpdateServiceVersion(firebase),
    handleValidateInvitation: handleValidateInvitation(firebase)
  }
}

module.exports = {
  entries
}
