#!/usr/bin/env node

/**
 * Check node version before requiring/doing anything else
 * The user may be on a very old node version
 */
const chalk = require('chalk')
const semver = require('semver')
const requiredVersion = require('../package.json').engines.node

function checkNodeVersion(wanted, id) {
    if (!semver.satisfies(process.version, wanted)) {
        console.log(chalk.red(
            `You are using Node ${process.version}, but this version of ${id}` +
            ` requires Node ${requiredVersion}. \nplease upgrade your Node version.`
        ))
        process.exit(1)
    }
}

checkNodeVersion(requiredVersion, '@stonejs/cli')

if (semver.satisfies(process.version, '9.x')) {
    console.log(chalk.red(
        `You are using Node ${process.version}.\n` +
        `Node.js 9.x has already reached end-of-life and will not be supported in future major releases.\n` +
        `It's strongly recommended to use an active LTS version instead.`
    ))
}


const program = require('commander')
const minimist = require('minimist')

program
    .version(`stonejs-cli ${require('../package.json').version}`)
    .usage('<command> [options]')

program
    .command('qrcode <url>')
    .description('Generate qrcode')
    .action(name => {
        verifyArgs('url')
        require('../lib/qrcode')(name)
    })

program
    .command('random <length>')
    .description('Generate random number')
    .action(name => {
        verifyArgs('length')
        require('../lib/random')(name)
    })

program
    .command('search <keywords>')
    .option('-d, --default', 'search by google')
    .option('-b, --baidu', 'search by baidu')
    .option('-s, --stackoverflow', "search by stackoverflow")
    .option('-w, --wiki', 'search by wiki')
    .option('-a, --all', 'search by all sites')
    .description('quick search signle or multiple')
    .action((name, cmd) => {
        require('../lib/search')(name, cleanArgs(cmd))
    })

/**
 * custom help infomation
 */
program.on('--help', () => {
    console.log('')
    console.log(`  Run ${chalk.cyan('stone <command> --help')} for detailed usage of given command.`)
    console.log('')
    console.log('Examples：')
    console.log('  $ stone search --help')
    console.log('  $ stone search -h')
})

program.commands.forEach(c => c.on('--help', () => console.log()))

// enhance common error messages
const enhanceErrorMessages = require('../lib/util/enhanceErrorMessages')

enhanceErrorMessages('missingArgument', argName => {
    return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
})

enhanceErrorMessages('unknownOption', optionName => {
    return `Unknown option ${chalk.yellow(optionName)}.`
})

enhanceErrorMessages('optionMissingArgument', (option, flag) => {
    return `Missing required argument for option ${chalk.yellow(option.flags)}` + (
        flag ? `, got ${chalk.yellow(flag)}` : ``
    )
})

program.parse(process.argv)

/**
 * verify options
 */
function verifyArgs(name) {
    if (minimist(process.argv.slice(3))._.length > 1) {
        console.log(
            chalk.yellow(`\n Info: You provided more than one argument. The first one will be used as the ${name}, the rest are ignored.`)
        )
    }
}

function camelize(str) {
    return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
    const args = {}
    cmd.options.forEach(o => {
        const key = camelize(o.long.replace(/^--/, ''))
        console.log('long:', o.long, 'key:', key)
        // if an option is not present and Command has a method with the same name
        // it should not be copied
        if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
            args[key] = cmd[key]
        }
    })
    return args
}