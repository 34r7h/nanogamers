
var config = { };

// should end in /
config.rootUrl  = process.env.ROOT_URL                  || 'http://ec2-54-218-49-39.us-west-2.compute.amazonaws.com:3000/';

config.facebook = {
    appId:          process.env.FACEBOOK_APPID          || '143751365821284',
    appSecret:      process.env.FACEBOOK_APPSECRET      || '40d92d92d00731074709ecc93c97ff19',
    appNamespace:   process.env.FACEBOOK_APPNAMESPACE   || 'nanogamers',
    redirectUri:    process.env.FACEBOOK_REDIRECTURI    ||  config.rootUrl + 'login/callback'
};

module.exports = config;
