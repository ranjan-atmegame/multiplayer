const socket = io()

// Elements=============
//Login Section
const $joiningForm = document.querySelector("#joiningForm");
const $userNameField = document.querySelector("#joiningForm #userName");
const $submitButton = document.querySelector("#submitButton");
const $loader       = document.querySelector("#loader");
const $loginSection = document.querySelector("#loginSection");
const $gameSection = document.querySelector("#gameSection");
//Game Section
const $updateScore = document.querySelector("#updateScore");
const $score = document.querySelector("#score");
const $players = document.querySelector('#players')

// Templates
const gameTemplate = document.querySelector('#game-template').innerHTML

//Options===============
//Login Section
const game = document.querySelector("#game").value;

//Events================
$joiningForm.addEventListener('submit', (e) => {
    e.preventDefault()
    userName = $userNameField.value;
    $loader.style.display = "block";
    $submitButton.setAttribute('disabled', 'disabled')

    socket.emit('join', { userName, game }, (error) => {
        if (error) {
            alert(error)
            location.href = '/'
        }

        $loader.style.display = "none";
        $submitButton.removeAttribute('disabled');
        
        $loginSection.style.display = "none";
        $gameSection.style.display = "block";
        
        socket.emit('showGame', (error) => {
            if (error) {
                alert(error)
                location.href = '/'
            }
        })
    })
})

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

$updateScore.addEventListener('click', (e) => {
// const updateScore = () => {
    let score = $score.value;
    score++;
    $updateScore.setAttribute('disabled', 'disabled')
    socket.emit('updateScore', score, (error) => {
        $updateScore.removeAttribute('disabled')
        if (error) {
            return console.log(error)
        }

        $score.value = score;
    })
});

// setTimeout(updateScore, 5000);