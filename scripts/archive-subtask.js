#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'

function usage() {
  console.log('Usage: node scripts/archive-subtask.js <subtask-file> [--phase <phase-file>]')
  process.exit(1)
}

const argv = process.argv.slice(2)
if (!argv[0]) usage()

const subtaskPath = path.resolve(argv[0])
let phaseFile
for (let i = 1; i < argv.length; i++) {
  if (argv[i] === '--phase' && argv[i + 1]) { phaseFile = path.resolve(argv[i + 1]); i++ }
}

async function ensureDir(dir) {
  try { await fs.mkdir(dir, { recursive: true }) } catch (e) { }
}

async function main() {
  try {
    const exists = await fs.stat(subtaskPath).catch(() => null)
    if (!exists) { console.error('Subtask file not found:', subtaskPath); process.exit(2) }

    const tasksDir = path.resolve('docs/development/TASKS')
    const archiveDir = path.join(tasksDir, 'ARCHIVED')
    await ensureDir(archiveDir)

    const content = await fs.readFile(subtaskPath, 'utf8')
    const fileName = path.basename(subtaskPath)
    const archivedName = fileName
    const archivedPath = path.join(archiveDir, archivedName)

    const now = new Date().toISOString().split('T')[0]
    const newContent = `<!-- ARCHIVED: ${now} -->\n\n` + content
    await fs.writeFile(archivedPath, newContent, 'utf8')
    await fs.unlink(subtaskPath)
    console.log('Moved subtask to', archivedPath)

    // If phase file provided, mark the task as done there (replace first occurrence of **ID** line checkbox)
    if (phaseFile) {
      const phaseContent = await fs.readFile(phaseFile, 'utf8')
      const id = fileName.replace(/\.task\.md$/, '')
      const lines = phaseContent.split('\n')
      let changed = false
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(`**${id}**`)) {
          if (lines[i].includes('- [ ]')) {
            lines[i] = lines[i].replace('- [ ]', '- [x]')
            changed = true
            break
          }
        }
      }
      if (changed) {
        await fs.writeFile(phaseFile, lines.join('\n'), 'utf8')
        console.log('Updated phase file:', phaseFile, 'marked', id)
      } else {
        console.log('Phase file updated: no matching unchecked entry found for', id)
      }
    }

  } catch (err) {
    console.error('Error archiving subtask:', err)
    process.exit(3)
  }
}

main()
