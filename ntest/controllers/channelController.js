const path = require('path');
const jwt = require('jsonwebtoken');

const Message = require(path.join(__dirname, '..', 'models', 'message.js'));
const Channel = require(path.join(__dirname, '..', 'models', 'channel.js'));
const User = require(path.join(__dirname, '..', 'models', 'user'));

const SECRET = 'To_wage_through_force_or_guile_eternal_war_irreconcilable_to_our_grand_foe_who_triumphs_now_and_in_the_excess_of_joy_sole_reigning_holds_the_tyranny_of_heaven';

exports.getMessages = (req, res, next) => {

    function gatherMessages(channel) {

        let output = [];

        if(channel.messages.length < 20) {
            output = channel.messages;  
        } else {
            for(let i = channel.messages.length - 20; i < channel.messages.length; i++){
                output.push(channel.messages[i]);
            }
        }

        return output;
    }

    Channel.findOne({_id: req.params.id})
        .then(channel => {
            const messages = gatherMessages(channel);
            res.status(200).json({length: channel.messages.length, messages: messages});
        
    })
}

exports.loadMore = (req, res, next) => {

    let output = [];

    Channel.findOne({_id: req.params.id})
        .then(channel => {
            console.log(req.query.loaded);
            console.log(channel.messages.length);
            let n = channel.messages.length - req.query.loaded;
            let messages = 
                n >= 20 ? channel.messages.slice(n - 20, n) : channel.messages.slice(0, n);

            // console.log(messages.length);
            // console.log(messages);

            for(let msg of messages){
                output.push(msg);
            }
            // console.log(output);
            res.status(200).json({messages: output});
        })
}

exports.postMessage = (req, res, next) => {

    Channel.findOne({_id: req.params.id})
        .then(channel => {
            User.findOne({localName: req.body.author})
                .then(user => {
                    const message = new Message({
                        author: user.localName,
                        content: req.body.content,
                        sprite: user.sprite
                    })
                    message.save()
                        .then(msg => {
                            channel.messages.push(msg);
                            channel.save();
                            res.status(201).json({
                                id: msg._id, 
                                sprite: user.sprite,
                                createdAt: msg.createdAt,
                                updatedAt: msg.updatedAt
                            })
                    })
                })
            
        })
    
}

exports.listen = (req, res, next) => {

    let output = [];
    let numberLoaded = req.query.loaded;

    
    Channel.findOne({_id: req.params.id})
        .then(channel => {
            if(numberLoaded < channel.messages.length) {
                const toLoad = channel.messages.length - numberLoaded;
                for(let i = 1; i < toLoad + 1; i++){
                    output.push(channel.messages[(channel.messages.length - i)]);
                }
                res.status(200).json({messages: output});   
            } else {
                res.status(200).json({messages: []});
            }         
    })
}

exports.createNewChannel = (req, res, next) => {

    const newChannel = new Channel({
        name: req.body.name,
        owner: req.fromUser,
        members: req.body.members || req.fromUser
    })

    let channelId;

    newChannel.save()
        .then(result => {
            channelId = result._id;
            User.findOne({_id: req.fromUser})
                .then(user => {
                    user.channels.push(channelId);
                    user.save()
                        .then(result => {
                            res.status(201).json({
                                name: newChannel.name,
                                id: channelId
                        });
                    })
            }); 
    })
    
}