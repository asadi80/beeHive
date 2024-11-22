const { expressjwt } = require('express-jwt');

const auth = () => {
    const secret = process.env.SECRET;
    const api = process.env.API;

    const publicPaths = [
        `${api}login`,
        `${api}signup`,
        `${api}shopinfopublic`,
    ];

    return expressjwt({
        secret,
        algorithms: ['HS256'],
    }).unless({
        path: publicPaths,
    });
};

module.exports = auth;
