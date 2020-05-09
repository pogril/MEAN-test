const path = require('path');
const jwt = require('jsonwebtoken');

const Message = require(path.join(__dirname, '..', 'models', 'message.js'));
const Channel = require(path.join(__dirname, '..', 'models', 'channel.js'));
const User = require(path.join(__dirname, '..', 'models', 'user'));

const SECRET = 'To_wage_through_force_or_guile_eternal_war_irreconcilable_to_our_grand_foe_who_triumphs_now_and_in_the_excess_of_joy_sole_reigning_holds_the_tyranny_of_heaven';

exports.getMessages = (req, res, next) => {

    async function gatherMessages(channel) {

        const output = [];

        for(msg of channel.messages){
           await Message.findOne({_id: msg._id})
            .then(m => {
                output.push({
                    author: m.author, 
                    content: m.content, 
                    id: m._id,
                    createdAt: m.createdAt,
                    updatedAt: m.updatedAt
                });
            })
        }

        return output;
    }

    Channel.findOne({_id: req.params.id})
        .then(channel => {
            gatherMessages(channel)
                .then(result => {
                    res.status(200).json({messages: result});
            });
    })
}

exports.postMessage = (req, res, next) => {

    Channel.findOne({_id: req.params.id})
        .then(channel => {
            const message = new Message({
                author: req.body.author,
                content: req.body.content
            })
            message.save()
                .then(msg => {
                    channel.messages.push(msg);
                    channel.save();
                    res.status(201).json({
                        id: msg._id, 
                        createdAt: msg.createdAt,
                        updatedAt: msg.updatedAt
                    });
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