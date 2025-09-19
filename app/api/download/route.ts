import { NextResponse } from 'next/server'
import archiver from 'archiver'
import { Readable } from 'stream'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const projectRoot = process.cwd()
    
    // Create a readable stream for the zip
    const archive = archiver('zip', {
      zlib: { level: 9 }
    })
    
    // Files and directories to exclude
    const excludePatterns = [
      'node_modules',
      '.next',
      '.git',
      'dist',
      'build',
      'coverage',
      '.env',
      '.env.local',
      '.env.development.local',
      '.env.test.local',
      '.env.production.local',
      'server.log',
      'prisma/migrations',
      '.DS_Store',
      'Thumbs.db'
    ]
    
    // Add files to archive
    const addDirectory = (dirPath: string, archivePath: string = '') => {
      const items = fs.readdirSync(dirPath)
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item)
        const relativePath = archivePath ? path.join(archivePath, item) : item
        
        // Skip excluded patterns
        if (excludePatterns.some(pattern => item.includes(pattern))) {
          continue
        }
        
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
          addDirectory(fullPath, relativePath)
        } else {
          archive.file(fullPath, { name: relativePath })
        }
      }
    }
    
    addDirectory(projectRoot)
    
    // Finalize the archive
    archive.finalize()
    
    // Convert archive stream to buffer
    const chunks: Buffer[] = []
    archive.on('data', (chunk) => chunks.push(chunk))
    
    return new Promise((resolve) => {
      archive.on('end', () => {
        const buffer = Buffer.concat(chunks)
        
        resolve(new NextResponse(buffer, {
          headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="rto-client-management.zip"',
            'Content-Length': buffer.length.toString(),
          },
        }))
      })
    })
    
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Failed to create download' }, { status: 500 })
  }
}
