docker run --name mysql -d \
    -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=change-me \
    -v mysql:/var/lib/mysql \
    mysql:8
