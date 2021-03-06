const {
  primary,
  db,
  auth,
  messaging,
  logger,
  clearDb,
  deleteApp,
  testData
} = require('./_testUtils')
const { entries } = require('../../../functions/entries')

const api = {
  use: () => {}
}

const router = {
  use: () => {},
  get: () => {},
  post: () => {},
  put: () => {},
  delete: () => {}
}

const {
  createAccount,
  setEmail,
  setPassword,
  invite,
  validateInvitation,
  setEmailWithInvitation,
  setEmailAndPasswordWithInvitation,
  resetUserAuth,
  getProfile,
  rejectCreateUserWithoutAccount,
  // notifyMessage,
  handleUpdateServiceVersion,
  handleValidateInvitation
} = entries({ db, auth, logger, messaging }, api, router)

beforeEach(async () => {
  auth.clear()
  messaging.clear()
  await clearDb()
  await testData()
})

afterAll(async () => {
  await clearDb()
  await deleteApp()
})

test('createAccount()' +
  ' create account of given name by uid with sufficient privilege', async () => {
  // #1 prepare
  const uid = 'account01'
  await db.collection('accounts').doc(uid).set({ valid: true })
  const data = { name: 'name01' }
  const context = { auth: { uid }, logger }

  // #1 should fail
  await expect(createAccount(data, context)).rejects.toThrow()

  // #2 prepare
  context.auth.uid = primary

  // #2 run
  const { id } = await createAccount(data, context)

  // #2 evaluate
  expect(id).toBeDefined()
  const account = await db.collection('accounts').doc(id).get()
  expect(account.exists).toBeTruthy()
})

test('setEmail()' +
  ' set email to account of given id by uid with sufficient privilege', async () => {
  // #1 prepare
  const uid = 'account01'
  const id = 'account02'
  const email = 'dummy@example.com'
  await db.collection('accounts').doc(uid).set({ valid: true })
  await db.collection('accounts').doc(id).set({ valid: true })
  const data = { id, email }
  const context = { auth: { uid }, logger }

  // #1 should fail
  await expect(setEmail(data, context)).rejects.toThrow()

  // #2 prepare
  context.auth.uid = id

  // #2 run
  const { status } = await setEmail(data, context)

  // #2 evaluate
  expect(status).toEqual('ok')
  expect(auth.data[id].email).toEqual(email)
  const account = await db.collection('accounts').doc(id).get()
  expect(account.data().email).toEqual(email)
})

test('setPassword()' +
  ' set password to account of given id by uid with sufficient privilege', async () => {
  // #1 prepare
  const uid = 'account01'
  const id = 'account02'
  const password = 'password02'
  await db.collection('accounts').doc(uid).set({ valid: true })
  await db.collection('accounts').doc(id).set({ valid: true })
  const data = { id, password }
  const context = { auth: { uid }, logger }

  // #1 should fail
  await expect(setPassword(data, context)).rejects.toThrow()

  // #2 prepare
  context.auth.uid = id

  // #2 run
  const { status } = await setPassword(data, context)

  // #2 evaluate
  expect(status).toEqual('ok')
  expect(auth.data[id].password).toEqual(password)
})

test('invite()' +
  ' create invitation code for given id by uid with sufficient privilege', async () => {
  // #1 prepare
  const uid = 'account01'
  const id = 'account02'
  await db.collection('accounts').doc(uid).set({ valid: true })
  await db.collection('accounts').doc(id).set({ valid: true })
  const data = { id }
  const context = { auth: { uid }, logger }

  // #1 should fail
  await expect(invite(data, context)).rejects.toThrow()

  // #2 prepare
  context.auth.uid = primary

  // #2 run
  const { invitation } = await invite(data, context)

  // #2 evaluate
  expect(invitation).toBeDefined()
})

test('validateInvitation()' +
  ' create token for account has valid invitation code', async () => {
  // #1 prepare
  const id = 'account01'
  await db.collection('accounts').doc(id).set({ valid: true })
  const { invitation } = await invite({ id }, { auth: { uid: primary } })
  const data = { invitation: 'invalid invitation' }
  const context = { auth: { uid: null }, logger }

  // #1 should fail
  await expect(validateInvitation(data, context)).rejects.toThrow()

  // #2 prepare
  data.invitation = invitation

  // #2 run
  const { token } = await validateInvitation(data, context)

  // #2 evaluate
  expect(token).toBeDefined()
})

test('setEmailWithInvitation()' +
  ' set email to account of uid with valid invitation code', async () => {
  // #1 prepare
  const id = 'account01'
  const uid = 'account02'
  await db.collection('accounts').doc(id).set({ valid: true })
  await db.collection('accounts').doc(uid).set({ valid: true })
  const email = 'dummy@example.com'
  const { invitation } = await invite({ id }, { auth: { uid: primary } })
  const data = { invitation, email }
  const context = { auth: { uid }, logger }

  // #1 should fail
  await expect(setEmailWithInvitation(data, context)).rejects.toThrow()

  // #2 prepare
  context.auth.uid = id

  // #2 run
  const { status } = await setEmailWithInvitation(data, context)

  // #2 evaluate
  expect(status).toEqual('ok')
  expect(auth.data[id].email).toEqual(email)
  const account = await db.collection('accounts').doc(id).get()
  expect(account.data().email).toEqual(email)
})

