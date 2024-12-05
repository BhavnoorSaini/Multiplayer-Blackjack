// Santiago Ramirez & Bhavnoor Saini
// CSCE 315 - Blackjack Multiplayer Highscores
// --- sends requests to retrieve the highscores and display them ---

document.addEventListener('DOMContentLoaded', () => {
    fetchHighscores();          // fetches the highscores when the page is loaded
});

function fetchHighscores() {        // fetches the highscores from the server
    fetch('http://127.0.0.1:3000/highscore')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }
            return response.json();     // returns the response in JSON format
        })
        .then(data => {
            populateHighscoresTable(data.highscores);       // populates the highscores table with the highscores
        })
        .catch(error => {
            console.error('Error fetching high scores:', error);
            displayErrorMessage('Unable to load high scores. Please try again later.');
        });
}

function populateHighscoresTable(highscores) {          // populates the highscores table with the highscores
    const highscoresBody = document.getElementById('highscores-body');
    highscoresBody.innerHTML = '';              // clear existing entries
    if (highscores.length === 0) {                  // if there are no high scores available, display a message
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 2;
        cell.textContent = 'No high scores available.';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
        highscoresBody.appendChild(row);
        return;
    }
    highscores.forEach(score => {
        const row = document.createElement('tr');           // creates a new row 
        const usernameCell = document.createElement('td');  // creates a new cell for the username
        usernameCell.textContent = score.username;
        const scoreCell = document.createElement('td');     // creates score cell
        scoreCell.textContent = score.score;
        row.appendChild(usernameCell);              // appends the username and score to the rows
        row.appendChild(scoreCell);
        highscoresBody.appendChild(row);
    });
}

function displayErrorMessage(message) {     // displays an error message
    const highscoresBody = document.getElementById('highscores-body');
    highscoresBody.innerHTML = '';              // clears the existing entries
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 2;
    cell.textContent = message;
    cell.style.textAlign = 'center';
    cell.style.color = 'red';           // sets the color of the error message to red
    row.appendChild(cell);              // appends the error message to the rows
    highscoresBody.appendChild(row);
}