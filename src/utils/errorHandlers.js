const handleGetRequestError = (err, httpResponse) => {
    httpResponse.status(400).json({error : `Resource not found: ${err}`});
};

const handlePostRequestError = (err, httpResponse) => {
    httpResponse.status(400).json({error : `Resource not created: ${err}`});
};

module.exports = {handleGetRequestError, handlePostRequestError}