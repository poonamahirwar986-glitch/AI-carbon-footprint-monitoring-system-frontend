const BASE_URL = "https://carbon-backend-2.onrender.com/user";

// SIGNUP 

async function signup() {

    console.log("Signup function called");

    document.getElementById("nameError").innerText = "";
    document.getElementById("emailError").innerText = "";
    document.getElementById("passwordError").innerText = "";

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!name || !email || !password) {
        alert("Please fill all fields ❌");
        return;
    }

    const userData = {
        fullName: name,
        email: email,
        password: password
    };

    try {

        const response = await fetch(`${BASE_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        console.log("HTTP Status:", response.status);
        console.log("Response:", response);

      const data = await response.json();

console.log("Signup Response:", data);

// Agar validation fail hui
if (!response.ok) {

    if (data.fullName)
        document.getElementById("nameError").innerText = data.fullName;

    if (data.email)
        document.getElementById("emailError").innerText = data.email;

    if (data.password)
        document.getElementById("passwordError").innerText = data.password;

    return;
}

// if sign upsuccessful

alert(data.message);

        if (response.ok && data.id != null) {

            signupForm.classList.remove("active");
            loginForm.classList.add("active");

            document.getElementById("signupName").value = "";
            document.getElementById("signupEmail").value = "";
            document.getElementById("signupPassword").value = "";

        }

    } catch (error) {

    console.error("FULL SIGNUP ERROR:", error);

    alert(error.message);

}

}


//  LOGIN 

async function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please enter Email and Password ❌");
        return;
    }

    const loginData = {
        email: email,
        password: password
    };

    try {

        const response = await fetch(`${BASE_URL}/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(loginData)

        });

        console.log("Login Status:", response.status);

        const data = await response.json();

        console.log("Login Response:", data);

        alert(data.message);

       if (response.ok && data.id != null) {

    // Save JWT Token
    localStorage.setItem("token", data.token);

    // Save user data
    localStorage.setItem("user", JSON.stringify(data));

    localStorage.setItem("loggedIn", "true");
    

    console.log("JWT Token:", localStorage.getItem("token"));

const historyResponse = await fetch(
    `https://carbon-backend-2.onrender.com/carbon/history/${data.id}`,
    {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + data.token
        }
    }
);

const history = await historyResponse.json();

if(history.length === 0){

    // New User
    window.location.href = "carbonCalculate.html";

}
else{

    // Existing User
    window.location.href = "Carbondashboard.html";

}

}

    } catch (error) {

    console.error("FULL SIGNUP ERROR:", error);

    alert(error.message);

}

}

// FORM SWITCH 

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

document.getElementById("showSignup").addEventListener("click", () => {

    loginForm.classList.remove("active");
    signupForm.classList.add("active");

});

document.getElementById("showLogin").addEventListener("click", () => {

    signupForm.classList.remove("active");
    loginForm.classList.add("active");

});
