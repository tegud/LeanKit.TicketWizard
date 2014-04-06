module.exports = {
    toCamelCase: function (input){
        if(!input) {
            return input;
        }

        return input.toLowerCase().replace(/ (.)/g, function(match, characterAfterSpace) {
            return characterAfterSpace.toUpperCase();
        });
    }
};
