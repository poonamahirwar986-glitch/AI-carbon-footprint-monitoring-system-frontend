function getAuthHeaders(){

    return {
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
    };

}

//  AUTH.JS 


// Get logged in user data

function getCurrentUser(){

    let user = localStorage.getItem("user");


    if(user){

        try{

            return JSON.parse(user);

        }
        catch(error){

            console.log("User data error");

        }

    }


    // fallback if data saved separately

    return {

        id: localStorage.getItem("id"),

        fullName: localStorage.getItem("fullName"),

        email: localStorage.getItem("email"),

        profileImage: localStorage.getItem("profileImage")

    };

}



// ================= LOAD USER PROFILE =================


function loadUserProfile(){


    const user = getCurrentUser();



    if(!user){
        return;
    }



    // Name

    const nameElements =
    document.querySelectorAll(".profile-name");


    nameElements.forEach(element=>{

        if(user.fullName){

            element.innerText =
            user.fullName;

        }

    });

    // Profile Image

    const images =
    document.querySelectorAll("#topProfileImage");

    images.forEach(img=>{

        if(user.profileImage){

            img.src =
            user.profileImage;

        }


    });


}



// ================= CHECK LOGIN =================


function checkLogin(){


    const token =
    localStorage.getItem("token");

    if(!token){

        window.location.href =
        "carbonsignup.html";

    }

}

// ================= LOGOUT =================


function logout(){


    localStorage.clear();


    window.location.href =
    "carbonsignup.html";


}

// ================= PAGE LOAD =================


document.addEventListener(
"DOMContentLoaded",
function(){


    checkLogin();


    loadUserProfile();


});

function loadUserProfile() {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    // Name
    document.querySelectorAll(".profile-name").forEach(el => {
        el.innerText = user.fullName || "";
    });

    // Photo
    document.querySelectorAll("#topProfileImage").forEach(img => {

        if(user.profileImage){

            img.src = user.profileImage;

            img.onerror = function(){

                this.src = "images/default-user.png";

            }

        }

    });

}