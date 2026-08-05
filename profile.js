const BASE_URL = "http://localhost:8080/user";

// ================= ELEMENTS =================

const saveBtn = document.getElementById("saveBtn");
const imageInput = document.getElementById("imageInput");
const changePhotoBtn = document.getElementById("changePhotoBtn");

let profileImage = "";

//  LOAD PROFILE 

window.onload = async function () {

    const loginUser = JSON.parse(localStorage.getItem("user"));

    if (!loginUser) {
        alert("Please Login First");
        window.location.href = "carnbonsignup.html";
        return;
    }

    try {

        const response = await fetch(`${BASE_URL}/profile/${loginUser.id}`, {

       method: "GET",

      headers: getAuthHeaders()

});

        const data = await response.json();

        document.getElementById("fullName").value = data.fullName || "";
        document.getElementById("email").value = data.email || "";
        document.getElementById("phone").value = data.phoneNumber || "";
        document.getElementById("city").value = data.city || "";
        document.getElementById("country").value = data.country || "";
        document.getElementById("joinedDate").value = data.joinedDate || "";

        profileImage = data.profileImage || "";
        loginUser.profileImage = profileImage;
        localStorage.setItem("user", JSON.stringify(loginUser));
        document.querySelectorAll(".profile-name").forEach(el => {
            el.innerText = data.fullName;
        });

        if (profileImage) {
            document.getElementById("profileImage").src = profileImage;
            document.getElementById("topProfileImage").src = profileImage;
        }

    } catch (error) {

        console.error(error);
        alert("Unable to Load Profile");

    }
};

// UPDATE PROFILE 

saveBtn.addEventListener("click", async function () {

    const loginUser = JSON.parse(localStorage.getItem("user"));

    const updateData = {

        id: loginUser.id,

        fullName: document.getElementById("fullName").value,

        phoneNumber: document.getElementById("phone").value,

        city: document.getElementById("city").value,

        country: document.getElementById("country").value,

        profileImage: profileImage

    };

    try {

        const response = await fetch(`${BASE_URL}/update`, {

    method: "PUT",

    headers: getAuthHeaders(),

    body: JSON.stringify(updateData)

});

        const result = await response.json();

        alert(result.message);

      
        if (response.ok) {

    loginUser.fullName = updateData.fullName;
    loginUser.phoneNumber = updateData.phoneNumber;
    loginUser.city = updateData.city;
    loginUser.country = updateData.country;
    loginUser.profileImage = profileImage;

    localStorage.setItem("user", JSON.stringify(loginUser));

    document.querySelectorAll(".profile-name").forEach(el => {
        el.innerText = loginUser.fullName;
    });

    document.querySelectorAll("#topProfileImage").forEach(img => {
        img.src = profileImage;
    });

}

    } catch (error) {

        console.error(error);

        alert("Profile Update Failed");

    }

});

// IMAGE

changePhotoBtn.addEventListener("click", () => {

    imageInput.click();

});

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        profileImage = e.target.result;

        document.getElementById("profileImage").src = profileImage;

        document.getElementById("topProfileImage").src = profileImage;

    };

    reader.readAsDataURL(file);

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
