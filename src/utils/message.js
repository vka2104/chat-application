const generateMessage = (username, text) => {
    return {
        username,
        text,
        CreatedAt: new Date().getTime()
    }
}
module.exports ={
    generateMessage
}