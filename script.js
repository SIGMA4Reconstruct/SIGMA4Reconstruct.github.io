// Page Loader
window.addEventListener('load', function() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 500);
});

document.addEventListener('DOMContentLoaded', async function() {
  // Helper function to create and destroy iframes
  const createIframe = (src, container) => {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;

    // Get the loader element in the container
    const loader = container.querySelector('.loading-frame');
    if (loader) {
      loader.style.display = 'flex';
    }

    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.className = 'iframe-container';
    iframeContainer.appendChild(iframe);

    // Hide loader when iframe loads
    iframe.onload = () => {
      if (loader) {
        loader.style.display = 'none';
      }
    };

    return iframeContainer;
  };

  const destroyIframe = (container) => {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  };

  // Intersection Observer for section animations
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    observer.observe(section);
  });

  // Tab functionality for Related Works
  const workTabs = document.querySelectorAll('.work-tab');
  const workContents = document.querySelectorAll('.work-content');

  workTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');

      // Remove active class from all tabs and contents
      workTabs.forEach(t => t.classList.remove('active'));
      workContents.forEach(c => c.classList.remove('active'));

      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // ==================== Dataset Gallery ====================
  const towns = ['Town01', 'Town02', 'Town03', 'Town04', 'Town05', 'Town06', 'Town07', 'Town10HD'];
  const scenes = ['00', '01', '02', '03', '04', '05'];
  const cameras = {
    'car_forward': { id: 'cam00', label: 'Car Forward' },
    'drone_forward': { id: 'cam01', label: 'Drone Forward' },
    'orbit_building': { id: 'cam02', label: 'Orbit Building' },
    'orbit_crossroad': { id: 'cam03', label: 'Orbit Crossroad' },
    'cctv': { id: 'cam04', label: 'CCTV' },
    'pedestrian': { id: 'cam05', label: 'Pedestrian' }
  };

  let currentTown = 'Town01';
  let currentCamera = 'car_forward';

  function generateGallery() {
    const container = document.getElementById('gallery-content');
    if (!container) return;

    container.innerHTML = '';
    const cam = cameras[currentCamera];

    scenes.forEach(scene => {
      const base = `${currentTown}_${scene}_${cam.id}_${currentCamera}`;
      const dynamicSrc = `assets/data_demo/${base}_dynamic.gif`;
      const staticSrc = `assets/data_demo/${base}_static.gif`;

      const card = document.createElement('div');
      card.className = 'comparison-card';
      card.innerHTML = `
        <div class="comparison-card-header">Scene ${scene}</div>
        <div class="comparison-slider-wrap">
          <img class="img-static" src="${staticSrc}" alt="Static" loading="lazy">
          <img class="img-dynamic" src="${dynamicSrc}" alt="Dynamic" loading="lazy">
          <div class="slider-divider"></div>
          <div class="slider-handle"><i class="fas fa-arrows-alt-h"></i></div>
          <span class="comparison-label left">Dynamic</span>
          <span class="comparison-label right">Static</span>
        </div>
      `;
      container.appendChild(card);
    });

    // Initialize sliders with auto-tracking on hover
    initSliders();
  }

  function initSliders() {
    document.querySelectorAll('.comparison-slider-wrap').forEach(wrap => {
      const updateSlider = (e) => {
        const rect = wrap.getBoundingClientRect();
        let x;
        if (e.touches) {
          x = e.touches[0].clientX - rect.left;
        } else {
          x = e.clientX - rect.left;
        }
        const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));

        wrap.querySelector('.img-dynamic').style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        wrap.querySelector('.slider-divider').style.left = percent + '%';
        wrap.querySelector('.slider-handle').style.left = percent + '%';
      };

      // Auto-track on mouse move (no click needed)
      wrap.addEventListener('mousemove', updateSlider);

      // Touch support
      wrap.addEventListener('touchmove', (e) => {
        e.preventDefault();
        updateSlider(e);
      }, { passive: false });
    });
  }

  // Town tab clicks
  document.querySelectorAll('.gallery-town-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.gallery-town-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTown = tab.dataset.town;
      generateGallery();
    });
  });

  // Camera tab clicks
  document.querySelectorAll('.gallery-camera-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.gallery-camera-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCamera = tab.dataset.camera;
      generateGallery();
    });
  });

  // Initial gallery load
  generateGallery();

  // ==================== Auto-Scrolling Wall ====================
  function initScrollWall() {
    const container = document.getElementById('scroll-wall');
    if (!container) return;

    container.innerHTML = '';

    // Generate all GIF pairs for scroll wall
    const allPairs = [];
    towns.forEach(town => {
      scenes.forEach(scene => {
        Object.entries(cameras).forEach(([camName, cam]) => {
          const base = `${town}_${scene}_${cam.id}_${camName}`;
          allPairs.push({
            dynamic: `assets/data_demo/${base}_dynamic.gif`,
            static: `assets/data_demo/${base}_static.gif`,
            label: `${town} - ${cam.label}`
          });
        });
      });
    });

    const rows = 4;
    const itemsPerRow = 25;

    for (let r = 0; r < rows; r++) {
      const row = document.createElement('div');
      row.className = 'scroll-row';

      // Duplicate items for seamless loop
      for (let i = 0; i < itemsPerRow * 2; i++) {
        const pairIndex = (r * itemsPerRow + i) % allPairs.length;
        const pair = allPairs[pairIndex];
        const item = document.createElement('div');
        item.className = 'scroll-row-item';
        // Alternate between dynamic and static based on row
        const src = r % 2 === 0 ? pair.dynamic : pair.static;
        item.innerHTML = `
          <img src="${src}" alt="${pair.label}" loading="lazy">
          <div class="scroll-label">${pair.label}</div>
        `;
        row.appendChild(item);
      }

      container.appendChild(row);
    }
  }

  // Initialize scroll wall
  initScrollWall();
});
