git submodule update --init --recursive

docker build -t lighthouse-reporter:node-lighthouse . 

docker build -t smartmoney-bot:node-bot -f Dockerfile_bot .
