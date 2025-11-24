// Global variables
let beneficiaries = [];
let hasUnsavedChanges = false;

// DOM Elements
const tabTriggers = document.querySelectorAll('.tab-trigger');
const tabPanes = document.querySelectorAll('.tab-pane');
const beneficiaryForm = document.getElementById('beneficiaryForm');
const addNewBeneficiaryBtn = document.getElementById('addNewBeneficiaryBtn');
const backToBeneficiariesBtn = document.getElementById('backToBeneficiariesBtn');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupNavigationButtons();
    loadBeneficiaries();
    setupForms();
    // Show beneficiaries by default
    switchTab('list');
});

// Setup navigation buttons
function setupNavigationButtons() {
    // Add New Beneficiary button
    if (addNewBeneficiaryBtn) {
        addNewBeneficiaryBtn.addEventListener('click', function() {
            switchTab('add');
        });
    }
    
    // Back to Beneficiaries button
    if (backToBeneficiariesBtn) {
        backToBeneficiariesBtn.addEventListener('click', function() {
            if (hasUnsavedChanges) {
                if (confirm('Warning: All unsaved changes will be lost. Are you sure you want to continue?')) {
                    hasUnsavedChanges = false;
                    switchTab('list');
                }
            } else {
                switchTab('list');
            }
        });
    }
}

function switchTab(tabId) {
    // Update active pane
    tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === tabId) {
            pane.classList.add('active');
        }
    });

    // Load data based on active tab
    switch(tabId) {
        case 'list':
            displayBeneficiaries();
            break;
        case 'add':
            // Clear the form when switching to add tab
            beneficiaryForm.reset();
            hasUnsavedChanges = false;
            break;
    }
}

// Form setup
function setupForms() {
    // Beneficiary form
    beneficiaryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addBeneficiary();
    });

    // Track form changes
    beneficiaryForm.addEventListener('input', function() {
        hasUnsavedChanges = true;
    });

    beneficiaryForm.addEventListener('change', function() {
        hasUnsavedChanges = true;
    });
}

// API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    showLoading();
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(endpoint, options);
        const result = await response.json();
        
        hideLoading();
        return result;
    } catch (error) {
        hideLoading();
        showError('Network error occurred');
        console.error('API Error:', error);
        throw error;
    }
}

// Loading overlay
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Beneficiary functions
async function loadBeneficiaries() {
    try {
        beneficiaries = await apiCall('/api/beneficiaries');
        if (document.querySelector('.tab-pane.active').id === 'list') {
            displayBeneficiaries();
        }
    } catch (error) {
        console.error('Error loading beneficiaries:', error);
    }
}

async function addBeneficiary() {
    const formData = new FormData(beneficiaryForm);
    
    // Get selected skills
    const selectedSkills = [];
    const skillCheckboxes = beneficiaryForm.querySelectorAll('input[name="skills"]:checked');
    skillCheckboxes.forEach(checkbox => {
        selectedSkills.push(checkbox.value);
    });

    if (selectedSkills.length === 0) {
        showError('Please select at least one skill');
        return;
    }

    const beneficiaryData = {
        fullName: formData.get('fullName'),
        phoneNumber: formData.get('phoneNumber'),
        email: formData.get('email') || '',
        address: formData.get('address') || '',
        dateOfBirth: formData.get('dateOfBirth') || '',
        gender: formData.get('gender') || '',
        education: formData.get('education') || '',
        skills: selectedSkills,
        experience: formData.get('experience') || ''
    };

    try {
        const newBeneficiary = await apiCall('/api/beneficiaries', 'POST', beneficiaryData);
        beneficiaries.push(newBeneficiary);
        beneficiaryForm.reset();
        hasUnsavedChanges = false;
        showSuccess('Beneficiary added successfully!');
        // Switch back to beneficiaries list
        setTimeout(() => {
            switchTab('list');
        }, 1500);
    } catch (error) {
        showError('Error adding beneficiary');
    }
}

function displayBeneficiaries() {
    const tableContainer = document.getElementById('beneficiariesTable');
    
    if (beneficiaries.length === 0) {
        tableContainer.innerHTML = '<p class="text-center">No beneficiaries found</p>';
        return;
    }

    let tableHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Skills</th>
                    <th>Experience</th>
                </tr>
            </thead>
            <tbody>
    `;

    beneficiaries.forEach(beneficiary => {
        tableHTML += `
            <tr>
                <td>${beneficiary.fullName}</td>
                <td>${beneficiary.phoneNumber}</td>
                <td>${beneficiary.email || 'N/A'}</td>
                <td>
                    ${beneficiary.skills.map(skill => 
                        `<span class="skills-badge">${skill}</span>`
                    ).join('')}
                </td>
                <td>${beneficiary.experience || 'N/A'}</td>
            </tr>
        `;
    });

    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

// Utility functions
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i data-lucide="check-circle"></i>
        ${message}
    `;
    
    const activePane = document.querySelector('.tab-pane.active');
    const cardContent = activePane.querySelector('.card-content');
    cardContent.insertBefore(successDiv, cardContent.firstChild);
    
    // Re-initialize Lucide icons
    lucide.createIcons();
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i data-lucide="x-circle"></i>
        ${message}
    `;
    
    const activePane = document.querySelector('.tab-pane.active');
    const cardContent = activePane.querySelector('.card-content');
    cardContent.insertBefore(errorDiv, cardContent.firstChild);
    
    // Re-initialize Lucide icons
    lucide.createIcons();
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showWelcome() {
    alert('Welcome to the NGO Beneficiary Management System!\\n\\nThis system helps manage beneficiaries and service providers, and matches their skills for better employment opportunities.');
}

// Export functions for global access
window.generateMatches = generateMatches;
window.showWelcome = showWelcome;
