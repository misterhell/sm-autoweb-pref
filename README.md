# sm-autoweb-pref


bot.js - bot with low poly 

index.js - lighthouse checker


### Instalation
First you need to copy .env file

```sh
cp ./.env.example ./.env
```
Fill .env with params

```
cp ./landings_list/landings_list.json.example ./landings_list/landings_list.json
```


Then run `install.sh` it will pull sub modules and build docker con

### How to use 

Then you can run `start_bot.sh` - it will start docker container with bot in daeamon mode

`start_perfomance_test.sh` will run perfomance test by every landing from landings list

Add start_perfomance_test.sh to cron jobs