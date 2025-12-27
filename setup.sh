sudo apt update
sudo apt install golang-go
sudo mkdir -p /db/private /db/mount
sudo touch /db/private/db.sqlite3 /db/mount/user_tables.sqlite3

sudo apt update

#nginx
sudo apt install nginx
sudo rm -r /etc/nginx/sites-enabled/default
sudo cp tinyapi.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/tinyapi.conf /etc/nginx/sites-enabled/
sudo systemctl reload nginx

#golang
sudo apt install golang-go

sudo docker build -t sandbox api_serve/sandbox
