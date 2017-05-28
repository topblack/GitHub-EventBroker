const express = require('express')

class EventBroker {
    public static main(): number {

        let app = express();
        app.get('/', function(req, res){
            res.send('hello world');
            console.log('hello world');
        });
        app.post('/', function(req, res) {
            res.sendStatus(201);
        });
        app.listen('8081');

        return 0;
    }
}

EventBroker.main();