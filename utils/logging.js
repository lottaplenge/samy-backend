require('dotenv').config()

const logLevel = process.env.LOG_LEVEL;
function logError(error){
    console.error(`[ERROR] ${format(error)}`);
}

function logWarning(message){
    if(logLevel === "debug" || logLevel === "info" || logLevel === "warn"){
        console.log(`[WARN] ${format(message)}`)
    }
}

function logInfo(message){
    if(logLevel === "debug" || logLevel === "info"){
        console.log(`[INFO] ${format(message)}`)
    }
}


function format(data){
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${JSON.stringify(data, null, 2)}`;
}

module.exports = {
    logError,
    logWarning,
    logInfo
}