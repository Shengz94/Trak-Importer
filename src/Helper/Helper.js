
function isNull(variable){
    return variable === "undefined" || variable === "null" 
    || variable === "" || typeof variable === "undefined"
    || variable === undefined || variable === null;
}

export default isNull;