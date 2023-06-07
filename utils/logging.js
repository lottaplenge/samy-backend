function logError(error){
    console.error(`[ERROR] ${format(error)}`);
}

function format(data){
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()} ${JSON.stringify(data, null, 2)}`;
}

module.exports = {
    logError
}