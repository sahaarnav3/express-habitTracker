// console.log('loadedddd');

document.querySelectorAll('.habit-form').forEach((elem) => {
    elem.addEventListener('click', async (event) => {
        // event.preventDefault();
        console.log(event.target.id);
        await fetchDatesFunction(event.target.id);
    });
})

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
    fetch('/fetch-dates', options)
    .then(response => response.json())
    .then(data => console.log('Inside Fetch Function -- ' ,data))
    .catch(err => console.log("inside fetch function error caused -- ", err));
}