import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const rootDir = path.resolve(process.cwd(), '..')

// Function to get the directory structure
function getDirectoryStructure(dir: string): any {
  const files = fs.readdirSync(dir)
  const structure = files
    .filter(file => file !== '__pycache__')
    .map(file => {
      const fullPath = path.join(dir, file)
      const stats = fs.statSync(fullPath)
      if (stats.isDirectory()) {
        return {
          name: file,
          isDirectory: true,
          children: getDirectoryStructure(fullPath)
        }
      } else {
        return {
          name: file,
          isDirectory: false
        }
      }
    })
  return structure
}

// Fetch directory structure or content
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filePath = searchParams.get('path')

  if (filePath) {
    const fullPath = path.join(rootDir, filePath)
    try {
      const content = fs.readFileSync(fullPath, 'utf-8')
      return NextResponse.json({ content, path: filePath })
    } catch (error) {
      console.error('Error reading file:', error)
      return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
    }
  }

  try {
    const structure = {
      src: {
        name: 'src',
        isDirectory: true,
        children: getDirectoryStructure(path.join(rootDir, 'src'))
      },
      data: {
        name: 'data',
        isDirectory: true,
        children: getDirectoryStructure(path.join(rootDir, 'data'))
      },
      config: {
        name: 'config',
        isDirectory: true,
        children: getDirectoryStructure(path.join(rootDir, 'config'))
      },
      'README.md': {
        name: 'README.md',
        isDirectory: false
      }
    }
    return NextResponse.json(structure)
  } catch (error) {
    console.error('Error fetching file structure:', error)
    return NextResponse.json({ error: 'Failed to fetch file structure' }, { status: 500 })
  }
}
