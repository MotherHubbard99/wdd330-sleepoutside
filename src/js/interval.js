// We get references to the elements
const contdownDisplay = document.getElementById("contdown");
const startBtn = document.getElementById("startButton");

// Variable to store the starting time 
let timeLeft = 10;

// We then add the event listener to the button 
startBtn.addEventListener("click", function() {
    // We use the setInterval to decrement every second (1000 milliseconds) 
    const timer = setInterval(function() {
        timeLeft--; // This decreases time by 1

        // We then update h1 tag 
        countdonDisplay.textContent = timeLeft;

        // We then check if it reached 0 to stop 
        if (timeLeft <= 0) {
            clearInterval(timer); // This stops the setInterval 
            contdownDisplay.testContent = "Time's up";
        }
    }, 1000)
});