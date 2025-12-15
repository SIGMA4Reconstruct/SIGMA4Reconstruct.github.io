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
});
