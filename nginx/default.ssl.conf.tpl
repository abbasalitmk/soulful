server {
    listen 80
    server_name ${DOMAIN} www.${DOMAIN};


    location /.well-known/acme-challenge/{
        root /vol/www/;
    }

    localtion / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name ${DOMAIN} www.${DOMAIN};
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

    include /etc/nginx/options-ssl-nginx.conf;
    ssl_
}