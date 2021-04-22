const express = require('express')
const fs = require('fs')
const amqp = require('amqplib/callback_api');
const stream = fs.readFileSync('./metadata.json')
const app = express()

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
                 
                
               
        
                channel.publish(exchange,key ,stream)
 
            })
            
        })
    }
})

app.listen(9000)