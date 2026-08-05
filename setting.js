
// SETTINGS.JS 

const BASE_URL = "http://localhost:8080/user";



const loginUser = JSON.parse(localStorage.getItem("user"));

if (!loginUser) {
    alert("Please Login First");
    window.location.href = "carnbonsignup.html";
}

window.onload = async function(){

    loadUserProfile();
    loadSettings();
    
}

document.querySelectorAll(".quick-btn")
.forEach(btn=>{

btn.addEventListener("click",()=>{

document.getElementById("userMessage").value =
btn.innerText;

sendMessage();

});

})

// GET USER ID 

function getUserId(){

    let userId = localStorage.getItem("id");

    if(!userId){

        const user =
        localStorage.getItem("user");

        if(user){

            try{

                const userData =
                JSON.parse(user);

                userId = userData.id;

            }
            catch(error){

                console.log(error);

            }

        }

    }

    return userId;

}

// LOAD SETTINGS

async function loadSettings(){
    const userId = getUserId();
    if(!userId){

        console.log("User not logged in");

        return;

    }
    try{
        const response = await fetch(

            `${BASE_URL}/settings/${userId}`

        );
        if(!response.ok){

            throw new Error(
                "Unable to load settings"
            );

        }
        const data =
        await response.json();



        console.log(
            "Settings Data:",
            data
        );



        //  Notification Toggle

        const notification =
        document.getElementById(
            "notificationToggle"
        );


        if(notification){

            notification.checked =
            data.notificationEnabled;

        }

         const reportGeneration =
        document.getElementById(
            "reportGenerationToggle"
        );


        if(reportGeneration){

            reportGeneration.checked =
            data.reportGenerationEnabled;

        }
         const ecoTips =
        document.getElementById(
            "ecoTips"
        );


        if(ecoTips){

            ecoTips.checked =
            data.ecoTipsEnabled;

        }

        // Carbon Goal

        const carbonGoal =
        document.getElementById(
            "carbonGoal"
        );


        if(carbonGoal){

            carbonGoal.value =
            data.carbonGoal || 0;

        }

        // Tree Goal

        const treeGoal =
        document.getElementById(
            "treeGoal"
        );
        if(treeGoal){

            treeGoal.value =
            data.treeGoal || 0;

        }
    }
    catch(error){
        console.log(
            "Load Settings Error:",
            error
        );
    }
}


//  SAVE SETTINGS 

async function saveSettings(){

    const userId =
    getUserId();

    if(!userId){

        alert(
            "Please login first"
        );

        return;

    }

    const notification =
    document.getElementById(
        "notificationToggle"
    ).checked;

  const reportGeneration =
    document.getElementById(
        "reportGenerationToggle"
    ).checked;

 const ecoTips =
    document.getElementById(
        "ecoTips"
    ).checked;


    const carbonGoal =
    Number(
        document.getElementById(
            "carbonGoal"
        ).value
    );




    const treeGoal =
    Number(
        document.getElementById(
            "treeGoal"
        ).value
    );

    const settingsData = {

        notificationEnabled:
        notification,

        reportGenerationEnabled:
        reportGeneration,

        ecoTipsEnabled:
        ecoTips,

        carbonGoal:
        carbonGoal,

        treeGoal:
        treeGoal

    };
    try{

      const response =
        await fetch(

            `${BASE_URL}/settings/${userId}`,

            {   method:"PUT",


                headers:{

                    "Content-Type":
                    "application/json"

                },

                body:
                JSON.stringify(settingsData)

            }

        );
        if(!response.ok){

            throw new Error(
                "Settings update failed"
            );

        }
        const data =
        await response.json();
        console.log(
            "Updated Settings:",
            data
        );
        alert(
            "Settings saved successfully ✅"
        );
    }
    catch(error){
        console.log(
            "Save Settings Error:",
            error
        );
        alert(
            "Something went wrong ❌"
        );

    }
}

//  BUTTON EVENT

document.addEventListener(
"DOMContentLoaded",
function(){

    loadSettings();

    const saveBtn =
    document.getElementById(
        "saveSettingsBtn"
    );
    if(saveBtn){
        saveBtn.addEventListener(
            "click",
            saveSettings
        );
    }
});

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


// CHANGE PASSWORD

document.querySelector(".save-btn").addEventListener("click", async function () {

    const currentPassword =
        document.querySelectorAll("input[type='password']")[0].value;

    const newPassword =
        document.querySelectorAll("input[type='password']")[1].value;

    if (!currentPassword || !newPassword) {

        alert("Fill all fields");

        return;
    }

    try {

           const response = await fetch(
       `${BASE_URL}/change-password/${loginUser.id}`,
           {
             method:"PUT",

    headers:{
        "Content-Type":"application/json"
    },

    body: JSON.stringify({

        oldPassword: currentPassword,

        newPassword: newPassword

    })
});

        const result = await response.json();

        alert(result.message);

    } catch (e) {

        console.log(e);

        alert("Unable to change password");

    }

});
      
document.getElementById("deleteAccountBtn")
.addEventListener("click", async function () {

    const confirmDelete =
        confirm("Delete your account permanently?");

    if (!confirmDelete)
        return;

    try {

        const response =
            await fetch(`${BASE_URL}/delete/${loginUser.id}`, {

                method: "DELETE"

            });

        const result = await response.json();

        alert(result.message);

        localStorage.removeItem("user");

        localStorage.removeItem("theme");

        window.location.href = "carnbonsignup.html";

    } catch (e) {

        console.log(e);

        alert("Unable to delete account");

    }

});
