#!/usr/bin/env node
/**
 * Isolated prototype readiness check.
 *
 * This script intentionally avoids the project-level typecheck command used by
 * check-app-ready.mjs. It checks only the requested prototype directory plus the
 * files imported by that prototype, then verifies the target page can be loaded
 * without a Vite error overlay.
 *
 * Usage:
 *   node scripts/check-prototype-isolated.mjs /prototypes/eagle_datastory
 *   node scripts/check-prototype-isolated.mjs --skip-page /prototypes/eagle_datastory
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as sleep } from 'node:timers/promises'
import { decodeOutput, getPreferredNpmCommand, getPreferredNpxCommand } from './utils/command-runtime.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const APP_ROOT = path.resolve(__dirname, '..')
const SERVER_INFO_PATH = path.join(APP_ROOT, '.axhub/make/.dev-server-info.json')
const TIMEOUT_MS = 30_000

const args = process.argv.slice(2)
const skipPage = args.includes('--skip-page')
const targetArg = args.find((arg) => !arg.startsWith('--'))

function jsonExit(payload, code = 0) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`)
  process.exit(code)
}

function run(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: APP_ROOT,
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      stdout += decodeOutput(chunk)
    })

    child.stderr.on('data', (chunk) => {
      stderr += decodeOutput(chunk)
    })

    child.on('error', (error) => {
      resolve({ code: 1, stdout, stderr: `${stderr}${error.message}` })
    })

    child.on('close', (code) => {
      resolve({ code: code ?? 0, stdout, stderr })
    })
  })
}

function normalizeTargetPath(input) {
  if (!input) {
    throw new Error('Usage: node scripts/check-prototype-isolated.mjs /prototypes/<name>')
  }

  const normalized = input.replace(/^\/+/, '')
  if (normalized.startsWith('src/prototypes/')) return normalized
  if (normalized.startsWith('prototypes/')) return path.join('src', normalized)
  throw new Error('Target must be under /prototypes/<name> or src/prototypes/<name>')
}

function toPagePath(targetRelative) {
  return `/${targetRelative.replace(/^src\//, '')}`
}

function getServerInfo() {
  try {
    if (!fsSync.existsSync(SERVER_INFO_PATH)) return null
    const info = JSON.parse(fsSync.readFileSync(SERVER_INFO_PATH, 'utf8'))
    if (!info?.port) return null
    return {
      port: info.port,
      host: info.host || 'localhost',
    }
  } catch {
    return null
  }
}

function getAccessibleHost(serverInfo) {
  return serverInfo.host === '0.0.0.0' ? 'localhost' : serverInfo.host
}

function getUrl(serverInfo, pagePath) {
  return `http://${getAccessibleHost(serverInfo)}:${serverInfo.port}${pagePath}`
}

async function isServerAlive(url) {
  try {
    const res = await fetch(url, { method: 'GET' })
    return res.ok
  } catch {
    return false
  }
}

async function checkPageForErrors(url) {
  const res = await fetch(url, { method: 'GET' })
  const text = await res.text()
  const hasViteOverlay =
    text.includes('vite-error-overlay') ||
    text.includes('__vite_error_overlay__') ||
    /\[plugin:vite:/i.test(text) ||
    /Transform failed/i.test(text)

  if (!hasViteOverlay) return []

  const errorPatterns = [
    /\bError:\s*([^\n]+)/,
    /\bSyntaxError:\s*([^\n]+)/,
    /\bReferenceError:\s*([^\n]+)/,
    /\[plugin:vite:[^\]]+\]\s*([^\n]+)/i,
    /Transform failed/i,
  ]

  for (const pattern of errorPatterns) {
    const match = text.match(pattern)
    if (match) return [match[1] || match[0]]
  }

  return ['Detected Vite error overlay but could not extract message']
}

function startVite(logs) {
  const child = spawn(getPreferredNpmCommand(), ['run', 'dev'], {
    cwd: APP_ROOT,
    shell: false,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  child.stdout.on('data', (chunk) => {
    const text = decodeOutput(chunk).trim()
    if (text) logs.push(`[DEV] ${text}`)
  })

  child.stderr.on('data', (chunk) => {
    const text = decodeOutput(chunk).trim()
    if (text) logs.push(`[DEV ERROR] ${text}`)
  })

  return child
}

async function waitForServer(pagePath, logs) {
  const existing = getServerInfo()
  if (existing) {
    const existingUrl = getUrl(existing, pagePath)
    if (await isServerAlive(existingUrl)) {
      logs.push(`Attached to existing Vite server: ${existingUrl}`)
      return { serverInfo: existing, url: existingUrl, viteProcess: null }
    }
  }

  logs.push('Starting Vite server for isolated page check')
  const viteProcess = startVite(logs)
  const startedAt = Date.now()

  while (Date.now() - startedAt < TIMEOUT_MS) {
    const info = getServerInfo()
    if (info) {
      const url = getUrl(info, pagePath)
      if (await isServerAlive(url)) {
        logs.push(`Target page is reachable: ${url}`)
        return { serverInfo: info, url, viteProcess }
      }
    }
    await sleep(500)
  }

  viteProcess.kill()
  throw new Error('Timed out waiting for Vite server or target page')
}

async function runIsolatedTypecheck(targetRelative, targetAbsolute) {
  const tempTsconfig = path.join(os.tmpdir(), `tsconfig-prototype-${Date.now()}.json`)
  const config = {
    extends: path.join(APP_ROOT, 'vendor/vendor-tsconfig.generated.json'),
    include: [path.join(targetAbsolute, '**/*')],
  }

  await fs.writeFile(tempTsconfig, `${JSON.stringify(config, null, 2)}\n`, 'utf8')

  try {
    return await run(getPreferredNpxCommand(), ['tsc', '--noEmit', '-p', tempTsconfig])
  } finally {
    await fs.rm(tempTsconfig, { force: true })
  }
}

