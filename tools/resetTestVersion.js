const path = require('path')
const fs = require('fs')

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'conf', 'version.js'),
  "export default '0000000'\n"
)
