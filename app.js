const apiUrl = "http://localhost:5000/api"; // Change this when hosting online

// Store a default admin user if not already present
if (!localStorage.getItem("users")) {
    const demoUsers = [
        { username: "admin", password: "admin123" } // Default login credentials
    ];
    localStorage.setItem("users", JSON.stringify(demoUsers));
}

// Handle Login
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            const users = JSON.parse(localStorage.getItem("users")) || [];

            console.log("Stored Users:", users); // Debugging Line

            const user = users.find(u => 
                u.username.toLowerCase() === username.toLowerCase() && 
                u.password === password
            );

            if (user) {
                console.log("Login Success! Redirecting...");
                localStorage.setItem("loggedInUser", username);
                window.location.href = "index.html"; // Redirect to Dashboard
            } else {
                alert("Invalid username or password!");
                console.log("Login Failed");
            }
        });
    }

    // If already logged in, redirect to the dashboard
    if (localStorage.getItem("loggedInUser") && window.location.pathname.includes("login.html")) {
        window.location.href = "index.html";
    }
});

// Logout Function
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

// Initialize demo cases if not present
if (!localStorage.getItem("cases")) {
    const demoCases = [
        { id: 1, customer_name: "John Doe", issue_description: "Internet not working", status: "Open" },
        { id: 2, customer_name: "Jane Smith", issue_description: "Billing issue", status: "In Progress" },
        { id: 3, customer_name: "Mike Johnson", issue_description: "Router replacement", status: "Closed" }
    ];
    localStorage.setItem("cases", JSON.stringify(demoCases));
}

// Fetch cases from Local Storage
function fetchCases() {
    const cases = JSON.parse(localStorage.getItem("cases")) || [];
    
    let rows = "";
    cases.forEach((c) => {
        rows += `<tr ondblclick="openEditModal(${c.id}, '${c.customer_name}', '${c.issue_description}', '${c.status}')">
            <td>${c.id}</td>
            <td>${c.customer_name}</td>
            <td>${c.issue_description}</td>
            <td>${c.status}</td>
        </tr>`;
    });

    document.getElementById("cases-list").innerHTML = rows;
}

// Open Edit Case Modal with pre-filled details
function openEditModal(id, name, issue, status) {
    document.getElementById("case-id").value = id;
    document.getElementById("customer-name").value = name;
    document.getElementById("issue-description").value = issue;
    document.getElementById("status").value = status;

    document.getElementById("edit-modal").style.display = "flex";
}

// Close Modal
function closeModal() {
    document.getElementById("edit-modal").style.display = "none";
}

// Handle Case Update (Update Local Storage)
document.getElementById("edit-case-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const id = parseInt(document.getElementById("case-id").value);
    const updatedData = {
        id,
        customer_name: document.getElementById("customer-name").value,
        issue_description: document.getElementById("issue-description").value,
        status: document.getElementById("status").value
    };

    let cases = JSON.parse(localStorage.getItem("cases")) || [];
    cases = cases.map(c => (c.id === id ? updatedData : c));
    localStorage.setItem("cases", JSON.stringify(cases));

    closeModal();
    fetchCases();
});

// Search Cases
function searchCases() {
    const filter = document.getElementById("search-bar").value.toLowerCase();
    const rows = document.querySelectorAll("#cases-list tr");

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
}

