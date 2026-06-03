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

// Save/Unsave Jobs
const saveButtons = document.querySelectorAll('.btn-save');

saveButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('saved');
        
        if (button.classList.contains('saved')) {
            button.textContent = '❤️';
        } else {
            button.textContent = '♡';
        }
    });
});

// Search functionality (placeholder)
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value;
        if (query) {
            console.log('Searching for:', query);
            // Add search logic here
        }
    });
}

// Filter functionality (placeholder)
const filterSelects = document.querySelectorAll('.filter-select');

filterSelects.forEach(select => {
    select.addEventListener('change', (e) => {
        console.log('Filter changed:', e.target.value);
        // Add filter logic here
    });
});

// Apply Now button functionality
const applyButtons = document.querySelectorAll('.btn-secondary');

applyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (button.textContent.toLowerCase().includes('apply')) {
            alert('Application submitted! Good luck! 🎉');
            // Add actual application logic here
        }
    });
});

// View Details button functionality
const detailButtons = document.querySelectorAll('.btn-primary');

detailButtons.forEach(button => {
    if (button.textContent.toLowerCase().includes('details')) {
        button.addEventListener('click', () => {
            alert('Job details modal coming soon! 📋');
            // Add modal or navigation to details page
        });
    }
});

console.log('PerformativeApply app loaded!');
