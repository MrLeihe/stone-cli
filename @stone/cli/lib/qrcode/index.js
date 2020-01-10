const QRCode = require('qrcode')
const chalk = require('chalk')

function qrcode(url) {
    QRCode.toString(url, (err, data) => {
        if (err) {
            console.log(`Generate qrcode error: ${chalk.red(err)}`)
            return
        }

        console.log(data)
    })
}
module.exports = qrcode