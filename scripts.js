import { projects, categories } from './data/projects.js';
import { blogPosts } from './data/blog-posts.js';

let activeCategory = "All";

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

function renderProjectTabs() {
    const tabsContainer = document.getElementById('project-tabs');
    if (!tabsContainer) return;
    
    tabsContainer.innerHTML = categories.map(category => `
        <button class="tab-button ${category === activeCategory ? 'active' : ''}" 
                data-category="${category}">
            ${category}
        </button>
    `).join('');
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            activeCategory = button.getAttribute('data-category');
            renderProjectTabs();
            renderProjects();
        });
    });
}

function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    const filteredProjects = activeCategory === "All" 
        ? projects 
        : projects.filter(p => p.category === activeCategory);
    
    if (filteredProjects.length === 0) {
        projectsGrid.innerHTML = '<p style="text-align: center; color: var(--base-800); padding: 40px;">No projects in this category yet.</p>';
        return;
    }
    
    projectsGrid.innerHTML = filteredProjects.map(project => `
        <div class="project-card" data-project-id="${project.id}" tabindex="0">
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
    `).join('');
}

function renderBlogPosts() {
    const blogContainer = document.getElementById('blog-posts-container');
    if (!blogContainer) return;
    
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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await Promise.all([
            loadComponent('./components/header.html', 'header-container'),
            loadComponent('./components/hero.html', 'hero-container'),
            loadComponent('./components/projects.html', 'projects-container'),
            loadComponent('./components/blogs.html', 'blog-container')
        ]);
        
        renderProjectTabs();
        renderProjects();
        renderBlogPosts();
        
        initializeEventListeners();
        
        initializeBackToTop();
        
    } catch (error) {
        console.error('Error loading components:', error);
    }
});

function initializeEventListeners() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMobileMenu();
        });
    }
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card) => {
        card.addEventListener('click', () => {
            const projectId = parseInt(card.getAttribute('data-project-id'));
            openPopup(projectId);
        });
        
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const projectId = parseInt(card.getAttribute('data-project-id'));
                openPopup(projectId);
            }
        });
    });
    
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }
    
    const popup = document.getElementById('popup');
    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                closePopup();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
    
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
                    
                
                    const menu = document.getElementById('menu');
                    if (menu && menu.classList.contains('active')) {
                        menu.classList.remove('active');
                    }
                }
            }
        });
    });
}

function toggleMobileMenu() {
    const menu = document.getElementById("menu");
    if (menu) {
        menu.classList.toggle("active");
    }
}

function buildProjectContent(project) {
    return `
        <h2>${project.fullTitle}</h2>
        
        <div class="popup-meta">
            <div class="popup-meta-item">
                <span class="popup-meta-label">Role: </span>
                <span class="popup-meta-value">${project.role}</span>
            </div>
            <div class="popup-meta-item">
                <span class="popup-meta-label">Timeline: </span>
                <span class="popup-meta-value">${project.timeline}</span>
            </div>
            <div class="popup-meta-item">
                <span class="popup-meta-label">Team: </span>
                <span class="popup-meta-value">${project.team.join(', ')}</span>
            </div>
            ${project.course ? `
                <div class="popup-meta-item">
                    <span class="popup-meta-label">Course: </span>
                    <span class="popup-meta-value">${project.course}</span>
                </div>
            ` : ''}
        </div>

        <p><strong>Overview:</strong> ${project.fullDescription}</p>

        <img src="${project.gif}" alt="${project.title}" loading="lazy">

        <div class="popup-section">
            <h3>Technologies Used</h3>
            <div class="tech-stack">
                ${project.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
            </div>
        </div>

        ${project.keyFeatures ? `
            <div class="popup-section">
                <h3>Key Features</h3>
                <ul>
                    ${project.keyFeatures.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        ` : ''}
        </br>


        <div class="popup-buttons">
            <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="button beige">
                View on GitHub
            </a>
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
    `;
}

function openPopup(projectId) {
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
        popupContent.innerHTML = "<p>Project not found.</p>";
        return;
    }
    
    popupContent.innerHTML = buildProjectContent(project);
    popup.style.display = 'flex';
    
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

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
    
    setTimeout(() => {
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }, 500);
}

function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

window.toggleMobileMenu = toggleMobileMenu;
window.openPopup = openPopup;
window.closePopup = closePopup;