let viteProcess = null;
const logs = []

try {
  const targetRelative = normalizeTargetPath(targetArg)
  const targetAbsolute = path.resolve(APP_ROOT, targetRelative)
  const pagePath = toPagePath(targetRelative)
  const stat = await fs.stat(targetAbsolute).catch(() => null)

  if (!stat?.isDirectory()) {
    throw new Error(`Prototype directory not found: ${targetRelative}`)
  }

  const syncResult = await run(getPreferredNpmCommand(), ['run', 'vendor:sync'])
  if (syncResult.code !== 0) {
    jsonExit({
      status: 'ERROR',
      phase: 'vendor:sync',
      target: targetRelative,
      errors: [syncResult.stderr || syncResult.stdout],
      logs,
    }, 1)
  }
  logs.push('vendor:sync completed')

  const typecheckResult = await runIsolatedTypecheck(targetRelative, targetAbsolute)
  if (typecheckResult.code !== 0) {
    jsonExit({
      status: 'ERROR',
      phase: 'typecheck',
      target: targetRelative,
      pagePath,
      errors: [typecheckResult.stderr || typecheckResult.stdout],
      logs: [typecheckResult.stdout, typecheckResult.stderr, ...logs].filter(Boolean),
    }, 1)
  }
  logs.push('isolated typecheck completed')

  let pageCheck = { status: 'SKIPPED', message: 'Page check skipped by --skip-page' }

  if (!skipPage) {
    const page = await waitForServer(pagePath, logs)
    viteProcess = page.viteProcess
    const pageErrors = await checkPageForErrors(page.url)
    if (pageErrors.length > 0) {
      if (viteProcess) viteProcess.kill()
      jsonExit({
        status: 'ERROR',
        phase: 'page',
        target: targetRelative,
        targetUrl: page.url,
        errors: pageErrors,
        logs,
      }, 1)
    }
    pageCheck = { status: 'SUCCESS', message: 'Target page loaded without Vite error overlay', url: page.url }
  }

  if (viteProcess) viteProcess.kill()

  jsonExit({
    status: 'READY',
    phase: 'done',
    target: targetRelative,
    pagePath,
    targetUrl: pageCheck.url || null,
    checks: [
      { name: 'vendor:sync', status: 'SUCCESS' },
      { name: 'isolated-typecheck', status: 'SUCCESS' },
      { name: 'page', status: pageCheck.status, message: pageCheck.message },
    ],
    logs,
  })
} catch (error) {
  if (viteProcess) viteProcess.kill()
  jsonExit({
    status: 'ERROR',
    phase: 'setup',
    errors: [error instanceof Error ? error.message : String(error)],
    logs,
  }, 1)
}
