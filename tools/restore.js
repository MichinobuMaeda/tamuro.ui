const path = require('path')
const {
  admin,
  authJson,
  firestoreJson
} = require('./env')
const { execSync } = require('child_process')

const db = admin.firestore()

const restore = async () => {
  const bucket = admin.storage().bucket()
  await bucket.file(`backup/${path.basename(authJson)}`).download({ destination: authJson })
  await bucket.file(`backup/${path.basename(firestoreJson)}`).download({ destination: firestoreJson })
  const uids = await listAllUserIds()
  await Promise.all(uids.map(uid => admin.auth().deleteUser(uid)))
  execSync(`firebase auth:import ${authJson}`)
  execSync('firebase firestore:delete --all-collections --yes')
  const firestoreData = require(firestoreJson)
  const batch = db.batch()
  firestoreData.forEach(item => {
    batch.set(pathToRef(db, item.path), item.data)
  })
  await batch.commit()
}

restore()
  .then(() => {
    console.log('complete')
    return admin.app().delete()
  })
  .catch(e => {
    console.error(e)
    return admin.app().delete()
  })

const listAllUserIds = async nextPageToken => {
  const uids = []
  const result = await admin.auth().listUsers(1000, nextPageToken)
  result.users.forEach(userRecord => {
    uids.push(userRecord.uid)
  })
  if (result.pageToken) {
    (await listAllUserIds(result.pageToken)).forEach(uid => {
      uids.push(uid)
    })
  }
  return uids
}

const pathToRef = (base, path) => {
  const matches = path.match(/^([^/]+)\/([^/]+)/)
  const next = path.match(/^([^/]+)\/([^/]+)\/(.+)/)
  return next
    ? pathToRef(base.collection(matches[1]).doc(matches[2]), next[3])
    : base.collection(matches[1]).doc(matches[2])
}
