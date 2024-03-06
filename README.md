# hexABC

## Setup

```bash
# npm
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```

## Build

Build the application for production.

### Staging

Build the application for development server (webdev3).

```bash
# npm
npm run build:staging
```

Copy the **.output_hexABC** folder to the server.

### Production

Build the application for production server.

```bash
# npm
npm run build:production
```

Copy the **.output_hexABC** folder to the server.

## Configuration for apache server (development)

1. Edit */etc/apache2/sites-available/000-default.conf* file and add:

```apacheconf
<Location /hexABC/ >
    ProxyPass http://localhost:3000/webdev3/hexABC/
    ProxyPassReverse http://localhost:3000/webdev3/hexABC/
</Location>
```

Note that port can be 3000 or any other declared in the **ecosystem.hexABC.config.js** file (see step 4)

2. Enable proxy and proxy_http modules and restart apache:

```shell
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo /etc/init.d/apache2 restart
```

3. Install PM2 for running nodeJS server as a daemon:

`sudo npm install pm2 -g`

4. Create **ecosystem.hexABC.config.js** file in the same folder where the **.output_hexABC** folfer has been copied:

```javascript
module.exports = {
  apps: [
    {
      name: 'hexABC',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      env: {
	    NODE_ENV: 'staging'
      },
      script: './.output_hexABC/server/index.mjs'
    }
  ]
}
```

4. Launch server (from the folder where it's installed):

`pm2 start ecosystem.hexABC.config.js --name hexABC`

5. Check that the server is up and running:

```bash
pm2 list
lsof -i tcp:3000
```

5. Make pm2 persistent in case VM has to be reset:
    
`pm2 startup systemd`

## Credits

Genís Bayarri, Adam Hospital.

## Copyright & licensing

This website has been developed by the [MMB group](https://mmb.irbbarcelona.org) at the [IRB Barcelona](https://irbbarcelona.org).

© 2024 **Institute for Research in Biomedicine**

Licensed under the **Apache License 2.0**.
