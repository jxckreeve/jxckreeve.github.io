// Data storage
let profileData = null;
let socialData = null;
let cvData = null;
let cvSectionsData = null;
let projectsData = null;

// Lightbox functions
function openLightbox(imgSrc) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = imgSrc;
  lightbox.classList.add('active');
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
}

// Carousel navigation
let carouselStates = {};

function initCarousel(categoryId, totalSlides) {
  carouselStates[categoryId] = { currentSlide: 0, totalSlides: totalSlides };
  // Small delay to ensure images are loaded
  setTimeout(() => {
    updateCarousel(categoryId);
  }, 100);
}

function nextSlide(categoryId) {
  const state = carouselStates[categoryId];
  if (state.currentSlide < state.totalSlides - 1) {
    state.currentSlide++;
    updateCarousel(categoryId);
  }
}

function prevSlide(categoryId) {
  const state = carouselStates[categoryId];
  if (state.currentSlide > 0) {
    state.currentSlide--;
    updateCarousel(categoryId);
  }
}

function goToSlide(categoryId, slideIndex) {
  const state = carouselStates[categoryId];
  state.currentSlide = slideIndex;
  updateCarousel(categoryId);
}

function updateCarousel(categoryId) {
  const state = carouselStates[categoryId];
  const container = document.querySelector(`#${categoryId} .carousel-container`);
  const slides = document.querySelector(`#${categoryId} .carousel-slides`);
  const prevBtn = document.querySelector(`#${categoryId} .carousel-prev`);
  const nextBtn = document.querySelector(`#${categoryId} .carousel-next`);
  const dots = document.querySelectorAll(`#${categoryId} .carousel-dot`);
  const allSlides = document.querySelectorAll(`#${categoryId} .carousel-slide`);
  const currentSlide = allSlides[state.currentSlide];
  
  if (slides) {
    slides.style.transform = `translateX(-${state.currentSlide * 100}%)`;
  }
  
  // Adjust container height to match current slide
  if (container && currentSlide) {
    // Force reflow to get accurate height
    const height = currentSlide.offsetHeight;
    container.style.height = height + 'px';
  }
  
  if (prevBtn) prevBtn.disabled = state.currentSlide === 0;
  if (nextBtn) nextBtn.disabled = state.currentSlide === state.totalSlides - 1;
  
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === state.currentSlide);
  });
}

// Load JSON data with fallbacks
async function loadData() {
  try {
    // Try to load each file individually with fallbacks
    try {
      profileData = await fetch('./data/profile.json').then(r => r.json());
    } catch (e) {
      console.warn('Profile data not found, using defaults');
      profileData = {
        name: "Jack Reeve",
        photo: "./assets/Jack.jpg",
        typedStrings: ["Car Enthusiast", "Engineer", "Rugby Player"],
        about: "Loading profile information..."
      };
    }

    try {
      socialData = await fetch('./data/social.json').then(r => r.json());
    } catch (e) {
      console.warn('Social data not found, using defaults');
      socialData = [
        { icon: "fas fa-envelope", text: "Email", url: "mailto:jackacreeve@hotmail.com" },
        { icon: "fab fa-github", text: "GitHub", url: "https://github.com/jxck" }
      ];
    }

    try {
      cvData = await fetch('./data/cv.json').then(r => r.json());
    } catch (e) {
      console.warn('CV data not found, using defaults');
      cvData = {
        downloadLink: {
          description: "CV information coming soon.",
          pdfUrl: "#"
        }
      };
    }

    try {
      cvSectionsData = await fetch('./data/cv-sections.json').then(r => r.json());
    } catch (e) {
      console.warn('CV sections data not found, using defaults');
      cvSectionsData = {
        profile: { title: "Profile", content: "Profile information coming soon." },
        education: [],
        experience: [],
        awards: { title: "Awards and Achievements", items: [] },
        skills: []
      };
    }

    try {
      projectsData = await fetch('./data/projects.json').then(r => r.json());
    } catch (e) {
      console.warn('Projects data not found, using defaults');
      projectsData = {
        cars: [],
        cad: []
      };
    }
    
    return true;
  } catch (error) {
    console.error('Critical error loading data:', error);
    return false;
  }
}

