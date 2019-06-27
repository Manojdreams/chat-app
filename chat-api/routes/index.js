var express = require('express');
var router = express.Router();
var FCM = require('fcm-node');

var serverKey = 'AAAAKKaujcQ:APA91bFNrQB7FSwjzyouV8plMmkGinEK0mf1Cen4c9S-YfXU26GiVFx83-u_e_V-IA7Y6hYDrc1e6pslm8qYEYEa2hXIOtPu5Hq0AJVoBUlaA9AP6cUkm9q_uN5rUUIXe6cBSp7XU8S3'; //put your server key here
var fcm = new FCM(serverKey);

var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: 'ce17Yq7nwgM:APA91bF8LWUbNzkkFbSDR7D_MQEvU4rzZ0QyWKQojUsdbJDRLJD12GFxscc0ggDjxIJDQ5LH0lY9s_psHxmCEOsWbUEtZP7JCOd9mQZviKZ-IDmc1LoIr5l8Sh4bm4feSKoI5iZfebhL', 
    collapse_key: 'your_collapse_key',
    
    notification: {
        title: 'Manoj', 
        body: 'Hai Chandru' 
    },
    
    data: {  //you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value'
    }
};

/* GET home page. */
router.post('/', function(req, res, next) {
    console.log(req.body)
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: req.body.device_id, 
        
        notification: {
            title: req.body.title, 
            body: req.body.message 
        },
        
        data: {  //you can send only notification or only data(or include both)
            to_user: req.body.to_user,
        }
    };
    
  fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log("Successfully sent with response: ", response);
    }
});
  res.render('index', { title: 'Express' });
});

module.exports = router;
