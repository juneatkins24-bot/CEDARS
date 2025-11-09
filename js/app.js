// ===== NAVIGATION SYSTEM =====
let currentSection = 'home';

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-page`);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
    }

    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === sectionName) {
            btn.classList.add('active');
        }
    });

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Initialize map if discover section
    if (sectionName === 'discover') {
        initializeMap();
    }

    // Apply event filters if experience section
    if (sectionName === 'experience') {
        initializeEventFilters();
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// ===== STORY FORM SUBMISSION =====
document.addEventListener('DOMContentLoaded', function() {
    const storyForm = document.getElementById('story-form');
    
    if (storyForm) {
        storyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                title: document.getElementById('story-title').value,
                type: document.getElementById('story-type').value,
                content: document.getElementById('story-content').value,
                location: document.getElementById('story-location').value,
                year: document.getElementById('story-year').value,
                name: document.getElementById('story-name').value,
                public: document.getElementById('story-public').checked
            };

            // In a real app, this would send to a backend
            console.log('Story submitted:', formData);

            // Show success notification
            showNotification('🌱 Your story has been planted! Thank you for sharing.');

            // Reset form
            storyForm.reset();

            // Wait a moment, then return to stories page
            setTimeout(() => {
                showSection('stories');
            }, 2000);
        });
    }

    // Prompt card interactions
    document.querySelectorAll('.prompt-card').forEach(card => {
        card.addEventListener('click', function() {
            const promptText = this.textContent;
            const contentField = document.getElementById('story-content');
            if (contentField) {
                contentField.value = promptText + '\n\n';
                contentField.focus();
                showNotification('Prompt added! Start writing your story.');
            }
        });
    });
});

// ===== EVENT FILTERING =====
function initializeEventFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card-full');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');

            // Get filter value
            const filter = this.dataset.filter;

            // Show/hide events based on filter
            eventCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else if (card.classList.contains(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== MAP INITIALIZATION =====
let map = null;
let markersInitialized = false;

function initializeMap() {
    // Only initialize once
    if (map !== null && markersInitialized) {
        return;
    }

    const mapContainer = document.getElementById('map');
    
    if (!mapContainer) {
        return;
    }

    // Create map if it doesn't exist
    if (map === null) {
        // Center on South Dallas/Cedars area
        map = L.map('map').setView([32.7551, -96.8035], 14);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
    }

    // Add markers if not already added
    if (!markersInitialized) {
        // Landmark locations
        const landmarks = [
            {
                name: 'Longhorn Ballroom',
                lat: 32.7551,
                lng: -96.8035,
                description: 'Historic music venue',
                address: '216 Corinth St'
            },
            {
                name: 'Forest Theater',
                lat: 32.7556,
                lng: -96.8017,
                description: 'Reopening 2026',
                address: '337 S. Good Latimer Expy'
            },
            {
                name: 'Therme Dallas',
                lat: 32.7490,
                lng: -96.8069,
                description: 'Wellness resort',
                address: '3000 S. Lamar St'
            },
            {
                name: 'Fair Park',
                lat: 32.7847,
                lng: -96.7621,
                description: 'Cultural hub',
                address: '3809 Grand Ave'
            }
        ];

        // Add markers for each landmark
        landmarks.forEach(landmark => {
            const marker = L.marker([landmark.lat, landmark.lng]).addTo(map);
            marker.bindPopup(`
                <strong>${landmark.name}</strong><br>
                ${landmark.description}<br>
                <em>${landmark.address}</em>
            `);
        });

        markersInitialized = true;
    }

    // Force map to resize properly
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

// ===== LANDMARK CARD INTERACTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    const landmarkCards = document.querySelectorAll('.landmark-card');
    
    landmarkCards.forEach(card => {
        card.addEventListener('click', function() {
            const lat = parseFloat(this.dataset.lat);
            const lng = parseFloat(this.dataset.lng);
            
            if (map && lat && lng) {
                map.setView([lat, lng], 16);
                showNotification('📍 Centered on ' + this.querySelector('h4').textContent);
            }
        });
    });
});

// ===== ROUTE BUTTONS =====
document.addEventListener('DOMContentLoaded', function() {
    const routeButtons = document.querySelectorAll('.route-btn');
    
    routeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const routeName = this.closest('.route-card').querySelector('h3').textContent;
            showNotification(`🗺️ Starting ${routeName}... (Feature coming soon!)`);
        });
    });
});

// ===== EVENT BUTTONS =====
document.addEventListener('DOMContentLoaded', function() {
    const eventButtons = document.querySelectorAll('.event-btn');
    
    eventButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventName = this.closest('.event-card-full').querySelector('h3').textContent;
            showNotification(`🎫 Tickets for ${eventName}... (Feature coming soon!)`);
        });
    });
});

// ===== ORGANIZATION BUTTONS =====
document.addEventListener('DOMContentLoaded', function() {
    const orgButtons = document.querySelectorAll('.org-btn');
    
    orgButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orgName = this.closest('.org-card').querySelector('h3').textContent;
            const action = this.textContent;
            showNotification(`${action}: ${orgName}... (Feature coming soon!)`);
        });
    });
});

// ===== ACTION BUTTONS =====
document.addEventListener('DOMContentLoaded', function() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.closest('.action-card').querySelector('h4').textContent;
            showNotification(`${action}... (Feature coming soon!)`);
        });
    });
});

// ===== QUICK ACTIONS =====
function showMap() {
    showSection('discover');
}

function showEvents() {
    showSection('experience');
}

// ===== RESPONSIVE MAP RESIZING =====
window.addEventListener('resize', function() {
    if (map && currentSection === 'discover') {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }
});

// ===== SMOOTH SCROLL FOR INTERNAL LINKS =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===== ACCESSIBILITY: KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    // Allow tab navigation through nav buttons
    if (e.key === 'Enter' && document.activeElement.classList.contains('nav-btn')) {
        const section = document.activeElement.dataset.section;
        if (section) {
            showSection(section);
        }
    }
});

// ===== FORM VALIDATION HELPERS =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== SCROLL TO TOP BUTTON =====
window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
});

// ===== ANALYTICS PLACEHOLDER =====
function trackPageView(pageName) {
    // In a real app, this would send to analytics
    console.log('Page view:', pageName);
}

// ===== INITIAL SETUP =====
document.addEventListener('DOMContentLoaded', function() {
    // Ensure home page is active on load
    showSection('home');
    
    // Log welcome message
    console.log('%c🌳 CEDARS App Loaded', 'color: #2D5016; font-size: 16px; font-weight: bold;');
    console.log('Where Heritage Meets Innovation');
    
    // Track initial page view
    trackPageView('home');
});

// ===== PREVENT DEFAULT ON CERTAIN ACTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    // Prevent form submissions from refreshing page
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (!form.hasAttribute('data-allow-submit')) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
            });
        }
    });
});

// ===== DYNAMIC CONTENT LOADING (PLACEHOLDER) =====
async function loadEvents() {
    // In a real app, this would fetch from an API
    // For now, events are hardcoded in HTML
    console.log('Events loaded from static content');
}

async function loadStories() {
    // In a real app, this would fetch from an API
    // For now, stories are hardcoded in HTML
    console.log('Stories loaded from static content');
}

// ===== SHARING FUNCTIONALITY =====
function shareStory(storyTitle) {
    if (navigator.share) {
        navigator.share({
            title: storyTitle,
            text: 'Check out this story from CEDARS',
            url: window.location.href
        }).then(() => {
            showNotification('✅ Story shared!');
        }).catch((error) => {
            console.log('Error sharing:', error);
        });
    } else {
        // Fallback: copy to clipboard
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('📋 Link copied to clipboard!');
        });
    }
}

// ===== LOCAL STORAGE FOR FAVORITES (FUTURE FEATURE) =====
function saveFavorite(itemId, itemType) {
    const favorites = JSON.parse(localStorage.getItem('cedars_favorites') || '[]');
    const favorite = { id: itemId, type: itemType, timestamp: Date.now() };
    
    if (!favorites.find(f => f.id === itemId && f.type === itemType)) {
        favorites.push(favorite);
        localStorage.setItem('cedars_favorites', JSON.stringify(favorites));
        showNotification('⭐ Added to favorites!');
    } else {
        showNotification('Already in favorites!');
    }
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('cedars_favorites') || '[]');
}

// ===== PRINT STORY FUNCTIONALITY =====
function printStory(storyElement) {
    window.print();
}

// ===== SERVICE WORKER REGISTRATION (FOR PWA - FUTURE) =====
if ('serviceWorker' in navigator) {
    // Uncomment when ready to add PWA functionality
    // navigator.serviceWorker.register('/sw.js').then(reg => {
    //     console.log('Service Worker registered', reg);
    // }).catch(err => {
    //     console.log('Service Worker registration failed', err);
    // });
}

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.showSection = showSection;
window.showNotification = showNotification;
window.showMap = showMap;
window.showEvents = showEvents;
window.shareStory = shareStory;
window.saveFavorite = saveFavorite;
window.printStory = printStory;