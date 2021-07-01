const express = require('express')
const fs = require('fs')
const amqp = require('amqplib/callback_api');
const path = require('path');
const filePath = path.join(__dirname, 'metadata.json');

const app = express()
 

 


app.listen(9000, ()=>{
    console.log(filePath)
    let arr = []
    for(var i = 0 ;  i < 1000 ; i++) {
        let data  = {
            "time": (((new Date()).getTime()) + 1000000*i)*1000,
            "camera_id": i,
            "object_track_id": (i*10000+1),
            "object_type": "person",
            "anomaly": (i%2 == 1) ? "PPE" : "Smoke",
            "sub_anomaly": ["hardhat"],
            "bounding_box": 
                {
                    "left": 665,
                    "top": 318,
                    "bottom": 712,
                    "right": 484
                }
                
        }

        // arr.push(data)
    }
    
    //  arr = JSON.stringify(arr);
    // fs.writeFileSync(filePath, arr);
    amqp.connect("amqp://localhost:5672",(err, connection)=>{
    if(err) {
        console.log(err)
        // return res.status(500).json({message:'internal server error'})
    }
    else {
        connection.createChannel((err, channel)=>{
            var exchange = 'ai4safety';
            var key ='logs.data'
            channel.assertExchange(exchange, 'topic', {
                durable: false
              }); 
            channel.assertQueue('',{
                exclusive: true
            },(err, queue)=>{
                 
                
                const stream = fs.readFileSync(filePath) 
        
                 channel.publish(exchange,key, stream)
 
            })
            
        })
    }
})
})