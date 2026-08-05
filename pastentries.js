const BASE_URL = "http://localhost:8080/carbon";

// LOGGED IN USER 

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert("Please Login First!");
    window.location.href = "carnbonsignup.html";
}

let entries = [];

window.onload =  async function () {

     loadUserProfile();

    document.querySelectorAll(".profile-name").forEach(el => {
        el.innerText = user.fullName;
    });


    loadUserProfile();
    loadEntriesFromDatabase();
};

//  FETCH DATA

async function loadEntriesFromDatabase() {

    try {

       const response = await fetch(
    `${BASE_URL}/history/${user.id}`,
    {
        method: "GET",
        headers: getAuthHeaders()
    }
);

        entries = await response.json();

        console.log(entries);

        loadTable(entries);

    } catch (error) {

        console.error(error);

        alert("Unable to load entries ❌");

    }

}

// TABLE 

const tableBody =
    document.getElementById("entriesTableBody");

function loadTable(data) {

    tableBody.innerHTML = "";

    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No Entries Found
                </td>
            </tr>
        `;

        return;
    }

    data.forEach(entry => {

        let statusClass = "";

        if (entry.status === "LOW") {

            statusClass = "low";

        } else if (entry.status === "MEDIUM") {

            statusClass = "medium";

        } else {

            statusClass = "high";

        }

        tableBody.innerHTML += `

            <tr>

                <td>${entry.date}</td>

                <td>${entry.electricity}</td>

                <td>${entry.travel}</td>

                <td>${entry.waste}</td>

                <td>${entry.totalEmission.toFixed(1)} kg</td>

                <td>

                    <span class="status ${statusClass}">
                        ${entry.status}
                    </span>

                </td>

            </tr>

        `;

    });

}

//  SEARCH 

const searchInput =
    document.getElementById("searchInput");

searchInput.addEventListener("keyup", function () {

    const value =
        this.value.toLowerCase();

    const filtered =
        entries.filter(entry =>
            entry.date.toLowerCase().includes(value)
        );

    loadTable(filtered);

});

//  SIDEBAR 

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("main-content");

menuBtn.addEventListener("click", () => {

    if (window.innerWidth <= 768) {

        sidebar.classList.toggle("show");

    } else {

        sidebar.classList.toggle("hide");
        mainContent.classList.toggle("expand");

    }

});

