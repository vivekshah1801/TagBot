cd bot
docker build . -t bot2
docker run --env-file .env --network=host bot2

cd ../service
docker build . -t reco2
docker run --network=host reco2