test('setEmailAndPasswordWithInvitation()' +
  ' set email and password to account of uid with valid invitation code', async () => {
  // #1 prepare
  const id = 'account01'
  const uid = 'account02'
  await db.collection('accounts').doc(id).set({ valid: true })
  await db.collection('accounts').doc(uid).set({ valid: true })
  const email = 'dummy@example.com'
  const password = 'password01'
  const { invitation } = await invite({ id }, { auth: { uid: primary } })
  const data = { invitation, email, password }
  const context = { auth: { uid }, logger }

  // #1 should fail
  await expect(setEmailAndPasswordWithInvitation(data, context)).rejects.toThrow()

  // #2 prepare
  context.auth.uid = id

  // #2 run
  const { status } = await setEmailAndPasswordWithInvitation(data, context)

  // #2 evaluate
  expect(status).toEqual('ok')
  expect(auth.data[id].email).toEqual(email)
  expect(auth.data[id].password).toEqual(password)
  const account = await db.collection('accounts').doc(id).get()
  expect(account.data().email).toEqual(email)
})

test('resetUserAuth()' +
  ' recreate user in Authentication for given id' +
  ' by uid with sufficient privilege.', async () => {
  // #1 prepare
  const uid = 'account01'
  const id = 'account02'
  await db.collection('accounts').doc(uid).set({ valid: true })
  await db.collection('accounts').doc(id).set({ email: 'account02@example.com' })
  auth.data[id] = { email: 'account02@example.com' }
  const data = { id }
  const context = { auth: { uid }, logger }

  // #1 should fail
  await expect(resetUserAuth(data, context)).rejects.toThrow()

  // #2 prepare
  context.auth.uid = primary

  // #2 run
  await resetUserAuth(data, context)

  // #2 evaluate
  const account = await db.collection('accounts').doc(id).get()
  expect(account.data().email).toBeNull()
  expect(auth.data[id].email).not.toBeDefined()
})

test('getProfile()' +
  ' get the items of the profile of the given id ' +
  ' permitted for the uid.', async () => {
  // #1 prepare
  const uid = 'account01'
  const id = 'account02'
  await db.collection('accounts').doc(uid).set({ valid: false })
  const ts = new Date()
  await db.collection('profiles').doc(id).set({
    createdAt: ts,
    updatedAt: ts,
    lastName_p: 'a',
    lastName: 'Last Name',
    firstName_p: 'c',
    firstName: 'First Name',
    fullName_p: 'm',
    fullName: 'Full Name',
    twitter: '@account'
  })
  const data = { id }
  const context = { auth: { uid } }

  // #1 should fail
  await expect(getProfile(data, context)).rejects.toThrow()

  // #2 prepare
  await db.collection('accounts').doc(uid).update({ valid: true })

  // #2 run
  const ret = await getProfile(data, context)

  // #2 evaluate
  expect(ret).toEqual({
    id,
    createdAt: ts.toISOString(),
    updatedAt: ts.toISOString(),
    hiddenAt: undefined,
    deletedAt: undefined,
    lastName_p: 'a',
    lastName: 'Last Name'
  })
})

test('rejectCreateUserWithoutAccount()' +
  ' delete auth user without account doc in db.', async () => {
  // prepare
  const uid = 'account01'
  auth.data[uid] = { email: 'account01@example.com' }

  // run
  await rejectCreateUserWithoutAccount({ uid })

  // evaluate
  expect(auth.data[uid]).not.toBeDefined()
})

// test('notifyMessage()' +
//   ' send notification to gtoup members except sender.', async () => {
//   // prepare
//   const token = 'token01'
//   const sender = 'account01'
//   await db.collection('accounts').doc('primary').update({
//     messagingTokens: [{ token, ts: new Date() }]
//   })
//   const message = await db.collection('groups').doc('admins')
//     .collection('messages').add({ sender })

//   // run
//   await notifyMessage(await message.get())

//   // evaluate
//   expect(messaging.data.message.tokens.length).toEqual(1)
//   expect(messaging.data.message.tokens).toContain(token)
// })

test('handleUpdateServiceVersion()' +
  ' call updateVersion()', async () => {
  // prepare
  const result = {}
  const req = {}
  const res = {
    send (version) { result.version = version }
  }

  // run
  await handleUpdateServiceVersion(req, res)

  // evaluate
  expect(result.version).toBeDefined()
})

test('handleValidateInvitation()' +
  ' call validateInvitation()', async () => {
  // prepare
  const id = 'account01'
  await db.collection('accounts').doc(id).set({ valid: true })
  const { invitation } = await invite({ id }, { auth: { uid: primary }, logger })
  const result = {}
  const req = { params: { invitation } }
  const res = {
    send ({ token }) { result.token = token }
  }

  // run
  await handleValidateInvitation(req, res)

  // evaluate
  expect(result.token).toBeDefined()
})
