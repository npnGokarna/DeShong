/**
 * E.164 format
 * A telephone number can have a maximum of 15 digits
 * The first part of the telephone number is the country code
 * The second part is the national destination code (NDC)
 * The last part is the subscriber number (SN)
 * The NDC and SN together are collectively called the national (significant) number
 */


 /**********************************************************************************************
                                            APPROACH 1
                                More effecient for production level code
 **********************************************************************************************/

/**
 * utilize Google Android's libphonenumber library: easy phone number parsing and formatting in javascript.
 * MIT License
 * https://github.com/catamphetamine/libphonenumber-js
 */
 const core = require('libphonenumber-js/core');
 const metadata = require('libphonenumber-js/metadata.full.json');

 // a common invalid message for invalid phone number
 const invalidMessage = 'Invalid Phone Number';

 function formatPhoneNUmber(phoneNum) {
    // if it is an empty string, return invalid message
    if (!phoneNum) {
        return invalidMessage;
    }
    // wrap the validation into a try catch block to catch invalid phone number exceptions, phone numbers that may not be valid but satisfy the format.
    try {
        // parse the phone number for country code 'US'.
        let phone = core.parsePhoneNumber(phoneNum, 'US', metadata);
        // isValid() checks if the number is valid for example '123 456 7890' is invalid but '972 456 7890' is valid.
        return phone.isValid() ? phone.number : invalidMessage;
    } catch(e) {
        return invalidMessage;
    }
 }

 console.log('**********************Approach 1**************************');

 //invalid US phone numbers
 console.log(' =>', formatPhoneNUmber(''));
 console.log('123 456 7890 =>', formatPhoneNUmber('123 456 7890'));
 console.log('random string =>',formatPhoneNUmber('random string'));
 console.log('i123 =>',formatPhoneNUmber('i123'));
 //valid US phone numbers in different format
 console.log('(972) 456 7890 =>',formatPhoneNUmber('(972) 456 7890'));
 console.log('9724567890 =>',formatPhoneNUmber('9724567890'));
 //phone numbers with country code
 console.log('1-972-456-7890 =>',formatPhoneNUmber('1-972-456-7890'));
 console.log('1 (972) 456-7890 =>',formatPhoneNUmber('1 (972) 456-7890'));
 console.log('19724567890 =>',formatPhoneNUmber('19724567890'));
 //phone number with country code and the '+' sign
 console.log('+1 972 456 7890 =>',formatPhoneNUmber('+1 972 456 7890'));
 //phone number with extensions
 console.log('+19724567890 ext.123 =>',formatPhoneNUmber('+19724567890 ext.123'));
 console.log('+19724567890#123 =>',formatPhoneNUmber('+19724567890#123'));
 console.log('+19724567890,123 =>',formatPhoneNUmber('+19724567890,123'));



 /**********************************************************************************************
                                            APPROACH 2
 **********************************************************************************************/

 /**
  * Assumptions
  * The string must contain phone number format numbers only consisting of (,),' ', -, +, 0-9.
  * since E.164 format specifiex 15 as max, following implementation assumes, minimum number of characters in a phone string is 12 including +, countryCode and number
  * if the phone number starts with 0, return invalid number.
  * if a string has 10 numbers separted over the sentence, it is still considered as a phone number, as long as the string has a total of 10 digits.
  * does not check for invalid phone numbers such as 1111111111, 0000000000 and more.
  * Does check for if the country code is +1, returns invalid if the + is followed by code other than 1, since this is for US validation
  * if the phone number starts with 1, following function assumes, that is the country code.
  */

  function genericPhoneValidator(phoneNum) {
      // regex /^([\+][1]{1}([\s+\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9 \-]{1,11})$/
      // the first digit shall be country code if it is 1.
      // followed by 3 digit area code, could be separated by a space, '(' or '-' or combination of space and any of the delimeter.
      let phoneReg = phoneNum.match(/^([\+][1]{1}([\s+\-])?)?([\(]{1}[0-9]{3}[\)])?([0-9 \-]{1,15})$/);
      if(phoneReg) {
          //extract all digits from valid phone numbers;
        phoneNum = phoneNum.replace(/\D/g, '');
        // if the first digit is 1, then it is considered as country code, do not append a country code
        // else append the country code in the number
        let countryCode = phoneNum[0] === '1' ? '' : '1';
        let result = `+${countryCode}${phoneNum}`;
        // check if the final phone number is at least 10 digits, 1 country code and '+' char, total of 12 characters
        return result.length < 12 ? invalidMessage : result;
      } else {
          return invalidMessage;
      }
  }

console.log('**********************Approach 2**************************');

//invalid phone numbers

console.log(genericPhoneValidator('+000000000000000'));
console.log(genericPhoneValidator('+1 invalid number'));
console.log(genericPhoneValidator('9'));
console.log(genericPhoneValidator('(123) 456 7889'));
// area code needs to be 3 digits
console.log(genericPhoneValidator('(23) 456 78899'));

// valid phone numbers
 console.log(genericPhoneValidator('000000000000000'));
 console.log(genericPhoneValidator('+1-923-345-4567'));
 console.log(genericPhoneValidator('(923)345-4567'));
 console.log(genericPhoneValidator('(923)    -345  -4567'));
 console.log(genericPhoneValidator('923-345-4567'));