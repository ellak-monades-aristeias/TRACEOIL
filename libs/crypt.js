var bcrypt   = require('bcrypt-nodejs');//for password crypt

function encrypt(valueToEncrypt){
    return bcrypt.hashSync(valueToEncrypt,bcrypt.genSaltSync(8),null);
}

function validate(valueToCheck,encryptedValue){
    return bcrypt.compareSync(valueToCheck,encryptedValue);
}

exports.encrypt = encrypt;
exports.validate = validate;