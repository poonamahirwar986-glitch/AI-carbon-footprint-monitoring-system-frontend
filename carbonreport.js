
const BASE_URL = "https://carbon-backend-2.onrender.com/carbon";

const loginUser = JSON.parse(localStorage.getItem("user"));

if (!loginUser) {
    alert("Please Login First");
    window.location.href = "carbonsignup.html";
}

let reportData = {};

//  AUTH HEADER 

function getAuthHeaders() {

    const token = localStorage.getItem("token");

    return {

        "Authorization": "Bearer " + token

    };

}

//  LOAD DASHBOARD 

async function loadDashboardData() {

    try {

        const response = await fetch(

            `${BASE_URL}/dashboard/${loginUser.id}`,

            {

                method: "GET",

                headers: getAuthHeaders()

            }

        );

        if (!response.ok) {

            throw new Error("Dashboard Load Failed");

        }

        const data = await response.json();

        reportData.totalEmission = data.totalEmission;
        reportData.totalEntries = data.totalEntries;
        reportData.averageEmission = data.averageEmission;
        reportData.treesRequired = data.treesRequired;

        updatePreview();

    }

    catch (error) {

        console.log(error);

    }

}

// UPDATE PREVIEW 

function updatePreview() {

    document.getElementById("previewEmission").innerText =
        reportData.totalEmission.toFixed(1) + " kg";

    document.getElementById("previewEntries").innerText =
        reportData.totalEntries;

    document.getElementById("previewTrees").innerText =
        reportData.treesRequired;

}

//  PROFILE

document.querySelectorAll(".profile-name").forEach(el => {

    el.innerText = loginUser.fullName;

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

//  LOAD REPORTS 

function loadReports() {

    const tbody =
        document.getElementById("recentReportsBody");

    const reports =
        JSON.parse(
            localStorage.getItem(
                `reports_${loginUser.id}`
            )
        ) || [];

    tbody.innerHTML = "";

    if (reports.length === 0) {

        tbody.innerHTML = `

        <tr>

            <td colspan="4">

                No Reports Available

            </td>

        </tr>

        `;

        return;

    }

    reports.forEach((report, index) => {

        tbody.innerHTML += `

        <tr>

            <td>${report.reportType}</td>

            <td>${report.generatedDate}</td>

            <td>${report.totalEmission.toFixed(1)} kg</td>

            <td>

                <span class="material-symbols-outlined download-icon"

                onclick="downloadReport(${index})">

                download

                </span>

            </td>

        </tr>

        `;

    });

}

// ================= SAVE REPORT =================

function saveRecentReport(report) {

    let reports = JSON.parse(

        localStorage.getItem(

            `reports_${loginUser.id}`

        )

    ) || [];

    reports.unshift(report);

    if (reports.length > 10) {

        reports.pop();

    }

    localStorage.setItem(

        `reports_${loginUser.id}`,

        JSON.stringify(reports)

    );

}

// ================= PDF =================

function generatePDF(report){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Carbon Footprint Report",20,20);

    doc.setFontSize(12);

    doc.text("Name : " + loginUser.fullName,20,40);
    doc.text("Email : " + loginUser.email,20,50);

    doc.text("Report Type : " + report.reportType,20,70);
    doc.text("Generated : " + report.generatedDate,20,80);

    doc.text("Total Emission : " + report.totalEmission.toFixed(1) + " kg",20,100);

    doc.text("Total Entries : " + report.totalEntries,20,110);

    doc.text("Average Emission : " + report.averageEmission.toFixed(1) + " kg",20,120);

    doc.text("Trees Required : " + report.treesRequired,20,130);

    doc.save("Carbon_Report.pdf");

}

// ================= DOWNLOAD =================

function downloadReport(index){

    const reports = JSON.parse(
        localStorage.getItem(`reports_${loginUser.id}`)
    ) || [];

    generatePDF(reports[index]);

}

// ================= GENERATE REPORT =================

const reportForm = document.getElementById("reportForm");

reportForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const reportType =
        document.getElementById("reportType").value;

    try{

        const response = await fetch(

            `${BASE_URL}/report/${loginUser.id}?reportType=${reportType}`,

            {

                method:"GET",

                headers:getAuthHeaders()

            }

        );

        if(!response.ok){

            throw new Error("Unable to generate report");

        }

        reportData = await response.json();

        generatePDF(reportData);

        saveRecentReport(reportData);

        loadReports();

        document.getElementById("reportStatus").innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            ${reportType} Generated Successfully
        `;

    }

    catch(error){

        console.log(error);

        alert("Unable to Generate Report");

    }

});

// ================= INITIAL LOAD =================

window.onload = async ()=>{

    await loadDashboardData();

    loadReports();

};




