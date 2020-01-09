const program = require('commander')

program
    .command('random <length>')
    .description('Generate random number')
    .action((name, description) => {
        console.log('action', name)
    })