const process = require('process')
const fs = require('fs')
const child_process = require('child_process')

const argv = process.argv.slice(2)

if(argv.length < 2) {
	console.log('Usage: <node> cpp-compile.js <sourceFile> <destFile>')
	process.exit(3)
}

const extraArgs = fs.readFileSync('./arguments/c-extra-arguments.txt').toString()
	.trim()
	.split('\n')
	.map(item => item.trim())
	.filter(item => !!item)
const compileCommand = 'gcc.exe'
const compileArgs = [
	...extraArgs,
	argv[0],
	'-o',
	argv[1]
]

const cp = child_process.spawn(compileCommand, compileArgs)
const startTime = +new Date()

cp.stdout.pipe(process.stdout)
cp.stderr.pipe(process.stderr)
cp.on('exit', code => {
	const endTime = +new Date()

	console.log('-'.repeat(16))
	console.log(`Compile finished in ${((endTime - startTime) / 1000).toFixed(3)}s with exit code ${code}`)

	process.exit(code)
})
