// Import data
import { projects, categories } from './data/projects.js';
import { blogPosts } from './data/blog-posts.js';

// Current active category
let activeCategory = "All";

// Component loader with error handling and loading states
async function loadComponent(componentPath, containerId) {
    const container = document.getElementById(containerId);
    
    try {
        container.classList.add('loading');
        
        const response = await fetch(componentPath);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${componentPath}: ${response.status}`);
        }
        
        const html = await response.text();
        container.innerHTML = html;
        
        container.classList.remove('loading');
        container.classList.add('fade-in');
        
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
        container.innerHTML = `
            <div style="padding: 20px; text-align: center; color: var(--base-800);">
                <p>Error loading content. Please refresh the page.</p>
            </div>
        `;
    }
}

// Render project tabs
function renderProjectTabs() {
    const tabsContainer = document.getElementById('project-tabs');
    if (!tabsContainer) return;
    
    tabsContainer.innerHTML = categories.map(category => `
        <button class="tab-button ${category === activeCategory ? 'active' : ''}" 
                data-category="${category}">
            ${category}
        </button>
    `).join('');
    
    // Add click handlers to tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            activeCategory = button.getAttribute('data-category');
            renderProjectTabs();
            renderProjects();
        });
    });
}

// Render projects from data
function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    // Filter projects by active category
    const filteredProjects = activeCategory === "All" 
        ? projects 
        : projects.filter(p => p.categories.includes(activeCategory));
    
    if (filteredProjects.length === 0) {
        projectsGrid.innerHTML = '<p style="text-align: center; color: var(--base-800); padding: 40px;">No projects in this category yet.</p>';
        return;
    }
    
    projectsGrid.innerHTML = filteredProjects.map((project, index) => {
        // Find the actual index in the full projects array
        const actualIndex = projects.indexOf(project);
        return `
        <div class="project-card" data-project-index="${actualIndex}" tabindex="0">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" />
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p class="project-tag">${project.type} • ${project.role}</p>
                <p class="project-description">${project.shortDescription}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    }).join('');
    
    // Re-attach event listeners to new project cards
    attachProjectCardListeners();
}

// Render blog posts from data
function renderBlogPosts() {
    const blogContainer = document.getElementById('blog-posts-container');
    if (!blogContainer) return;
    
    // Group posts into rows of 3
    const postsPerRow = 3;
    const rows = [];
    for (let i = 0; i < blogPosts.length; i += postsPerRow) {
        rows.push(blogPosts.slice(i, i + postsPerRow));
    }
    
    blogContainer.innerHTML = rows.map(row => `
        <div class="blog-posts">
            ${row.map(post => `
                <article>
                    <a href="${post.url}" target="_blank">
                        <figure>
                            <div>
                                <img src="${post.image}" alt="${post.title}" width="100%" />
                            </div>
                        </figure>
                        <h3>${post.title}</h3>
                        <div>${post.date} ${post.tags.map(tag => `<tags>${tag}</tags>`).join('')}</div>
                        <p>${post.description}</p>
                    </a>
                </article>
            `).join('')}
        </div>
        ${row !== rows[rows.length - 1] ? '<br>' : ''}
    `).join('');
}

// Load all components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load components in parallel
        await Promise.all([
            loadComponent('./components/header.html', 'header-container'),
            loadComponent('./components/hero.html', 'hero-container'),
            loadComponent('./components/projects.html', 'projects-container'),
            loadComponent('./components/blogs.html', 'blog-container')
        ]);
        
        // Render dynamic content from data
        renderProjectTabs();
        renderProjects();
        renderBlogPosts();
        
        // Initialize event listeners after everything is loaded
        initializeEventListeners();
        
        // Initialize back to top button
        initializeBackToTop();
        
    } catch (error) {
        console.error('Error loading components:', error);
    }
});

// Initialize all event listeners
function initializeEventListeners() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMobileMenu();
        });
    }
    
    // Attach project card listeners
    attachProjectCardListeners();
    
    // Close popup handler
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }
    
    // Close popup when clicking outside
    const popup = document.getElementById('popup');
    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                closePopup();
            }
        });
    }
    
    // Close popup with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    const menu = document.getElementById('menu');
                    if (menu && menu.classList.contains('active')) {
                        menu.classList.remove('active');
                    }
                }
            }
        });
    });
}

// Attach event listeners to project cards (separate function for re-use)
function attachProjectCardListeners() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card) => {
        card.addEventListener('click', () => {
            const projectIndex = parseInt(card.getAttribute('data-project-index'));
            openPopup(projectIndex);
        });
        
        // Add keyboard accessibility
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const projectIndex = parseInt(card.getAttribute('data-project-index'));
                openPopup(projectIndex);
            }
        });
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById("menu");
    if (menu) {
        menu.classList.toggle("active");
    }
}

// Build enhanced project popup content from data
function buildProjectContent(project) {
    return `
        <h2>${project.fullTitle}</h2>
        
        <div class="popup-meta">
            <div class="popup-meta-item">
                <span class="popup-meta-label">Role</span>
                <span class="popup-meta-value">${project.role}</span>
            </div>
            <div class="popup-meta-item">
                <span class="popup-meta-label">Timeline</span>
                <span class="popup-meta-value">${project.timeline}</span>
            </div>
            <div class="popup-meta-item">
                <span class="popup-meta-label">Team</span>
                <span class="popup-meta-value">${project.team.join(', ')}</span>
            </div>
            ${project.course ? `
                <div class="popup-meta-item">
                    <span class="popup-meta-label">Course</span>
                    <span class="popup-meta-value">${project.course}</span>
                </div>
            ` : ''}
        </div>

        <div class="popup-overview">${project.fullDescription}</div>

        <img src="${project.gif}" alt="${project.title}" loading="lazy">

        ${project.keyFeatures ? `
            <div class="popup-section">
                <h3>Key Features</h3>
                <ul>
                    ${project.keyFeatures.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
        <div class="center">
            <div class="popup-buttons">
                <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="button beige">
                    View on GitHub
                </a>
                ${project.website ? `
                    <a href="${project.website}" target="_blank" rel="noopener noreferrer" class="button beige">
                        Visit Website
                    </a>
                ` : ''}
                ${project.paper ? `
                    <a href="${project.paper}" target="_blank" rel="noopener noreferrer" class="button beige">
                        Read Paper
                    </a>
                ` : ''}
                ${project.demo ? `
                    <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="button beige">
                        Live Demo
                    </a>
                ` : ''}
            </div>
        </div>
    `;
}

// Open project popup
function openPopup(projectIndex) {
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    const project = projects[projectIndex];
    
    if (!project) {
        popupContent.innerHTML = "<p>Project not found.</p>";
        return;
    }
    
    popupContent.innerHTML = buildProjectContent(project);
    popup.style.display = 'flex';
    
    // Prevent body scroll when popup is open
    document.body.style.overflow = 'hidden';
}

// Close popup
function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'none';
        // Restore body scroll
        document.body.style.overflow = 'auto';
    }
}

// Lazy load images for better performance
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    // Observe images after components load
    setTimeout(() => {
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }, 500);
}

// Back to Top Button functionality
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Make functions globally accessible
window.toggleMobileMenu = toggleMobileMenu;
window.openPopup = openPopup;
window.closePopup = closePopup;