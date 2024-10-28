import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import path from 'path'
import os from 'os'
import fs from 'fs'

const rootDir = path.resolve(process.cwd(), '..')

let currentDir = rootDir

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { command } = body

  if (!command) {
    return NextResponse.json({ error: 'Command is required' }, { status: 400 })
  }

  const commandParts = command.trim().split(' ')
  const baseCommand = commandParts[0]

  if (baseCommand === 'cd') {
    const targetDir = commandParts[1]

    if (targetDir === '..') {
      currentDir = path.resolve(currentDir, '..')
    } else if (targetDir === '/') {
      currentDir = rootDir
    } else if (targetDir) {
      const newDir = path.resolve(currentDir, targetDir)
      if (fs.existsSync(newDir) && fs.statSync(newDir).isDirectory()) {
        currentDir = newDir
      } else {
        return NextResponse.json({ output: `cd: no such file or directory: ${targetDir}` })
      }
    }

    return NextResponse.json({ output: '', currentDir })
  }

  const isWindows = os.platform() === 'win32'

  let adjustedCommand = command
  if (isWindows) {
    if (command === 'clear') {
      return NextResponse.json({ output: '__clear__' }) 
    } else if (command === 'ls') {
      adjustedCommand = 'dir'
    }
  } else {
    if (command === 'clear') {
      return NextResponse.json({ output: '__clear__' }) 
    }
  }

  return new Promise((resolve) => {
    exec(adjustedCommand, { cwd: currentDir }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`)
        resolve(NextResponse.json({ error: 'Failed to execute command', output: stderr }, { status: 500 }))
      } else {
        if (command.includes('make run') || command.includes('make clean')) {
          exec('curl /api/file-struct')
        }

        resolve(NextResponse.json({ output: stdout, currentDir }))
      }
    })
  })
}

