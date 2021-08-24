exports.sleep = function (ms) { //make wait function
    return new Promise(resolve => setTimeout(resolve, ms));
}