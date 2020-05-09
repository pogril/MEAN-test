const path = require('path');

const bc = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {check, validationResult} = require('express-validator');

const User = require(path.join(__dirname, '..', 'models', 'user'));
const Channel = require(path.join(__dirname, '..', 'models', 'channel'))

const SECRET = 'To_wage_through_force_or_guile_eternal_war_irreconcilable_to_our_grand_foe_who_triumphs_now_and_in_the_excess_of_joy_sole_reigning_holds_the_tyranny_of_heaven';


exports.logIn = (req, res, next) => {
    
    User.find({name: req.body.username})
        .then( existingUser => {
            if(existingUser.length != 0){
                bc.compare(req.body.password, existingUser[0].password)
                    .then( bool => {
                        if(bool){
                            return module.sendAuthData(req, res, next, existingUser[0]);
                        } else {
                            return res.status(401).json({message: 'Incorrect Password'});
                        }
                });
            }
        })       
    .catch(err => {console.log(err);})


                 
}

exports.signUp = (req, res, next) => {

    bc.hash(req.body.password, 10)
        .then(hashedPassword => {

            const user = new User({

                name: req.body.username,
                password: hashedPassword
                
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
                user: user.name,
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