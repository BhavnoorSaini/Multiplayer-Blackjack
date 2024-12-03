document.addEventListener('DOMContentLoaded', () => {
    fetchHighscores();
});

function fetchHighscores() {
    fetch('http://127.0.0.1:3000/highscores')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            populateHighscoresTable(data.highscores);
        })
        .catch(error => {
            console.error('Error fetching high scores:', error);
            displayErrorMessage('Unable to load high scores. Please try again later.');
        });
}

function populateHighscoresTable(highscores) {
    const highscoresBody = document.getElementById('highscores-body');
    highscoresBody.innerHTML = ''; // Clear existing entries

    if (highscores.length === 0) {
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
        const row = document.createElement('tr');

        const usernameCell = document.createElement('td');
        usernameCell.textContent = score.username;

        const scoreCell = document.createElement('td');
        scoreCell.textContent = score.score;

        row.appendChild(usernameCell);
        row.appendChild(scoreCell);
        highscoresBody.appendChild(row);
    });
}

function displayErrorMessage(message) {
    const highscoresBody = document.getElementById('highscores-body');
    highscoresBody.innerHTML = '';

    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 2;
    cell.textContent = message;
    cell.style.textAlign = 'center';
    cell.style.color = 'red';
    row.appendChild(cell);
    highscoresBody.appendChild(row);
}