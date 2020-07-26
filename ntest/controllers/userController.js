const path = require('path');
const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {check, validationResult} = require('express-validator');

const User = require(path.join(__dirname, '..', 'models', 'user'));
const Channel = require(path.join(__dirname, '..', 'models', 'channel'));

const SECRET = 'To_wage_through_force_or_guile_eternal_war_irreconcilable_to_our_grand_foe_who_triumphs_now_and_in_the_excess_of_joy_sole_reigning_holds_the_tyranny_of_heaven';


exports.logIn = (req, res, next) => {
    
    User.findOne({email: req.body.email})
        .then( existingUser => {
            if(existingUser){
                bc.compare(req.body.password, existingUser.password)
                    .then( bool => {
                        if(bool){
                            return module.sendAuthData(req, res, next, existingUser);
                        } else {
                            return res.status(401).json({error: 'Incorrect username or password.'});
                        }
                });
            } else {
                res.status(401).json({error: 'Incorrect username or passowrd.'});
            }
        })       
    .catch(err => {console.log(err);})
                 
}

exports.signUp = (req, res, next) => {

    User.findOne({email: req.body.email}).then(user =>{
        if(user){
            res.status(401).json({error: 'A user with this email already exists!'});
        }
    });

    let imgUrl;

    if(req.file) {
        imgUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    } else {
        imgUrl = `${req.protocol}://${req.get('host')}/images/default`;
    }

    bc.hash(req.body.password, 10)
        .then(hashedPassword => {

            const user = new User({

                localName: req.body.localname,
                email: req.body.email,
                password: hashedPassword,
                sprite: imgUrl
                
            });

            user.save()
                .then(result => {
                    return module.sendAuthData(req, res, next, user);
            })      
    })
    .catch(err => {
        return err;
    })  
}

exports.checkEmail = (req, res, next) => {

    const email = req.params.email;

    User.findOne({email: email})
        .then(result => {
            if(result){
                res.status(200).json({valid: false});
            } else {
                res.status(200).json({valid: true});
            }
        })
}

exports.checkUsername = (req, res, next) => {

    const name = req.params.name;

    User.findOne({localName: name})
        .then(result => {
            if(result){
                res.status(200).json({available: false});
            } else {
                res.status(200).json({available: true});
            }
        })
}

module.sendAuthData = (req, res, next, user) => {

    async function gatherChannels(user) {

        const userChannels = [];

        for(let c of user.channels){
            await Channel.findOne({_id: c})
                .then(item => {
                    userChannels.push({name: item.name, id: c});
            })
        }

        return userChannels;
    }

    gatherChannels(user)
        .then(channels => {
            res.status(200).json({
                name: user.localName,
                userID: user._id,
                channels: channels,
                sprite: user.sprite || null,
                motto: user.motto || null,
                _token: jwt.sign({fromUser: user._id}, SECRET, {expiresIn: '2h'}),
                authUntil: new Date(Date.now() + 3600000)
            })
    })
    .catch(e => {
        console.log(e);
    });    
}