// Elements=============
const $joiningForm = document.querySelector("#joiningForm");
const $userNameField = document.querySelector("#joiningForm #userName");
const $submitButton = document.querySelector("#submitButton");
const $loader       = document.querySelector("#loader");
const $loginSection = document.querySelector("#loginSection");
const $gameSection = document.querySelector("#gameSection");

//Options===============
const game = document.querySelector("#game").value;


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
        showConent('game.html', () => {
            console.log("emit show game....")
        });
    })
})