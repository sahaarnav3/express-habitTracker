const fetchDatesFunction = async (id) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            habitId: id
        })
        // body: `habitId=${id}`
    };
    // fetch('/fetch-dates', options)
    // .then(response => response.json())
    // .then(data => {
    //     console.log('Inside Fetch Function -- ' ,data);
    //     return data;
    // })
    try {

        let fetchedData = await fetch('/fetch-dates', options);
        let jsonData = fetchedData.json();
        return jsonData;
        // .catch(err => console.log("inside fetch function error caused -- ", err));
    } catch (err) {
        return { 'message': `Error Occured while fetching dates from mongo (This is client side) (err = ${err})` };
    }
}

//Below Function will be used to save notes in mongoDB according to the habitId
const puthabitNotes = async (id, note) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            habitId: id,
            note: note
        })
    };
    try {
        let fetchedData = await fetch('/create-note', options);
        console.log(fetchedData.status);
    } catch (err) {
        return { 'message': `Error Occured while creating note on mongoDB (This is client side) err -- ${err}` };
    }
}

//Below function will be used to fetch all notes from mongoDB
const fetchNotes = async (id) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            habitId: id
        })
    };
    try {
        let fetchedData = await fetch('/fetch-notes', options);
        console.log(fetchedData.status);
        return fetchedData.json();
    } catch (err) {
        return { 'message': `Error Occured while creating note on mongoDB (This is client side) err -- ${err}` };
    }
}

//To convert date format received from mongo into the format shown in homepage
function formatDate(dateString) {
    const date = new Date(dateString); // Parse the date string
    // Get the day of the week (0-6) and convert it to full name (e.g., Wednesday)
    const dayOfWeek = date.getDay();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[dayOfWeek];
    // Get the month (0-11) and convert it to full name (e.g., May)
    const month = date.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[month];
    // Get the date (day of the month)
    const day = date.getDate();
    // Get the year
    const year = date.getFullYear();
    // Format the date in the desired format
    return `${dayName} ${monthName} ${day}, ${year}`;
}

//Below function is used to change the status of habit for the respective date--
const changeActionStatus = async (id, newStatus) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            habitPerDayId: id,
            status: newStatus
        })
    };
    try {

        let fetchedData = await fetch('/update-date-status', options);
        let jsonData = await fetchedData.json();
        // let responseData = fetchedData.status;
        console.log(fetchedData.status);
        // .catch(err => console.log("inside fetch function error caused -- ", err));
        if (fetchedData.status != 200) {
            //throw some alert here.
        }
    } catch (err) {
        return { 'message': `Error Occured while updating date status on mongoDB (This is client side) err = ${err}` };
    }
}


document.querySelectorAll('.habit-form').forEach((elem) => {
    elem.addEventListener('click', async (event) => {
        document.querySelector('.habit-description').classList.remove('hidden');
        // event.preventDefault();
        // console.log(event.target.id);
        const fetchedDates = await fetchDatesFunction(event.target.id);
        document.querySelector('.habit-days-list').removeAttribute('id');
        document.querySelector('.habit-days-list').id = event.target.id;
        const fetchedNotes = await fetchNotes(event.target.id);
        document.querySelector('.habit-note-display').innerHTML = "";
        fetchedNotes.forEach(note => {
            document.querySelector('.habit-note-display').innerHTML += 
            `
                <p>${note.note}</p>
            `
        })
        // console.log('fetched dates inside actual event -- ', fetchedDates);
        document.querySelector('.habit-days-list').innerHTML = "";
        fetchedDates.forEach(elem => {
            let status = 0;
            switch (elem.status) {
                case 'Done':
                    status = 0;
                    break;
                case 'Not Done':
                    status = 1;
                    break;
                case 'No Action':
                    status = 2;
                    break;
            }
            document.querySelector('.habit-days-list').innerHTML +=
                `
                <div class="habit-day">
                    <h4>🗓️ ${formatDate(elem.date)}</h4>
                    <div class="habit-status">
                        <input type="button" value="Done" id="${elem['_id']}" class="date-status-btn ${elem['_id']} ${status == 0 ? 'selected' : ""}">
                        <input type="button" value="Not Done" id="${elem['_id']}" class="date-status-btn ${elem['_id']} ${status == 1 ? 'selected' : ""}">
                        <input type="button" value="No Action" id="${elem['_id']}" class="date-status-btn ${elem['_id']} ${status == 2 ? 'selected' : ""}">
                    </div>
                </div>
            `;
            const dateStatusBtn = document.querySelectorAll('.date-status-btn')
            dateStatusBtn.forEach(btn => {
                btn.addEventListener('click', async () => {
                    await changeActionStatus(btn.id, btn.value);
                    Array.from(document.getElementsByClassName(`${btn.id}`)).forEach(elem => {
                        elem.classList.remove('selected');
                        // console.log("inside btn classlist remover..")
                    });
                    btn.classList.add('selected');
                })
            })
        });
    });
});

document.querySelector('.habit-note-submit').addEventListener('click', async () => {
    const textValue = document.querySelector('.habit-note-input').value.trim();
    const habitId = document.querySelector('.habit-days-list').id;
    if (textValue) {
        await puthabitNotes(habitId, textValue);
        document.querySelector('.habit-note-display').innerHTML = "";
        const fetchedNotes = await fetchNotes(habitId);
        fetchedNotes.forEach(note => {
            document.querySelector('.habit-note-display').innerHTML += 
            `
                <p>${note.note}</p>
            `
        })
    }
})

