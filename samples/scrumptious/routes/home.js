
var FB              = require('../../../fb'),
    Step            = require('step'),

    config          = require('../config');

FB.options({
    appId:          config.facebook.appId,
    appSecret:      config.facebook.appSecret,
    redirectUri:    config.facebook.redirectUri
});

exports.index = function(req, res) {
    var accessToken = req.session.access_token;
    if(!accessToken) {
        res.render('index', {
            title: 'Nanogamers',
            loginUrl: FB.getLoginUrl({ scope: 'user_about_me, email' })
        });
    } else {
        res.render('menu');
        window.onload=function(){window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
      appId      : 'YOUR_APP_ID',                        // App ID from the app dashboard
      channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel file for x-domain comms
      status     : true,                                 // Check Facebook Login status
      xfbml      : true                                  // Look for social plugins on the page
    });

    // Additional initialization code such as adding Event Listeners goes here

  };

  // Load the SDK asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/all.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
        updateUserInfo();
    }
}
};

exports.loginCallback = function (req, res, next) {
    var code            = req.query.code;

    if(req.query.error) {
        // user might have disallowed the app
        return res.send('login-error ' + req.query.error_description);
    } else if(!code) {
        return res.redirect('/');
    }

    Step(
        function exchangeCodeForAccessToken() {
            FB.napi('oauth/access_token', {
                client_id:      FB.options('appId'),
                client_secret:  FB.options('appSecret'),
                redirect_uri:   FB.options('redirectUri'),
                code:           code
            }, this);
        },
        function extendAccessToken(err, result) {
            if(err) throw(err);
            FB.napi('oauth/access_token', {
                client_id:          FB.options('appId'),
                client_secret:      FB.options('appSecret'),
                grant_type:         'fb_exchange_token',
                fb_exchange_token:  result.access_token
            }, this);

        },
        function (err, result) {
            if(err) return next(err);

            req.session.access_token    = result.access_token;
            req.session.expires         = result.expires || 0;

            if(req.query.state) {
                var parameters              = JSON.parse(req.query.state);
                parameters.access_token     = req.session.access_token;

                console.log(parameters);


                FB.api('/me/' + config.facebook.appNamespace +':play', 'post', parameters , function (result) {
                    console.log(result);
                    if(!result || result.error) {
                        return res.send(500, result || 'error');
                        // return res.send(500, 'error');
                    }

                    return res.redirect('/');
                });
            } else {
                
                return res.redirect('/');
            }
        }
    );
};

exports.logout = function (req, res) {
    req.session = null; // clear session
    res.redirect('/');
};
