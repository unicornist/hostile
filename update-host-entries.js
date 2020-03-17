#!/usr/bin/env node
const fs = require('fs')
const { Resolver } = require('dns')

const EOL = '\n'
// const EOL = require('os').EOL;
const hostsFilePath = process.platform.includes('win') ? 'C:/Windows/System32/drivers/etc/hosts' : '/etc/hosts'

const blockStart = '##### ADDED BY STATIC_DNS_PROXIFIER #####' + EOL
const blockEnd = '##### END OF STATIC_DNS_PROXIFIER #####' + EOL

// Read 'domains' file domains into memory
const domainsStr = fs.readFileSync('domains', 'utf8')
const domains = [...new Set(domainsStr.replace(/\r/g, '\n').split('\n').map(l => l.trim()).filter(l => l[0] !== '#').join(' ').replace(/\s{2,}/g, ' ').trim().split(' '))]

// Configure the native DNS resolver
const resolver = new Resolver()
const providedNameServers = process.argv.slice(2)
const usableNameServers = providedNameServers.length ? providedNameServers : ['8.8.8.8']
console.log('Using Name Servers:', usableNameServers)
resolver.setServers(usableNameServers)
console.log('')

// Start DNS operations
Promise.all(
  domains.map(hostname => new Promise((resolve, reject) => {
    console.log('Resolving', hostname, '...')
    resolver.resolve(hostname, (err, addresses) => {
      if (err) {
        console.error('Could not resolve', hostname)
        return resolve()
      }
      console.log(hostname, 'Resolved to', addresses)
      resolve(addresses[0])
    })
  }))
)
  .then(addresses => {
  // Construct and Write output to host file
    const hostEntries = domains.map((d, i) => (addresses[i] || '127.0.0.1') + ' ' + d).join(EOL) + EOL

    const oldHostsFileStr = fs.readFileSync(hostsFilePath, 'utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    const oldHostEntriesBlock = new RegExp(EOL.repeat(4) + blockStart + '(\r|\n|.)*' + blockEnd)
    const newHostEntriesBlock = EOL.repeat(4) + blockStart + hostEntries + blockEnd
    const newHostsFileStr = oldHostsFileStr.match(oldHostEntriesBlock) ? oldHostsFileStr.replace(oldHostEntriesBlock, newHostEntriesBlock) : oldHostsFileStr + newHostEntriesBlock
    fs.writeFileSync(hostsFilePath, newHostsFileStr)

    console.log('')
    console.log('')
    console.log(`Successfully added the following entries to hosts file at '${hostsFilePath}':`)
    console.log('')
    console.log(hostEntries)
  })
