function parseDateString(dateString) {
    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(4, 6), 10) - 1; // Months are 0-based in JS
    const day = parseInt(dateString.slice(6, 8), 10);
    return new Date(year, month, day);
}

const timetable = [
    [8, 40, 0, 0],
    [9, 20, 0, 0],
    [10, 50, 0, 0],
    [11, 40, 0, 0],
    [12, 30, 0, 0],
    [14, 5, 0, 0],
    [14, 55, 0, 0],
    [15, 40, 0, 0],
    [16, 45, 0, 0],
    [17, 40, 0, 0],
    [18, 35, 0, 0]
];

const container = document.getElementById('soundbox-container');


function fetchData() {
    fetch('https://soundbox.v1an.xyz/getBookedSoundbox', { credentials: 'include' })
        .then(response => response.json())
        .then(data => renderSoundboxes(data))
        .catch(error => console.error('Error fetching soundboxes:', error));
}

function renderSoundboxes(data) {
    data=data.sort((a, b) => parseInt(b[2]) - parseInt(a[2]));
    container.innerHTML = ''; // Clear previous content

    const now = new Date().getTime();
    let count = 0;

    for (const booking of data) {
        if (count >= 12) break;

        const [soundboxID, blockIndex, time] = booking;
        let registrationDate = parseDateString(time); // Convert "20080226" to a Date object
        registrationDate.setHours(timetable[blockIndex-1][0],timetable[blockIndex-1][1],timetable[blockIndex-1][2],timetable[blockIndex-1][3]);
        const isPast = registrationDate.getTime() < now;

        const blockDiv = document.createElement('div');
        blockDiv.className = 'soundbox-block';
        blockDiv.style.setProperty('--block-bg-color', isPast ? '#dcdcdc' : '#c1e1c5'); // Light grey for past, green for future

        // Header
        const header = document.createElement('div');
        header.className = 'block-header';
        header.innerText = formatHeader(registrationDate, blockIndex); // Example: "Mon. 19 B4"
        blockDiv.appendChild(header);

        // Body
        const body = document.createElement('div');
        body.className = 'block-body';
        body.innerText = `Soundbox ${soundboxID}`; // Example: "Soundbox xxx"
        blockDiv.appendChild(body);

        // Footer
        if (!isPast) {
            const footer = document.createElement('div');
            footer.className = 'block-footer';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerText = 'Unbook';
            deleteBtn.addEventListener('click', () => handleDelete(soundboxID, time, blockIndex));
            footer.appendChild(deleteBtn);

            blockDiv.appendChild(footer);
        }

        container.appendChild(blockDiv);
        count++;
    }

    // Fill with "No Data" blocks if less than 6
    while (count < 12) {
        const noDataDiv = document.createElement('div');
        noDataDiv.className = 'soundbox-block no-data';
        noDataDiv.innerText = 'No Data';
        container.appendChild(noDataDiv);
        count++;
    }
}


function formatHeader(date, blockIndex) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = dayNames[date.getDay()];
    const dateNumber = date.getDate();
    const blockLabel = `B${blockIndex}`;
    return `${day}. ${dateNumber} ${blockLabel}`;
}

function handleDelete(soundboxID, date, block) {
    fetch(`https://soundbox.v1an.xyz/unbook?block=${block}&date=${date}&id=${soundboxID}`, {
        credentials: 'include',
        method: 'POST'
    })
        .then((response) => response.json())
        .then(() => {
            alert(`Soundbox ${soundboxID} unbooked successfully.`);
            fetchData(); // Refresh data after deletion
        })
        .catch(error => console.error('Error unbooking soundbox:', error));
    location.reload();
}

// Fetch and render data on page load
fetchData();
