document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    
});

document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
    }
});

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');
const searchInput = document.querySelector('#search-input');

searchBtn.onclick = function () {
    search();
};

searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        search();
    }
});

function search() {
    const searchValue = searchInput.value;

    // Check if the searchValue is not blank before making the fetch request
    if (searchValue.trim() !== "") {
        fetch('http://localhost:5000/search/' + searchValue)
            .then(response => response.json())
            .then(data => loadHTMLTable(data['data']));
    } else {
        // Display an alert or handle the case where the search value is blank
        alert("Please enter a search value before searching.");
    }
}

// Add a check for the search input value before invoking the search function
searchBtn.onclick = function () {
    const searchValue = searchInput.value;

    // Check if the searchValue is not blank before invoking the search function
    if (searchValue.trim() !== "") {
        search();
    } else {
        // Display an alert or handle the case where the search value is blank
        alert("Please enter a search value before searching.");
    }
};


function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
}
                    // How to make edit button toggle update section
function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = !updateSection.hidden; // Toggle the visibility
    document.querySelector('#update-name-input').dataset.id = id;

    if (!updateSection.hidden) {
        // Fetch data or perform any other actions when the update section is shown
        // For example, you might want to fetch the existing data for the specified ID
        // and populate the update input field.
    }
}


const updateNameInput = document.querySelector('#update-name-input');

updateNameInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        updateBtn.click(); // Trigger the click event of the update button
    }
});

updateBtn.onclick = function() {
    const updateNameInput = document.querySelector('#update-name-input');

    // Check if the updated name is not blank before making the fetch request
    if (updateNameInput.value.trim() !== "") {
        fetch('http://localhost:5000/update', {
            method: 'PATCH',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                id: updateNameInput.dataset.id,
                name: updateNameInput.value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        });
    } else {
        // Display an alert or handle the case where the updated name is blank
        alert("Please enter a name before updating.");
    }
}


const addBtn = document.querySelector('#add-name-btn');
const nameInput = document.querySelector('#name-input');

addBtn.onclick = function () {
    addNameToDatabase();
};

nameInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addNameToDatabase();
    }
});

function addNameToDatabase() {
    const name = nameInput.value;

    // Check if the name is not blank before making the fetch request
    if (name.trim() !== "") {
        nameInput.value = "";

        fetch('http://localhost:5000/insert', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ name: name })
        })
            .then(response => response.json())
            .then(data => insertRowIntoTable(data['data']));
    } else {
        // Display an alert or handle the case where the name is blank
        alert("Please enter a name before adding to the database.");
    }
}


function insertRowIntoTable(data) {
    console.log(data);
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";

    data.forEach(function ({id, name, date_added}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}