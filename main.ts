const express = require('express');
const fs = require('fs');
const path = require('path');

const CONSUMERS_DIR = 'consumers';
class EventBroker {
    public static main(): number {
        if (!fs.existsSync(CONSUMERS_DIR)) {
            fs.mkdirSync(CONSUMERS_DIR);
        }
        let app = express();
        app.get('/', function (req, res) {
            res.send('hello world');
            console.log('hello world');
        });

        app.get('/consumers', function (req, res) {
            let consumerFolders = fs.readdirSync(CONSUMERS_DIR);
            res.send(JSON.stringify(consumerFolders));
        });

        app.get('/consumers/:consumerId/events', function (req, res) {
            let consumerFolder = path.join(CONSUMERS_DIR, req.params.consumerId);
            let eventFileNames = fs.readdirSync(consumerFolder);
            let sortedEventFileNames = eventFileNames.sort(function (a, b) {
                let statA = fs.statSync(path.join(consumerFolder, a));
                let statB = fs.statSync(path.join(consumerFolder, b));
                return statA.mtime.getTime() < statB.mtime.getTime();
            });
            res.send(JSON.stringify(sortedEventFileNames));
        });

        app.post('/consumers/:consumerId/events', function (req, res) {
            let evtType = req.get('X-GitHub-Event');
            let evtId = req.get('X-GitHub-Delivery');
            let targetPath = path.join(CONSUMERS_DIR, req.params.consumerId);
            if (!fs.existsSync(targetPath)) {
                fs.mkdirSync(targetPath);            
                console.info('Consumer ' + req.params.consumerId + ' added.');
            }

            fs.writeFileSync(path.join(targetPath, evtId), JSON.stringify(req.body));
            console.log(evtType + ' to ' + req.params.consumerId);
            res.sendStatus(200);
        });

        app.delete('/consumers/:consumerId/events/:eventId', function (req, res) {
            let targetPath = path.join(CONSUMERS_DIR, req.params.consumerId, req.params.eventId);
            if (fs.existsSync(targetPath)) {
                fs.unlinkSync(targetPath);
            }
            res.sendStatus(200);
        });

        app.get('/consumers/:consumerId/events/:eventId', function (req, res) {
            let targetPath = path.join(CONSUMERS_DIR, req.params.consumerId, req.params.eventId);
            if (fs.existsSync(targetPath)) {
                res.send(fs.readFileSync(targetPath, 'utf-8'));
            } else {
                res.sendStatus(404);
            }
        });

        console.info('Listening 8081');
        app.listen('8081');

        return 0;
    }
}

EventBroker.main();
