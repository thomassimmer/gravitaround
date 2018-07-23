'use strict';// jshint -W097


jQuery(function($) {

  const TOKEN_NAME = 'oook_auth_token';  // Defined in vanitils and Firefox ESR supports const

  function fetchToken () {
    return new Promise(function (resolve, reject) {
      $.ajax({
        type: 'GET',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        xhrFields: {'withCredentials': true},
        url: OOOK_TOKEN_URL,
        crossDomain: true,
        success: function(data) {
          return resolve(data.jwt);
        },
        error: reject,
        });
    });
  }

  function fetchTokenAndScheduleNextFetch() {
    fetchToken().then(function (jwt) {
      localStorage.setItem(TOKEN_NAME, jwt);
      console.log("An oook token has been saved.");

      const decoded = jwt_decode(jwt);
      const expiration = decoded.exp * 1000;  // RFC says the time is in second some day in the future

      const refreshAt = expiration -  Date.now() - 2*60*1000;

      // Safe belt: this should not happen
      if (refreshAt < 1000 * 10) {
        throw "Token expires too soon. No next refresh.";
      } else {
        setTimeout(fetchTokenAndScheduleNextFetch, refreshAt);
      }
      console.info("Scheduled next oook token refresh in "+ refreshAt/(1000*60) + " mins.")

    });
  }

  fetchTokenAndScheduleNextFetch();
});
