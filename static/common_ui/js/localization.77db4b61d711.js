var Bluetils = Bluetils || {};


(function(bluetilsNamespace) {
   'use strict';

    // LANGUAGE_CODE may look like 'fr', 'en-gb'. However,
    // JavaScript libraries (DateTimePicker, DatePicker) expect either 'fr' or 'en-GB'.
    // This function should be called by all templates that define LANGUAGE_CODE.
    function formatLanguageCode(code) {
        var idx = code.indexOf('-');
        if (idx === -1) {  // 2 characters code: 'fr'
            return code;
        }
        return code.substr(0, idx) + code.substr(idx).toUpperCase();
    }

    // Return locale code like fr_FR, en_US etc
    function formatLocaleCode(code) {
        return formatLanguageCode(code).replace('-','_');
    }

    /**
    * Guess the translation language code
    *
    * Example
    * return: "fr"
    *
    * with arguments:
    * language = "fr_FR"
    * tranLocales  ["fr", "en"]
    **/
    function getBestGuessCode(tranLocales, locale) {
      var bestGuessCode = locale;
      if (!_.includes(tranLocales, locale)) {
        var availableCodes = _.filter(tranLocales, function(code) {
          return code.substr(0, 2) === locale.substr(0, 2);
        });
        if (!_.isEmpty(availableCodes)) {
          bestGuessCode = availableCodes[0];
        }
      }
      return bestGuessCode;
    }


    bluetilsNamespace.Localization = {
      'formatLanguageCode': formatLanguageCode,
        'formatLocaleCode': formatLocaleCode,
        'getBestGuessCode': getBestGuessCode
    };

}(Bluetils));
