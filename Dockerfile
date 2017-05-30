FROM readytalk/nodejs
EXPOSE 8081

ADD main.js /GitHub-EventBroker/
ADD node_modules /GitHub-EventBroker/node_modules/
WORKDIR /GitHub-EventBroker

ENTRYPOINT node main.js