// Render functions
function renderSocialLinks() {
  const container = document.getElementById('social-links');
  const html = socialData.map(social => 
    `<div class="social_links">
      <a href="${social.url}" target="_blank" rel="noopener noreferrer">
        <i class="${social.icon}"></i> ${social.text}
      </a>
    </div>`
  ).join('');
  container.innerHTML = html;
}

function renderHome() {
  return `
    <div id="info_card" class="card">
      <section class="tab">
        <div class="title"><i class="fas fa-info-circle"></i><b>About Me</b></div>
        <div class="content">
          <section class="element">
            <div class="info">${profileData.about}</div>
          </section>
        </div>
      </section>
    </div>
  `;
}

function renderCV() {
  let html = ''

  // Profile Section (Single Box)
  if (cvSectionsData.profile) {
    html += `
      <div id="info_card" class="card">
        <section class="tab">
          <div class="cv-title">
            <strong>Profile</strong>
          </div>
          <div class="content">
            <section class="element">
              <div class="info">${cvSectionsData.profile.content}</div>
            </section>
          </div>
        </section>
      </div>
    `;
  }

  // Education Section (Carousel)
  if (cvSectionsData.education && cvSectionsData.education.length > 0) {
    html += `
      <div id="info_card" class="card">
        <section class="tab">
          <div class="cv-title"><b>Education</b></div>
          <div class="content">
            <section class="element">
              <div class="info">
                <div id="education-carousel" class="project-carousel">
                  <div class="carousel-container">
                    <div class="carousel-slides">
                      ${cvSectionsData.education.map(edu => {
                        const achievements = edu.achievements && edu.achievements.length > 0 ?
                          `<ul style="margin-top: 10px; text-align: left;">
                            ${edu.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                          </ul>` : '';

                        return `
                          <div class="carousel-slide">
                            <div class="project-title">${edu.institution}</div>
                            <div class="cv-institution">${edu.title}</div>
                            <div class="cv-dates">${edu.dates}</div>
                            <!-- <div class="project-description" style="margin-top: 10px;">${edu.description}</div> -->
                            <div class="project-description">${achievements}</div>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                  ${cvSectionsData.education.length > 1 ? `
                  <div class="carousel-nav">
                    <button class="carousel-button carousel-prev" onclick="prevSlide('education-carousel')">← Prev</button>
                    <div class="carousel-dots">
                      ${cvSectionsData.education.map((_, index) => 
                        `<span class="carousel-dot" onclick="goToSlide('education-carousel', ${index})"></span>`
                      ).join('')}
                    </div>
                    <button class="carousel-button carousel-next" onclick="nextSlide('education-carousel')">Next →</button>
                  </div>
                  ` : ''}
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    `;
  }

  // Experience Section (Carousel)
  if (cvSectionsData.experience && cvSectionsData.experience.length > 0) {
    html += `
      <div id="info_card" class="card">
        <section class="tab">
          <div class="cv-title"><b>Experience</b></div>
          <div class="content">
            <section class="element">
              <div class="info">
                <div id="experience-carousel" class="project-carousel">
                  <div class="carousel-container">
                    <div class="carousel-slides">
                      ${cvSectionsData.experience.map(exp => {
                        const achievements = exp.achievements && exp.achievements.length > 0 ?
                          `<ul style="margin-top: 10px; text-align: left;">
                            ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                          </ul>` : '';

                        return `
                          <div class="carousel-slide">
                            <div class="project-title">${exp.title}</div>
                            <div class="cv-institution">${exp.company}</div>
                            <div class="cv-dates">${exp.dates}</div>
                            <div class="project-description" style="margin-top: 10px;">${exp.description}</div>
                            <div class="project-description">${achievements}</div>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                  ${cvSectionsData.experience.length > 1 ? `
                  <div class="carousel-nav">
                    <button class="carousel-button carousel-prev" onclick="prevSlide('experience-carousel')">← Prev</button>
                    <div class="carousel-dots">
                      ${cvSectionsData.experience.map((_, index) => 
                        `<span class="carousel-dot" onclick="goToSlide('experience-carousel', ${index})"></span>`
                      ).join('')}
                    </div>
                    <button class="carousel-button carousel-next" onclick="nextSlide('experience-carousel')">Next →</button>
                  </div>
                  ` : ''}
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    `;
  }

  // Awards Section (Single Box)
  if (cvSectionsData.awards && cvSectionsData.awards.items.length > 0) {
    html += `
      <div id="info_card" class="card">
        <section class="tab">
          <div class="cv-title"><b>${cvSectionsData.awards.title}</b></div>
          <div class="content">
            <section class="element">
              <div class="info">
                <ul class="project-description" style="text-align: left;">
                  ${cvSectionsData.awards.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
            </section>
          </div>
        </section>
      </div>
    `;
  }

  // Skills Section (Carousel)
  if (cvSectionsData.skills && cvSectionsData.skills.length > 0) {
    html += `
      <div id="info_card" class="card">
        <section class="tab">
          <div class="cv-title"><b>Skills</b></div>
          <div class="content">
            <section class="element">
              <div class="info">
                <div id="skills-carousel" class="project-carousel">
                  <div class="carousel-container">
                    <div class="carousel-slides">
                      ${cvSectionsData.skills.map(skill => {
                        return `
                          <div class="carousel-slide">
                            <div class="project-title">${skill.title}</div>
                            <ul class="project-description"; style="margin-top: 10px; text-align: left;">
                              ${skill.items.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                  ${cvSectionsData.skills.length > 1 ? `
                  <div class="carousel-nav">
                    <button class="carousel-button carousel-prev" onclick="prevSlide('skills-carousel')">← Prev</button>
                    <div class="carousel-dots">
                      ${cvSectionsData.skills.map((_, index) => 
                        `<span class="carousel-dot" onclick="goToSlide('skills-carousel', ${index})"></span>`
                      ).join('')}
                    </div>
                    <button class="carousel-button carousel-next" onclick="nextSlide('skills-carousel')">Next →</button>
                  </div>
                  ` : ''}
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    `;
  }

  // Initialize carousels after rendering
  setTimeout(() => {
    if (cvSectionsData.education && cvSectionsData.education.length > 1) {
      initCarousel('education-carousel', cvSectionsData.education.length);
    }
    if (cvSectionsData.experience && cvSectionsData.experience.length > 1) {
      initCarousel('experience-carousel', cvSectionsData.experience.length);
    }
    if (cvSectionsData.skills && cvSectionsData.skills.length > 1) {
      initCarousel('skills-carousel', cvSectionsData.skills.length);
    }
  }, 0);

  return html;
}

function renderProjects() {
  let html = `
    <div id="info_card" class="card">
      <section class="tab">
        <div class="title"><i class="fas fa-info-circle"></i><b>My Projects</b></div>
        <div class="content">
          <section class="element">
            <div class="info">Below, you can find my various projects. Use the arrows to browse through each category.</div>
          </section>
        </div>
      </section>
    </div>
  `;

  // CAD Projects Carousel
  if (projectsData.cad.length > 0) {
    html += `
      <div id="info_card" class="card">
        <section class="tab">
          <div class="title"><i class="fas fa-laptop"></i>CAD Projects</div>
          <div class="content">
            <section class="element">
              <div class="info">
                <div id="cad-carousel" class="project-carousel">
                  <div class="carousel-container">
                    <div class="carousel-slides">
                      ${projectsData.cad.map(project => {
                        const imageGallery = project.images.length > 0 ? 
                          `<div class="gallery-grid">
                            ${project.images.map(img => 
                              `<div class="gallery-item">
                                <img src="${img}" alt="${project.title}" onclick="openLightbox('${img}')" style="cursor: pointer;">
                              </div>`
                            ).join('')}
                          </div>` : '';

                        const fileLinks = project.files && project.files.length > 0 ?
                          `<div style="margin-top: 15px;">
                            <strong>Additional Files:</strong><br>
                            ${project.files.map(file => 
                              `<div class="project-file">
                                <a href="${file.url}" target="_blank">${file.name}</a>
                              </div>`
                            ).join('<br>')}
                          </div>` : '';

                        return `
                          <div class="carousel-slide">
                            <div class="project-title">${project.title}</div>
                            <div class="project-description">${project.description}</div>
                            ${imageGallery}
                            ${fileLinks}
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                  <div class="carousel-nav">
                    <button class="carousel-button carousel-prev" onclick="prevSlide('cad-carousel')">← Prev</button>
                    <div class="carousel-dots">
                      ${projectsData.cad.map((_, index) => 
                        `<span class="carousel-dot" onclick="goToSlide('cad-carousel', ${index})"></span>`
                      ).join('')}
                    </div>
                    <button class="carousel-button carousel-next" onclick="nextSlide('cad-carousel')">Next →</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    `;
  }

  // Car Projects Carousel
  if (projectsData.cars.length > 0) {
    html += `
      <div id="info_card" class="card">
        <section class="tab">
          <div class="title"><i class="fas fa-car"></i>Car Projects</div>
          <div class="content">
            <section class="element">
              <div class="info">
                <div id="car-carousel" class="project-carousel">
                  <div class="carousel-container">
                    <div class="carousel-slides">
                      ${projectsData.cars.map(project => {
                        const imageGallery = project.images.length > 0 ? 
                          `<div class="gallery-grid">
                            ${project.images.map(img => 
                              `<div class="gallery-item">
                                <img src="${img}" alt="${project.title}" onclick="openLightbox('${img}')" style="cursor: pointer;">
                              </div>`
                            ).join('')}
                          </div>` : '';

                        const fileLinks = project.files && project.files.length > 0 ?
                          `<div style="margin-top: 15px;">
                            <strong>Additional Files:</strong><br>
                            ${project.files.map(file => 
                                `<div class="project-file">
                                  <a href="${file.url}" target="_blank">${file.name}</a>
                                </div>`
                            ).join('<br>')}
                          </div>` : '';

                        return `
                          <div class="carousel-slide">
                            <div class="project-title">${project.title}</div>
                            <div class="project-description">${project.description}</div>
                            ${imageGallery}
                            ${fileLinks}
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                  <div class="carousel-nav">
                    <button class="carousel-button carousel-prev" onclick="prevSlide('car-carousel')">← Prev</button>
                    <div class="carousel-dots">
                      ${projectsData.cars.map((_, index) => 
                        `<span class="carousel-dot" onclick="goToSlide('car-carousel', ${index})"></span>`
                      ).join('')}
                    </div>
                    <button class="carousel-button carousel-next" onclick="nextSlide('car-carousel')">Next →</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    `;
  }

  // Initialize carousels after rendering
  setTimeout(() => {
    if (projectsData.cad.length > 0) initCarousel('cad-carousel', projectsData.cad.length);
    if (projectsData.cars.length > 0) initCarousel('car-carousel', projectsData.cars.length);
  }, 0);

  return html;
}

function renderContact() {
  return `
    <div id="info_card" class="card">
      <section class="tab">
        <div class="title"><i class="fas fa-envelope"></i><b>Get In Touch</b></div>
        <div class="content">
          <section class="element">
            <div class="info">Feel free to reach out through any of the platforms below!</div>
          </section>
        </div>
      </section>
    </div>
  `;
}

function showSection(section) {
  const content = document.getElementById('main-content');
  const navLinks = document.querySelectorAll('.navbar a');
  
  navLinks.forEach(link => link.classList.remove('active'));
  if (window.event && window.event.target) {
    window.event.target.classList.add('active');
  }

  switch(section) {
    case 'home':
      content.innerHTML = renderHome();
      break;
    case 'cv':
      content.innerHTML = renderCV();
      break;
    case 'projects':
      content.innerHTML = renderProjects();
      break;
    case 'contact':
      content.innerHTML = renderContact();
      break;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
  const loaded = await loadData();
  
  if (loaded) {
    renderSocialLinks();
    
    // Show home page content
    const content = document.getElementById('main-content');
    content.innerHTML = renderHome();
    
    // Initialize Typed.js
    new Typed('#description', {
      strings: profileData.typedStrings,
      shuffle: true,
      loop: true,
      typeSpeed: 100,
      backSpeed: 100,
      cursorChar: '|',
    });
  } else {
    document.getElementById('main-content').innerHTML = 
      '<div class="card"><p>Error loading portfolio data. Please refresh the page.</p></div>';
  }
});