FROM python:3.6-slim-stretch

WORKDIR /usr/src/tagbot_reco

COPY . .

RUN pip install -r requirements.txt

RUN gunicorn --bind 0.0.0.0:5000 wsgi:app
