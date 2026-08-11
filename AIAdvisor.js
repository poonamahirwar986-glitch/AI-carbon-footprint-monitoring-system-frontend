const BASE_URL = "https://carbon-backend-2.onrender.com";

//  GET USER ID 

function getUserId() {

    let userId = localStorage.getItem("userId");

    if (userId) {
        return userId;
    }
    userId = localStorage.getItem("id");

    if (userId) {
        return userId;
    }


    const user = localStorage.getItem("user");

    if (user) {

        try {

            const userData = JSON.parse(user);

            if (userData.id) {
                return userData.id;
            }

        } catch (error) {

            console.log("User data parse error");

        }
    }
    return null;
}
//  LOAD AI INSIGHT

async function loadAIAdvice() {


  const chatBox = document.getElementById("chatBox");

    const userId = getUserId();


    if(!userId){
        addAIMessageText("User not logged in.");
        return;
    }


    try {

        const response = await fetch(
            `${BASE_URL}/ai/chat`,
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    userId:Number(userId),

                    message:"Analyze my carbon footprint"

                })
            }
        );


        const data = await response.json(); 

       console.log("AI DATA :",data);  

        updateCards(data);

        if(document.getElementById("chatBox").innerHTML.trim() === ""){

               addAIInsightMessage(data);
            
        }
            
    }
    catch(error){


    }

}

  
//  UPDATE CARDS 

function updateCards(data){


    document.getElementById("carbonScore").innerText =
        data.carbonScore + " / 100";

    document.getElementById("status").innerText =
        data.status;


    document.getElementById("source").innerText =
        data.highestSource;


    document.getElementById("saving").innerText =
        data.savingPotential;

}


// SEND CHAT


async function sendMessage(){

    const input =
    document.getElementById("userMessage");


    const message =
    input.value.trim();



    if(message === ""){
        return;
    }

    addUserMessage(message);


    input.value = "";

    const userId = getUserId();



    if(!userId){

        addAIMessageText(
            "User not logged in."
        );

        return;

    }

    try{


        const response = await fetch(

            `${BASE_URL}/ai/chat`,

            {
              method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    userId:Number(userId),

                    message:message

                })

            }

        );

        const data = await response.json();

           console.log("AI Reply:", data);

          addAIReply(data.reply);
      
     }

    catch(error){


        console.log(error);

        addAIMessageText(
            "Something went wrong."
        );

    }
}


//  AI MESSAGE FORMAT


function addAIInsightMessage(data){

    const chatBox =
    document.getElementById("chatBox");
    chatBox.innerHTML +=
    `
    <div class="ai-message">

        <h4>
        🤖 Carbon AI Advisor
        </h4>

        <p>
        👋 Welcome back!
        </p>

        <p>
        I analyzed your latest carbon footprint.
        </p>
        <div class="ai-details">
            <p>
            🌱 <b>Carbon Score</b><br>
            ${data.carbonScore}/100
            </p>

            <p>
            📊 <b>Highest Source</b><br>
            ${data.highestSource}
            </p>

            <p>
            💚 <b>Saving Potential</b><br>
            ${data.savingPotential}
            </p>
        </div>

        <div class="recommendation">
            <b>💡 Recommendation</b>
            <p>
            ${data.reply}
            </p>
        </div>
        <p>
        How can I help you today? 😊
        </p>
    </div>

    `;
}


//  USER MESSAGE 


function addUserMessage(message){

    const chatBox =
    document.getElementById("chatBox");
    chatBox.innerHTML +=
    `
    <div class="user-message">

        ${message}

    </div>

    `;
   
    chatBox.scrollTop =
    chatBox.scrollHeight; 
    

}

//  SIMPLE ERROR MESSAGE 

function addAIMessageText(message){


    const chatBox =
    document.getElementById("chatBox");


    chatBox.innerHTML +=
    `

    <div class="ai-message">

        🤖 ${message}

    </div>

    `;

}

// BUTTON 

document
.getElementById("sendBtn")
.addEventListener(
    "click",
    sendMessage
);

//  ENTER KEY

document
.getElementById("userMessage")
.addEventListener(
    "keypress",
    function(event){
        if(event.key === "Enter"){
            sendMessage();
        }

    }
)

//  PAGE LOAD


window.onload = async function(){

    
       await loadChatHistory();
             loadUserProfile();
      await loadAIAdvice();
    
}

function addAIReply(reply){

    const chatBox = document.getElementById("chatBox");

    chatBox.innerHTML += `
        <div class="ai-message">
            🤖 ${reply}
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;
}

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

document.querySelectorAll(".quick-btn")
.forEach(btn=>{

btn.addEventListener("click",()=>{

document.getElementById("userMessage").value =
btn.innerText;

sendMessage();

});

})

 // LOAD Chat History

async function loadChatHistory(){

    const userId = getUserId();

    if(!userId) return;

    try{

        const response = await fetch(
            `${BASE_URL}/ai/history/${userId}`
        );

        const chats = await response.json();

        const chatBox =
        document.getElementById("chatBox");

        chatBox.innerHTML = "";

        chats.forEach(chat=>{

            chatBox.innerHTML += `
                <div class="user-message">
                    ${chat.message}
                </div>

                <div class="ai-message">
                    🤖 ${chat.reply}
                </div>
            `;

        });

        chatBox.scrollTop =
        chatBox.scrollHeight;

    }
    catch(error){

        console.log(error);

    }

}


