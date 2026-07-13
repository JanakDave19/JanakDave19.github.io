// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-codes",
          title: "codes",
          description: "A collection of my coding projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/codes/";
          },
        },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "post-understanding-the-pid-algorithm-a-light-intensity-controller-example",
        
          title: "Understanding the PID Algorithm: A Light-Intensity Controller Example",
        
        description: "What P, I and D really do, worked out on a camera-brightness loop that talks to a light source over I2C.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/understanding-pid-light-controller/";
          
        },
      },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
        
          title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
        section: "Posts",
        handler: () => {
          
            window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
          
        },
      },{id: "post-displaying-external-posts-on-your-al-folio-blog",
        
          title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-received-a-grant-from-the-bill-amp-amp-melinda-gates-foundation-for-equitable-use-of-ai-in-healthcare-read-more",
          title: 'Received a grant from the Bill &amp;amp;amp; Melinda Gates Foundation for Equitable Use...',
          description: "",
          section: "News",},{id: "news-collaborating-with-cmc-vellore-for-making-a-first-of-its-kind-dataset-of-gastroscopy-videos-along-with-patient-reports",
          title: 'Collaborating with CMC Vellore for making a first-of-its-kind dataset of Gastroscopy videos along...',
          description: "",
          section: "News",},{id: "news-representing-iit-madras-at-india-medtech-expo-2025-catch-up-with-us-at-the-r-amp-amp-d-pavilion",
          title: 'Representing IIT Madras at India MedTech Expo 2025. Catch up with us at...',
          description: "",
          section: "News",},{id: "news-two-papers-accepted-at-ieee-memea-2026-on-locally-deployable-llms-for-endoscopy-reporting-and-real-time-multi-task-classification-for-endoscopic-assistance",
          title: 'Two papers accepted at IEEE MeMeA 2026 on locally deployable LLMs for endoscopy...',
          description: "",
          section: "News",},{id: "news-one-paper-accepted-at-embc-2026-endogate-net-a-lightweight-cnn-transformer-model-for-real-time-endoscopic-analysis-on-edge-devices-enabling-clinical-grade-video-processing-at-86-fps",
          title: 'One paper accepted at EMBC 2026: EndoGate-Net, a lightweight CNN-Transformer model for real-time...',
          description: "",
          section: "News",},{id: "projects-image-processing-basics",
          title: 'Image Processing Basics',
          description: "Fundamental image processing algorithms and techniques.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_image_processing/";
            },},{id: "projects-imaging-techniques",
          title: 'Imaging Techniques',
          description: "Advanced imaging techniques and implementations.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_imaging_techniques/";
            },},{id: "projects-parallel-reduction",
          title: 'Parallel Reduction',
          description: "GPU parallel reduction algorithms and CUDA programming.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_parallel_reduction/";
            },},{id: "projects-hackerrank-30-day-code",
          title: 'HackerRank 30 Day Code',
          description: "Solutions to the HackerRank 30 Days of Code challenge.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_hackerrank/";
            },},{id: "projects-ee5176-computational-photography",
          title: 'EE5176-Computational Photography',
          description: "Instructor- Kaushik Mitra",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_ee5176/";
            },},{id: "projects-ee5178-modern-computer-vision",
          title: 'EE5178-Modern Computer Vision',
          description: "Instructor- Kaushik Mitra",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_ee5178/";
            },},{id: "projects-ee5179-deep-learning-for-imaging",
          title: 'EE5179-Deep Learning For Imaging',
          description: "Instructor- Kaushik Mitra",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_ee5179/";
            },},{id: "projects-ee6130-advanced-topics-in-signal-processing",
          title: 'EE6130-Advanced Topics in Signal Processing',
          description: "Instructor- Umesh S",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_ee6130/";
            },},{id: "projects-texture-enhancement-algorithm",
          title: 'Texture Enhancement Algorithm',
          description: "Algorithm for Texture Enhancement in Endoscopy",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_TXI/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6A%61%6E%61%6B%79%64%61%76%65@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/janak-dave", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/janak-dave", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0009-0004-8206-2295", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=dCTPbakAAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
