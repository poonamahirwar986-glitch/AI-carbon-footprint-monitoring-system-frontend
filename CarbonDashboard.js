const BASE_URL = "https://carbon-backend-2.onrender.com/carbon";

Chart.register(ChartDataLabels);

// LOGGED IN USER 

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert("Please Login First!");
    window.location.href = "carnbonsignup.html";
}


//  LOAD DASHBOARD

window.onload = async function () {

    loadDashboard();
     loadUserProfile();

};


// LOAD DASHBOARD 

async function loadDashboard() {

    try {

        const response = await fetch(
    `${BASE_URL}/dashboard/${user.id}`,
    {
        method: "GET",
        headers: getAuthHeaders()
    }
);
        const data = await response.json();

        console.log(data);

        // CARDS 

        document.getElementById("totalEmissionCard").innerText =
            data.totalEmission.toFixed(1) + " kg";

        document.getElementById("totalEntriesCard").innerText =
            data.totalEntries;

        document.getElementById("averageEmissionCard").innerText =
            data.averageEmission.toFixed(1) + " kg";

        document.getElementById("treesRequiredCard").innerText =
            data.treesRequired;

        
        createBarChart(data);
        createPieChart(data);

    }

    catch (error) {

        console.error(error);

        alert("Unable to load Dashboard ❌");

    }

}

// BAR CHART

function createBarChart(data) {

    const ctx = document.getElementById("barChart");


    const emissionData = [

        data.electricityEmission,
        data.travelEmission,
        data.wasteEmission

    ];


    const total = emissionData.reduce((a,b)=>a+b,0);


    new Chart(ctx, {

        type: "bar",

        data: {

            labels: [

                "Electricity",
                "Travel",
                "Waste"

            ],

            datasets: [{

                label: "CO₂ Emission (kg)",

                data: emissionData,

                backgroundColor: [

                    "#16a34a",
                    "#3b82f6",
                    "#f59e0b"

                ]

            }]

        },


        options: {

            responsive:true,

            plugins: {

                legend: {

                    display:false

                },


                tooltip: {

                    callbacks: {

                        label:function(context){

                            let value = context.raw;

                            let percentage =
                            ((value/total)*100).toFixed(1);

                            return value + " kg (" + percentage + "%)";

                        }

                    }

                }

            },

            scales: {

                y: {

                    beginAtZero:true

                }

            }

        }

    });

}

//  PIE CHART 

function createPieChart(data) {

    const ctx = document.getElementById("pieChart");


    const total =
        data.electricityEmission +
        data.travelEmission +
        data.wasteEmission;


    const percentageData = [

        ((data.electricityEmission / total) * 100).toFixed(1),

        ((data.travelEmission / total) * 100).toFixed(1),

        ((data.wasteEmission / total) * 100).toFixed(1)

    ];


    new Chart(ctx, {

        type: "pie",

        data: {

            labels: [
                "Electricity",
                "Travel",
                "Waste"
            ],

            datasets: [{

                data: percentageData,

                backgroundColor: [
                    "#16a34a",
                    "#3b82f6",
                    "#f59e0b"
                ]

            }]

        },

        options: {

            responsive:true,

            plugins: {

                tooltip: {

                    callbacks: {

                        label:function(context){

                            return context.label + " : " + context.raw + "%";

                        }

                    }

                },

                legend: {

                    position:"bottom"

                }

            }

        }

    });

}

// SIDEBAR 

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
