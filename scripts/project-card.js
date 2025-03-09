import { addGlobalStylesToShadowRoot } from "./global-styles.js";
export class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

    }

    connectedCallback() {
        
        let title = this.getAttribute('title') || 'Project Title';
        let videoSrc = this.getAttribute('video') || '';
        let imageSrcDesktop = this.getAttribute('imageDesktop') || '';
        let imageSrcTablet = this.getAttribute('imageTablet') || '';
        let imageSrc = this.getAttribute('image') || '';
        let altText = this.getAttribute('alt') || 'Project image';
        let description = this.getAttribute('description') || 'Project description.';
        let link = this.getAttribute('link') || '#';
        let linkMsg = this.getAttribute('linkMsg') || '';
        let tags = (this.getAttribute('tags') || '').split(',');
        //console.log(`VideoSrc: ${videoSrc} and imageSrc: ${imageSrc}`);
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
                font-size: 1.2rem;
                font-weight: bold;
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
                ${tags.map(tag => tag ? `${tag.trim()}` : '').join(', ')}
            </footer>
        `;
        addGlobalStylesToShadowRoot(this.shadowRoot); // look here!
    }
}

customElements.define('project-card', ProjectCard);

// Set up the data loading functions
async function loadLocalData() {
    const container = document.getElementById('projects-container');
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
        const projects = JSON.parse(storedProjects);
        renderProjects(projects);
    } else {
        alert('No data found in localStorage!');
    }
}

async function loadRemoteData() {
    const container = document.getElementById('projects-container');
    const apiKey = "$2a$10$XY1JU2eMbzryL4qtKP7fOeKU8hR4IiVPHE.v7WSbMtztt62t5qmVm";
    const binId = '67ccf99cacd3cb34a8f7638a';
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            method: 'GET',
            headers: {
              'X-Access-Key': apiKey, // Or X-Access-Key
            }
          }); // Replace with your actual remote URL
        if (!response.ok) {
            //console.log(response)
            // Check if the response is OK (status 200-299)
            throw new Error('Failed to fetch remote data');
        }
        
        const data = await response.json();
        const projects = data.record;
        console.log(projects)
        // Check if there are any projects returned
        if (projects && projects.length > 0) {
            renderProjects(projects);
        } else {
            alert('No data found in the remote source!');
        }
    } catch (error) {
        console.error('Error fetching remote data:', error);
        alert('Failed to load remote data. Please try again later.');
    }
}


function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = ''; // Clear previous cards

    projects.forEach(proj => {
        const card = document.createElement('project-card');
        card.setAttribute('title', proj.title);
        card.setAttribute('video',proj.video);
        card.setAttribute('imageDesktop', proj.imageDesktop);
        card.setAttribute('imageTablet', proj.imageTablet);
        card.setAttribute('image', proj.image);
        card.setAttribute('alt', proj.alt);
        card.setAttribute('description', proj.description);
        card.setAttribute('link', proj.link);
        card.setAttribute('linkMsg', proj.linkMsg);
        card.setAttribute('tags', proj.tags.join(','));
        container.appendChild(card);
    });
}

// Function to unload data (clear container)
function unloadData() {
    const container = document.getElementById('projects-container');
    container.innerHTML = ''; // Clear the contents of the container
}

// Event listeners for the buttons
document.getElementById('load-local-btn').addEventListener('click', loadLocalData);
document.getElementById('load-remote-btn').addEventListener('click', loadRemoteData);
document.getElementById('unload-btn').addEventListener('click', unloadData);

const exampleProjects = [
    {
        "title": "Snowboard Support System",
        "video": '',
        "imageDesktop": "media/BoardView.png",
        "imageTablet": "media/BoardView-tablet.png",
        "image": "media/BoardView-mobile.png",
        "alt": "TripleS Board",
        "description": "Arduino C for accelerometer data retrieval and bluetooth data transferring. / KiCad for PCB design to integrate our ESP32, accelerometer, power supply, potentiometer, and buzzer in a compact manner. / Python GUI to retrieve and display data via Bleak and Tkinter.",
        "link": "https://allkeng.github.io/Snowboard-Support-System/",
        "linkMsg": "Click here to more about it in my team's project website.",
        "tags": ["C", "Python", "Bluetooth Low Energy", "HTML", "JS", "CSS"]
    },
    {
        "title": "Pantry Pals",
        "video": "media/pantrypalDemo.mp4",
        "alt": "Pantry Pals App",
        "description": "Server setup to handle HTTP request for managing recipes and user data with backend connectivity to a MongoDB database. / ChatGPT API used to generate recipes and images from user-provided ingredients. / Java GUI to display recipe details, while following MVC Principles. / Github Actions setup to run JUnit Test",
        "link": "https://github.com/sprestrelski/pantrypal",
        "linkMsg": "Click here to see the Github.",
        "tags": ["Java", "JavaFX", "MongoDB", "ChatGPT API"]
    }
];

// Store in localStorage
localStorage.setItem('projects', JSON.stringify(exampleProjects));
