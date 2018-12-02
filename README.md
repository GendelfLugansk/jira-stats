# jira-stats

Application to analyze exported JIRA issues

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd jira-stats`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Just build and then configure nginx/apache to use dist as site root. Example of
nginx config below

```
server {
    listen 80;
    server_name jira-stats.domain;
    return 301 https://$host$request_uri;
}

server {
        listen 443 ssl;
        ssl_certificate /etc/letsencrypt/live/jira-stats.domain/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/jira-stats.domain/privkey.pem;
        server_name jira-stats.domain;
        root /path/to/dist;

        location ~ /.well-known {
                allow all;
        }
 
        # Deny all . files
        location ~ /\. {
                deny all;
        }

        index index.html
        access_log off;
        gzip on;
        gzip_comp_level 9;
        gzip_types text/plain text/xml text/css application/x-javascript image/png image/gif image/jpeg image/jpg;

        location / {
                include /etc/nginx/mime.types;
                try_files $uri /index.html;
        }
}

```

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
