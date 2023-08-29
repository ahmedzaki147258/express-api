function log1(req, res, next){
    console.log("Ahmed zaki");
    next();
};

function log2(req, res, next){
    console.log("mahmoud zaki");
    next();
};

module.exports = {log1, log2};