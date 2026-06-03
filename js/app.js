// Configuration
const JOB_API = 'https://api.arbeitnow.com/api/job-board-api';
let allJobs = [];
let filteredJobs = [];

// Tab Navigation
const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');

navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        
        // Remove active class from all tabs and contents
        navTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Fetch jobs from API
async function fetchJobs() {
    const jobsGrid = document.querySelector('.jobs-grid');
    
    try {
        jobsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6b7280;">Loading jobs...</div>';
        
        const response = await fetch(JOB_API);
        if (!response.ok) throw new Error('Failed to fetch jobs');
        
        allJobs = await response.json();
        filteredJobs = [...allJobs];
        
        renderJobs(filteredJobs.slice(0, 12)); // Show first 12 jobs
        attachJobCardListeners();
        
        console.log(`Loaded ${allJobs.length} jobs from Arbeitnow API`);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        jobsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444;">⚠️ Error loading jobs. Please try again later.</div>';
    }
}

// Render jobs to DOM
function renderJobs(jobs) {
    const jobsGrid = document.querySelector('.jobs-grid');
    
    if (jobs.length === 0) {
        jobsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6b7280;">No jobs found matching your filters.</div>';
        return;
    }
    
    jobsGrid.innerHTML = jobs.map(job => createJobCard(job)).join('');
}

// Create job card HTML
function createJobCard(job) {
    const salary = job.salary || 'Not specified';
    const jobType = job.employment_type || 'Full Time';
    const location = job.location || 'Remote';
    const company = job.company_name || 'Unknown Company';
    const title = job.title || 'Job Title';
    const description = job.description ? job.description.substring(0, 150) + '...' : 'No description available';
    const jobId = job.id || Math.random();
    const isSaved = localStorage.getItem(`saved_${jobId}`) === 'true';
    
    const badgeClass = jobType.toLowerCase().includes('remote') ? 'badge-remote' : 
                       jobType.toLowerCase().includes('part') ? 'badge-hybrid' :
                       jobType.toLowerCase().includes('contract') ? 'badge-contract' : 'badge-full-time';
    
    return `
        <div class="job-card" data-job-id="${jobId}">
            <div class="job-header">
                <div class="job-title-section">
                    <h3 class="job-title">${title}</h3>
                    <p class="company-name">${company}</p>
                </div>
                <button class="btn-save ${isSaved ? 'saved' : ''}" data-job-id="${jobId}">${isSaved ? '❤️' : '♡'}</button>
            </div>
            <div class="job-meta">
                <span class="badge ${badgeClass}">${jobType}</span>
            </div>
            <div class="job-details">
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Salary:</strong> ${salary}</p>
            </div>
            <p class="job-description">${description}</p>
            <div class="job-footer">
                <button class="btn-primary view-details" data-job-id="${jobId}">View Details</button>
                <a href="${job.url}" target="_blank" class="btn-secondary" style="text-decoration: none; display: flex; align-items: center; justify-content: center;">Apply Now</a>
            </div>
        </div>
    `;
}

// Attach event listeners to job cards
function attachJobCardListeners() {
    // Save/Unsave Jobs
    document.querySelectorAll('.btn-save').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const jobId = button.getAttribute('data-job-id');
            const isSaved = button.classList.contains('saved');
            
            button.classList.toggle('saved');
            button.textContent = isSaved ? '♡' : '❤️';
            
            if (isSaved) {
                localStorage.removeItem(`saved_${jobId}`);
            } else {
                localStorage.setItem(`saved_${jobId}`, 'true');
            }
        });
    });
    
    // View Details
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', () => {
            const jobId = button.getAttribute('data-job-id');
            const job = allJobs.find(j => j.id === jobId);
            if (job) showJobModal(job);
        });
    });
}

// Show job details modal
function showJobModal(job) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">✕</button>
            <h2>${job.title}</h2>
            <p class="modal-company">${job.company_name}</p>
            <div class="modal-meta">
                <span>📍 ${job.location}</span>
                <span>💰 ${job.salary || 'Not specified'}</span>
                <span>📋 ${job.employment_type}</span>
            </div>
            <div class="modal-body">
                ${job.description || 'No description available'}
            </div>
            <a href="${job.url}" target="_blank" class="btn-primary" style="display: block; text-align: center; text-decoration: none; margin-top: 20px;">Apply on ${new URL(job.url).hostname}</a>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Search functionality
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

function performSearch() {
    const query = searchInput.value.toLowerCase();
    if (query.length === 0) {
        filteredJobs = [...allJobs];
    } else {
        filteredJobs = allJobs.filter(job => 
            job.title.toLowerCase().includes(query) ||
            job.company_name.toLowerCase().includes(query) ||
            job.location.toLowerCase().includes(query)
        );
    }
    renderJobs(filteredJobs.slice(0, 12));
    attachJobCardListeners();
}

// Filter functionality
const filterSelects = document.querySelectorAll('.filter-select');

filterSelects.forEach(select => {
    select.addEventListener('change', applyFilters);
});

function applyFilters() {
    const jobTypeSelect = document.querySelector('.filter-select');
    const salarySelect = document.querySelectorAll('.filter-select')[1];
    
    const jobType = jobTypeSelect.value;
    const salaryRange = salarySelect.value;
    
    filteredJobs = allJobs.filter(job => {
        let typeMatch = true;
        let salaryMatch = true;
        
        if (jobType !== 'all') {
            typeMatch = job.employment_type.toLowerCase().includes(jobType.toLowerCase());
        }
        
        // Note: Arbeitnow doesn't provide structured salary data, so salary filtering is limited
        if (salaryRange !== 'all' && job.salary) {
            salaryMatch = job.salary.toLowerCase().includes(salaryRange);
        }
        
        return typeMatch && salaryMatch;
    });
    
    renderJobs(filteredJobs.slice(0, 12));
    attachJobCardListeners();
}

console.log('PerformativeApply app loaded!');
fetchJobs();
