// Global variables
let beneficiaries = [];
let providers = [];
let matches = [];

// DOM Elements
const tabTriggers = document.querySelectorAll('.tab-trigger');
const tabPanes = document.querySelectorAll('.tab-pane');
const beneficiaryForm = document.getElementById('beneficiaryForm');
const providerForm = document.getElementById('providerForm');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadBeneficiaries();
    loadProviders();
    setupForms();
});

// Tab functionality
function initializeTabs() {
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            switchTab(targetTab);
        });
    });
}

function switchTab(tabId) {
    // Update active trigger
    tabTriggers.forEach(trigger => {
        trigger.classList.remove('active');
        if (trigger.dataset.tab === tabId) {
            trigger.classList.add('active');
        }
    });

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
        case 'providers':
            displayProviders();
            break;
        case 'matching':
            // Don't auto-load matches, let user click the button
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

    // Provider form
    providerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addProvider();
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
        showSuccess('Beneficiary added successfully!');
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

// Provider functions
async function loadProviders() {
    try {
        providers = await apiCall('/api/providers');
        if (document.querySelector('.tab-pane.active').id === 'providers') {
            displayProviders();
        }
    } catch (error) {
        console.error('Error loading providers:', error);
    }
}

async function addProvider() {
    const formData = new FormData(providerForm);
    
    // Get selected services
    const selectedServices = [];
    const serviceCheckboxes = providerForm.querySelectorAll('input[name="services"]:checked');
    serviceCheckboxes.forEach(checkbox => {
        selectedServices.push(checkbox.value);
    });

    if (selectedServices.length === 0) {
        showError('Please select at least one service');
        return;
    }

    const providerData = {
        name: formData.get('name'),
        contactPerson: formData.get('contactPerson'),
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        location: formData.get('location') || '',
        services: selectedServices
    };

    try {
        const newProvider = await apiCall('/api/providers', 'POST', providerData);
        providers.push(newProvider);
        providerForm.reset();
        showSuccess('Provider added successfully!');
        displayProviders();
    } catch (error) {
        showError('Error adding provider');
    }
}

function displayProviders() {
    const tableContainer = document.getElementById('providersTable');
    
    if (providers.length === 0) {
        tableContainer.innerHTML = '<p class="text-center">No providers found</p>';
        return;
    }

    let tableHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Company</th>
                    <th>Contact Person</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Services</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
    `;

    providers.forEach(provider => {
        tableHTML += `
            <tr>
                <td>${provider.name}</td>
                <td>${provider.contactPerson}</td>
                <td>${provider.email || 'N/A'}</td>
                <td>${provider.phone || 'N/A'}</td>
                <td>
                    ${provider.services.map(service => 
                        `<span class="skills-badge">${service}</span>`
                    ).join('')}
                </td>
                <td>${provider.location || 'N/A'}</td>
            </tr>
        `;
    });

    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

// Skill matching functions
async function generateMatches() {
    try {
        matches = await apiCall('/api/skill-matching');
        displayMatches();
    } catch (error) {
        showError('Error generating matches');
    }
}

function displayMatches() {
    const matchingContainer = document.getElementById('matchingResults');
    
    if (matches.length === 0) {
        matchingContainer.innerHTML = `
            <div class="match-card">
                <h4>No matches found</h4>
                <p>Add more beneficiaries and providers to see skill matches</p>
            </div>
        `;
        return;
    }

    let matchHTML = '';
    matches.forEach(match => {
        matchHTML += `
            <div class="match-card">
                <h4>${match.beneficiary}</h4>
                <p><strong>Skill:</strong> ${match.skill}</p>
                <p><strong>Matching Providers:</strong></p>
                <div class="provider-list">
                    ${match.providers.map(provider => 
                        `<span class="provider-tag">${provider}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    });

    matchingContainer.innerHTML = matchHTML;
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
