  //the below array will have the details of a list of all users in a room
  const users = []
  
const addUsers = ({id, username, room}) => {
  
    //the below will remove the extra space and convert into lowercase then store it in a another variable 
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //the below if condition checks the username and room will be empty or not
    //if it is empty it will return the error message
    if(!username || !room) return {error: `username and room are required` }

    //the below find method will find from the users array if the users 
    // already exists it will stores that user into that variable
    const existingUser = users.find( (user) => user.username === username && user.room === room)

    //the below if condition checks the user is already exists it will return the error
    if(existingUser) return {error: `User is already in use.!`}

    //if the user is not present in the users array means the below method will add the users into the users array

    const user = {id, username, room}
    users.push(user)
    return {user}
}

//the below method will remove the users from the room

const removeUser = ( id) => {
    //the below method will stores the if the user exists
    const index = users.findIndex( (user) => user.id === id )

    //the below if condition checks if the user exists 
    //if it is false it will return the error message
    if(index === -1) return {error: 'the user is not available..!'}
    return users.splice(index, 1)[0]
}


const getUsers = (id) => {
    return users.find( user => user.id === id)
}
const getUsersInRoom = (room) => {
    room = room
    return users.filter( user => user.room === room )
}

module.exports = {
    addUsers,
    removeUser,
    getUsers,
    getUsersInRoom
}

