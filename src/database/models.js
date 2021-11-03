const fs = require('fs')
const path = require('path')

for (const file of fs.readdirSync(path.join(__dirname, './models'))) {
  if (file.endsWith('.js')) {
    const model = require(`./models/${file}`)
    const name = file.substring(0, file.length - 3)
    exports[name] = model
  }
}