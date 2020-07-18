// Elements=============
//Login Section
// const $joiningForm = document.querySelector("#joiningForm");
// const $userNameField = document.querySelector("#joiningForm #userName");
// const $submitButton = document.querySelector("#submitButton");
// const $loader       = document.querySelector("#loader");
// const $loginSection = document.querySelector("#loginSection");
// const $gameSection = document.querySelector("#gameSection");
//Game Section
const $updateScore = document.querySelector("#updateScore");
const $score = document.querySelector("#score");
const $players = document.querySelector('#players')

// Templates
const gameTemplate = document.querySelector('#game-template').innerHTML

//Options===============
//Login Section
// const game = document.querySelector("#game").value;

//Events================
socket.on('join', (users) => {
    if(users.length === 1) {
        firstPlayerName = users[0].name;
        firstPlayerScore = users[0].score;
        secondPlayerName = 'Guest';
        secondPlayerScore = 0;
    } else {
        firstPlayerName = users[0].name;
        firstPlayerScore = users[0].score;
        secondPlayerName = users[1].name;
        secondPlayerScore = users[1].score;
    }

    const html = Mustache.render(gameTemplate, {
        firstPlayerName,
        firstPlayerScore,
        secondPlayerName,
        secondPlayerScore
    })
    $players.innerHTML = html;
});

const updateScore = (score) => {
    $updateScore.setAttribute('disabled', 'disabled')
    socket.emit('updateScore', score, (error) => {
        $updateScore.removeAttribute('disabled')
        if (error) {
            return console.log(error)
        }

        $score.value = score;
    })
}

$updateScore.addEventListener('click', () => {
    let score = $score.value;
    score++;
    updateScore(score);
});

socket.emit('showGame', (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }

    console.log('Emitted show game')
})