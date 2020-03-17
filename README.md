# hostile
When you don't fully trust a DNS Proxy server to use as your system's main DNS server this script helps you resolve a list of hostnames (given in the `domains` file) using a provided DNS server (e.g. untrustable DNS Proxy) and saves the result as static entries of your system's `hosts` file.

### Installation

No Dependencies. Just NodeJS. Clone the repo and edit the `domains` file as you wish.

### Running

```
node update-host-entries [your-dns-proxy-server-addresses]
```
A sample is included in the `package.json` and could be run by an `npm start`

### Notes

It uses `C:/Windows/System32/drivers/etc/hosts` for windows and `/etc/hosts` for linux to save hosts entries and needs admin rights.

It fallbacks to 127.0.0.1 for hostnames that could not be resolved

It uses a comment header and footer to maintain a block that could be easily updated by running the same command again. This is useful when your DNS Proxy server changes IPs often, so you could run this script in schedule!
