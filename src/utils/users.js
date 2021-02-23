const users = []

// addUsers removeUsers getUsers getUsersInRoom

const addUser = ({id, username, room}) => {
    // Clean the Data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if(!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for exisiting user
    const exisitingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate Username
    if(exisitingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = {id, username, room }
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user)=>{
        return user.id === id
    })
    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUsers = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) =>{ 
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUsers,
    getUsersInRoom
}
