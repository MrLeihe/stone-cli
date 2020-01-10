const chalk = require('chalk');
const crypto = require('crypto');

function random(length) {
    if (!/^\d+$/.test(length)) {
        console.log(chalk.red(`Error: Not a valid length of ${chalk.yellow(length)}`))
        return
    }
    const res = crypto.randomBytes(Number(length)).toString('hex')
    const start = Math.floor(Math.random() * res.length / 2)
    const result = res.slice(start, start + Number(length))
    console.log()
    console.log(`random-result: ${chalk.keyword('orange')(result)}`)
    console.log()
    return result
}

module.exports = random