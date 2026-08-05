const BASE_URL = "http://localhost:8080/carbon";

//  FORM 

const carbonForm = document.getElementById("carbonForm");

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


// PROFILE 

const user = JSON.parse(localStorage.getItem("user"));

if (user) {

    document.querySelectorAll(".profile-name").forEach(el => {
        el.innerText = user.fullName;
    });

}

// FORM SUBMIT 

carbonForm.addEventListener("submit", function (event) {

    event.preventDefault();

    calculateCarbon();

});

//  CALCULATE 

async function calculateCarbon() {

    const electricity = Number(document.getElementById("electricity").value);

    const travel = Number(document.getElementById("travel").value);

    const waste = Number(document.getElementById("waste").value);


    // Show Result Immediately

    let totalEmission =
        (electricity * 0.4) +
        (travel * 0.2) +
        (waste * 1.5);

    totalEmission = totalEmission.toFixed(1);

    document.getElementById("totalEmission").innerText = totalEmission;


    let message = "";

    if (totalEmission < 50) {

        message = "Excellent 🌱 Your carbon footprint is low.";

    } else if (totalEmission < 100) {

        message = "Good 👍 Try reducing travel emissions.";

    } else {

        message = "High emission ⚠ Consider eco-friendly habits.";

    }

    document.getElementById("message").innerText = message;

    // CHECK LOGIN 

    if (!user) {

        alert("Please login first.");

        return;

    }

    // SEND TO BACKEND

    const carbonData = {

        userId: user.id,

        electricity: electricity,

        travel: travel,

        waste: waste

    };

    console.log(carbonData);

    try {

       const response = await fetch(`${BASE_URL}/save`, {

    method: "POST",

    headers: getAuthHeaders(),

    body: JSON.stringify(carbonData)

});

        const data = await response.json();

        console.log(data);

        if (response.ok) {

            alert(data.message);

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server ❌");

    }

}

window.onload = async function(){

    loadUserProfile();
   
    
}

document.querySelectorAll(".quick-btn")
.forEach(btn=>{

btn.addEventListener("click",()=>{

document.getElementById("userMessage").value =
btn.innerText;

sendMessage();

});

})