// Export All Cases to Excel
function exportToExcel() {
    const cases = JSON.parse(localStorage.getItem("cases")) || [];

    if (cases.length === 0) {
        alert("No cases to export!");
        return;
    }

    const wsData = [["Case ID", "Customer Name", "Issue Description", "Status"]];
    cases.forEach(c => {
        wsData.push([c.id, c.customer_name, c.issue_description, c.status]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cases");

    XLSX.writeFile(wb, "Customer_Cases.xlsx");
}

// Load cases in Reports Page
function loadCasesForReport() {
    const cases = JSON.parse(localStorage.getItem("cases")) || [];
    let rows = "";

    cases.forEach((c) => {
        rows += `<tr>
            <td><input type="checkbox" class="case-checkbox" value="${c.id}"></td>
            <td>${c.id}</td>
            <td>${c.customer_name}</td>
            <td>${c.issue_description}</td>
            <td>${c.status}</td>
        </tr>`;
    });

    document.getElementById("cases-list").innerHTML = rows;
}

// Export Selected Cases to Excel
function exportSelectedToExcel() {
    const cases = JSON.parse(localStorage.getItem("cases")) || [];
    const selectedIds = Array.from(document.querySelectorAll(".case-checkbox:checked"))
                            .map(cb => parseInt(cb.value));

    const selectedCases = cases.filter(c => selectedIds.includes(c.id));

    if (selectedCases.length === 0) {
        alert("No cases selected!");
        return;
    }

    const wsData = [["Case ID", "Customer Name", "Issue Description", "Status"]];
    selectedCases.forEach(c => {
        wsData.push([c.id, c.customer_name, c.issue_description, c.status]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Selected Cases");

    XLSX.writeFile(wb, "Selected_Customer_Cases.xlsx");
}

// Load cases when reports.html is opened
if (window.location.pathname.includes("reports.html")) {
    document.addEventListener("DOMContentLoaded", loadCasesForReport);
}

// Load cases on page load
document.addEventListener("DOMContentLoaded", fetchCases);
// Open Edit Case Modal with pre-filled details
function openEditModal(id, name, issue, status) {
    document.getElementById("customer-name").value = name;
    document.getElementById("issue-description").value = issue;
    document.getElementById("status").value = status;

    document.getElementById("edit-modal").style.display = "flex";
}

// Close Modal
function closeModal() {
    document.getElementById("edit-modal").style.display = "none";
}
// Open Add New Case Modal
function openAddCaseForm() {
    document.getElementById("add-case-modal").style.display = "flex";
}

// Close Add Case Modal
function closeAddCaseModal() {
    document.getElementById("add-case-modal").style.display = "none";
}

// Handle Case Addition
document.getElementById("add-case-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const newCustomerName = document.getElementById("new-customer-name").value;
    const newIssueDescription = document.getElementById("new-issue-description").value;
    const newStatus = document.getElementById("new-status").value;

    // Generate a new case ID
    const newCase = {
        id: Date.now(),  // Unique ID based on timestamp
        customer_name: newCustomerName,
        issue_description: newIssueDescription,
        status: newStatus
    };

    // Fetch the existing cases and add the new case
    const cases = JSON.parse(localStorage.getItem("cases")) || [];
    cases.push(newCase);

    // Update Local Storage
    localStorage.setItem("cases", JSON.stringify(cases));

    // Close the modal and refresh the case list
    closeAddCaseModal();
    fetchCases();
});
// Fetch cases from Local Storage
function fetchCases() {
    const cases = JSON.parse(localStorage.getItem("cases")) || [];
    
    let rows = "";
    cases.forEach((c) => {
        rows += `<tr ondblclick="openEditModal(${c.id}, '${c.customer_name}', '${c.issue_description}', '${c.status}')">
            <td>${c.id}</td>
            <td>${c.customer_name}</td>
            <td>${c.issue_description}</td>
            <td>${c.status}</td>
        </tr>`;
    });

    document.getElementById("cases-list").innerHTML = rows;
}
// Global variables for pagination
let currentReportPage = 1;
const casesPerPageReport = 10;

// Load cases in Reports Page
function loadCasesForReport() {
    const cases = JSON.parse(localStorage.getItem("cases")) || [];
    const totalPages = Math.ceil(cases.length / casesPerPageReport);

    // Calculate the start and end index for the current page
    const startIndex = (currentReportPage - 1) * casesPerPageReport;
    const endIndex = startIndex + casesPerPageReport;

    // Slice the cases array to get only the cases for the current page
    const casesToShow = cases.slice(startIndex, endIndex);

    let rows = "";
    casesToShow.forEach((c) => {
        rows += `<tr>
            <td><input type="checkbox" class="case-checkbox" value="${c.id}"></td>
            <td>${c.id}</td>
            <td>${c.customer_name}</td>
            <td>${c.issue_description}</td>
            <td>${c.status}</td>
        </tr>`;
    });

    document.getElementById("cases-list").innerHTML = rows;
    updatePaginationControlsForReport(totalPages);
}

// Update the pagination buttons (Previous and Next)
function updatePaginationControlsForReport(totalPages) {
    const paginationContainer = document.getElementById("pagination");

    // Clear existing pagination buttons
    paginationContainer.innerHTML = "";

    // Add Previous button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.disabled = currentReportPage === 1;
    prevButton.addEventListener("click", () => changeReportPage(currentReportPage - 1));
    paginationContainer.appendChild(prevButton);

    // Add Next button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentReportPage === totalPages;
    nextButton.addEventListener("click", () => changeReportPage(currentReportPage + 1));
    paginationContainer.appendChild(nextButton);
}

// Change page function for reports
function changeReportPage(page) {
    currentReportPage = page;
    loadCasesForReport();
}

// Export Selected Cases to Excel
function exportSelectedToExcel() {
    const cases = JSON.parse(localStorage.getItem("cases")) || [];
    const selectedIds = Array.from(document.querySelectorAll(".case-checkbox:checked"))
                            .map(cb => parseInt(cb.value));

    const selectedCases = cases.filter(c => selectedIds.includes(c.id));

    if (selectedCases.length === 0) {
        alert("No cases selected!");
        return;
    }

    const wsData = [["Case ID", "Customer Name", "Issue Description", "Status"]];
    selectedCases.forEach(c => {
        wsData.push([c.id, c.customer_name, c.issue_description, c.status]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Selected Cases");

    XLSX.writeFile(wb, "Selected_Customer_Cases.xlsx");
}
