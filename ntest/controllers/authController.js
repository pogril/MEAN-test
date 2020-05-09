const jwt = require('jsonwebtoken');

const SECRET = 'To_wage_through_force_or_guile_eternal_war_irreconcilable_to_our_grand_foe_who_triumphs_now_and_in_the_excess_of_joy_sole_reigning_holds_the_tyranny_of_heaven';

exports.authorize = (req, res, next) => {

    const userToken = req.headers.authorization.split(' ')[1];

    const verifiedToken = jwt.verify(userToken, SECRET);

    if(!verifiedToken) {
        res.status(201).send();
    }

    req.fromUser = verifiedToken.fromUser

    next();
}