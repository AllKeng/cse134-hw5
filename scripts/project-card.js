import { addGlobalStylesToShadowRoot } from "./global-styles.js";
export class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

    }

    connectedCallback() {
        
        const title = this.getAttribute('title') || 'Project Title';
        const videoSrc = this.getAttribute('video') || '';
        const imageSrcDesktop = this.getAttribute('imageDesktop') || '';
        const imageSrcTablet = this.getAttribute('imageTablet') || '';
        const imageSrc = this.getAttribute('image') || '';
        const altText = this.getAttribute('alt') || 'Project image';
        const description = this.getAttribute('description') || 'Project description.';
        const link = this.getAttribute('link') || '#';
        const linkMsg = this.getAttribute('linkMsg') || '';
        const tags = (this.getAttribute('tags') || '').split(',');

        this.shadowRoot.innerHTML = `
            <style>
            ul {
                font-size: 1.3rem;
                line-height: 1.5;
                text-align: center;
                list-style-position: inside;
            }

            footer {
                margin-top: 1rem;
                text-align: center;
                font-size: 1.1rem;
                font-style: italic;
                color: var(--text-emphasis, #ff6347);
}
            </style>
            <h2>${title}</h2>

            <!-- Conditional rendering for picture or video -->
            ${videoSrc ? `
                <video controls>
                    <source src="${videoSrc}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            ` : `
            <picture>
                <source srcset="${imageSrcDesktop}" media="(min-width: 1024px)" >
                <!-- Medium image for tablets -->
                <source srcset="${imageSrcTablet}" media="(min-width: 768px)" >
                <img src="${imageSrc}" alt="${altText}">
            </picture>`}
            <ul>
                ${description.split(' / ').map(item => `<li>${item.trim()}</li>`).join('')}
                <li> <a href="${link}" target="_blank">${linkMsg}</a> </li>
            </ul>
            <footer>
                ${tags.map(tag => tag ? `${tag.trim()}` : '').join(',')}
            </footer>
        `;
        addGlobalStylesToShadowRoot(this.shadowRoot); // look here!
    }
}

customElements.define('project-card', ProjectCard);

// Function to load projects dynamically
async function loadProjects() {
    const container = document.getElementById('projects-container');
    const response = await fetch('projects.json');
    const projects = await response.json();

    projects.forEach(proj => {
        const card = document.createElement('project-card');
        card.setAttribute('title', proj.title);
        card.setAttribute('imageDesktop', proj.imageSrcDesktop);
        card.setAttribute('imageTablet', proj.imageSrcTablet);
        card.setAttribute('image', proj.image);
        card.setAttribute('alt', proj.alt);
        card.setAttribute('description', proj.description);
        card.setAttribute('link', proj.link);
        card.setAttribute('tags', proj.tags.join(','));
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', loadProjects);