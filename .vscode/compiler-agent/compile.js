const process = require('process')
const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

const argv = process.argv.slice(2)

if(argv.length < 3 || !['c', 'cpp'].includes(argv[0])) {
	console.log('Usage: <node> cpp-compile.js <c|cpp> <sourceFile> <destFile>')
	process.exit(3)
}

let projectConfig = {}
const projectDir = path.dirname(argv[1])
const projectFile = path.join(projectDir, '_project.json')
if(fs.existsSync(projectFile)) {
	projectConfig = JSON.parse(fs.readFileSync(projectFile))
}
const extraIncludes = (projectConfig['includes'] ?? []).map(name => {
	return path.join(projectDir, name)
})
const projExtraArgs = (projectConfig['args'] ?? [])

const extraArgs = fs.readFileSync('./arguments/' + argv[0] + '-extra-arguments.txt').toString()
	.trim()
	.split('\n')
	.map(item => item.trim())
	.filter(item => !!item)
const compileCommand = { c: 'gcc.exe', cpp: 'g++.exe' }[argv[0]]
const compileArgs = [
	...extraArgs,
	...projExtraArgs,
	argv[1],
	...extraIncludes,
	'-o',
	argv[2]
]

const cp = child_process.spawn(compileCommand, compileArgs, {
	cwd: projectDir
})
const startTime = +new Date()

cp.stdout.pipe(process.stdout)
cp.stderr.pipe(process.stderr)
cp.on('exit', code => {
	const endTime = +new Date()

	console.log('-'.repeat(16))
	console.log(`Compile finished in ${((endTime - startTime) / 1000).toFixed(3)}s with exit code ${code}`)

	process.exit(code)
})
