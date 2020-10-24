// HTTP ERROR HANDLERS
const handleGetRequestError = (err, httpResponse) => {
    httpResponse.status(400).json({error : `Resource not found: ${err}`});
};

const handlePostRequestError = (err, httpResponse) => {
    httpResponse.status(400).json({error : `Resource not created: ${err}`});
};

// MQTT ERROR HANDLERS
const handleMQTTMessageInError = (err) => {
    console.log('Error ocurred while saving a mqtt message in the DB');
    console.log(`${err}`);
}

const suscriptionErrorHandler = (err, granted) => {
    if(err) console.log(`An error has occured: ${err}`);
    else {
        console.log(`Suscription successfull`);
        console.log(granted);
    }
};

module.exports = {
    handleGetRequestError, 
    handlePostRequestError, 
    handleMQTTMessageInError, 
    suscriptionErrorHandler
}