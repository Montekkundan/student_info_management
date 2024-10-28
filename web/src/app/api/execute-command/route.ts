import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import path from 'path'

const rootDir = path.resolve(process.cwd(), '..')

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { command } = body

  if (!command) {
    return NextResponse.json({ error: 'Command is required' }, { status: 400 })
  }

  return new Promise((resolve) => {
    exec(command, { cwd: rootDir }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`)
        resolve(NextResponse.json({ error: 'Failed to execute command', output: stderr }, { status: 500 }))
      } else {
        resolve(NextResponse.json({ output: stdout }))
      }
    })
  })
}