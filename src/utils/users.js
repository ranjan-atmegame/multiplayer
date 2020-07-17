//List of all users
const users = [];            // user = [{id: 1, name: 'Abc', game: 'Pub-G', room: 'Xyz', score: 0}];

const findUser = userId => {
    return users.find(({id}) => id === userId);
}

const findUserIndex = userId => {
    return users.findIndex(user => user.id === userId);
}

const newUser = (id, name, game) => {
    let newUser = {id, name, game, score: 0};
    users.push(newUser);
    return newUser;
}

const removeUser = userId => {
    const userIndex = users.findIndex(({id}) => id === userId);
    return users.splice(userIndex, 1);
}

const getUsers = () => users;

const updateUserRoom = (userId, room) => {
    const index = findUserIndex(userId);
    if(index === -1) {
        throw new Error("Error: User not found.");
    }
    users[index] = {...users[index], room};
    return users[index];
}

//Need to refactor this code later
const updateUserScore = (userId, score) => {
    const index = findUserIndex(userId);
    if(index === -1) {
        throw new Error("Error: Updating invalid user score.")
    }

    users[index] = {...users[index], score}
}

module.exports = {
    findUser,
    findUserIndex,
    getUsers,
    newUser,
    removeUser,
    updateUserRoom,
    updateUserScore
}

// newUser(1, 'Ansh', 'Pub-G');
// newUser(2, 'Hars', 'Pub-G');
// newUser(3, 'Puchki', 'Air-fireware');
// updateUserRoom(1, 'ABCD');
// updateUserRoom(2, 'ABCD');
// removeUser(1);
// updateUserScore(1, 10);

// console.log(users);