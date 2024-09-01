const users = []

const addUser = ({id, username, room}) => {

    const user = {id, username, room}
    users.push(user)
    return {user}

}

const removeUser = (id) =>{
    const index = users.findIndex((user)=> user.id === id )
    if(index != -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) =>{
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) =>{
    let count = 0
     users.forEach((user) => {
         if(user.room === room)
         {
             count++
         }
     })
     return count
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}