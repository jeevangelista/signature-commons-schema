#!/usr/bin/env node

import { validate } from '.'

const process = require('process')
const readline = require('readline')

;(async () => {
  const validator = process.argv.length >= 2 ? process.argv[2] : undefined
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })
  let exit_code = 0
  let success = 0
  let running = 0
  rl.on('line', async (line: string) => {
    running += 1
    try {
      console.log(JSON.stringify(await validate(JSON.parse(line), validator)))
      running -= 1
      success += 1
    } catch (e) {
      console.error(JSON.stringify(e))
      running -= 1
      exit_code += 1
    }
  })
  await new Promise(
    (resolve, reject) =>
      rl.on('close', () => // Don't stop until all lines are done processing
        setInterval(
          () => {
            if (running <= 0) { resolve() }
          },
          100
        )
      )
  )
  if (success + exit_code === 0) {
    console.log(`Usage: echo '{"data":{"to": "validate"}}' | signature-commons-schema [validator] > {"validated":"data"}`)
    console.log(`Exit Code:`)
    console.log(`   -1: No data received`)
    console.log(`    0: No errors (success)`)
    console.log(`    n: Number of errors`)
    return -1
  } else {
    return exit_code
  }
})().then(process.exit)
