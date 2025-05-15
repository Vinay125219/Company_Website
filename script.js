// Enhanced script.js - Modern implementation with improved features

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initMobileNavigation();
    initChatBot();
    initScrollAnimations();
    initSkillBars();
    initWorkFilter();
    initContactForm();
    initPageLoader();
    initSmoothScrolling();
  });
  
  // Page Loader
  function initPageLoader() {
    const pageLoader = document.querySelector('.page-loader');
    if (!pageLoader) return;
    
    window.addEventListener('load', () => {
      pageLoader.classList.add('fade-out');
      setTimeout(() => {
        pageLoader.style.display = 'none';
      }, 500);
    });
  }
  
  // Mobile Navigation Toggle - Enhanced with accessibility and animations
  function initMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('header');
    
    if (!mobileToggle || !mainNav) return;
  
    // Toggle navigation on button click
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('active');
      
      // Change icon based on state
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isExpanded ? 'fas fa-bars' : 'fas fa-times';
      }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('active') && 
          !mainNav.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.className = 'fas fa-bars';
        }
      }
    });
    
    // Sticky header on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 100) {
        header.classList.add('sticky');
        
        // Hide header on scroll down, show on scroll up
        if (scrollTop > lastScrollTop) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }
      } else {
        header.classList.remove('sticky');
      }
      
      lastScrollTop = scrollTop;
    });
  }
  
  // Chat Bot Functionality - Enhanced with better UX and more realistic responses
  function initChatBot() {
    const chatToggle = document.querySelector('.chat-toggle');
    const chatWindow = document.querySelector('.chat-window');
    const chatClose = document.querySelector('.chat-close');
    const chatInput = document.querySelector('.chat-input');
    const chatSend = document.querySelector('.chat-send');
    const chatBody = document.querySelector('.chat-body');
    
    if (!chatToggle || !chatWindow || !chatClose || !chatInput || !chatSend || !chatBody) return;
    
    // Store chat history in session storage
    const chatHistory = JSON.parse(sessionStorage.getItem('chatHistory')) || [];
    
    // Restore chat history if available
    if (chatHistory.length > 0) {
      chatHistory.forEach(message => {
        chatBody.insertAdjacentHTML('beforeend', message);
      });
      chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    // Delayed auto-open with cookie check to not annoy returning visitors
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setTimeout(() => {
        chatWindow.classList.add('active');
        localStorage.setItem('hasVisitedBefore', 'true');
      }, 5000);
    }
    
    // Toggle chat window
    chatToggle.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
      if (chatWindow.classList.contains('active')) {
        chatInput.focus();
      }
    });
    
    // Close chat window
    chatClose.addEventListener('click', () => {
      chatWindow.classList.remove('active');
    });
    
    // More sophisticated chat bot responses based on keywords
    function getBotResponse(message) {
      message = message.toLowerCase();
      
      if (message.includes('pricing') || message.includes('cost') || message.includes('quote')) {
        return "Our pricing varies based on project requirements. To get a personalized quote, please provide some details about your project or leave your email and we'll get back to you soon.";
      } 
      else if (message.includes('contact') || message.includes('speak') || message.includes('talk')) {
        return "You can reach our team at info@yourcompany.com or call us at +123 456 7890. Alternatively, you can fill out the contact form on this page.";
      }
      else if (message.includes('services') || message.includes('offer')) {
        return "We offer web development, mobile app development, UI/UX design, digital marketing, cloud solutions, and consulting services. Which service are you interested in learning more about?";
      }
      else if (message.includes('website') || message.includes('web')) {
        return "Our web development team creates responsive, high-performance websites and web applications using the latest technologies. Would you like to discuss a potential website project?";
      }
      else if (message.includes('app') || message.includes('mobile')) {
        return "We develop native and cross-platform mobile applications for iOS and Android. Our apps are designed with user experience as a priority. What kind of app are you looking to build?";
      }
      else if (message.includes('thanks') || message.includes('thank you')) {
        return "You're welcome! Is there anything else I can help you with today?";
      }
      else {
        const defaultResponses = [
          "Thank you for reaching out. To better assist you, could you provide more details about what you're looking for?",
          "I'd be happy to help you with that. Could you elaborate a bit more so I can provide the most relevant information?",
          "Thanks for your message. A team member will get back to you soon, or you can provide more details for immediate assistance.",
          "I understand. Would you like to schedule a consultation with our team to discuss this further?"
        ];
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      }
    }
    
    // Send chat message function
    function sendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;
      
      // Add user message
      const userMessageHTML = `
        <div class="chat-message user-message">
          <div class="message-content">
            <p>${escapeHTML(message)}</p>
          </div>
        </div>
      `;
      chatBody.insertAdjacentHTML('beforeend', userMessageHTML);
      chatInput.value = '';
      
      // Save to history
      chatHistory.push(userMessageHTML);
      sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));
      
      // Show typing indicator
      const typingHTML = `
        <div class="chat-message bot-message typing-indicator">
          <div class="message-content">
            <p><span>.</span><span>.</span><span>.</span></p>
          </div>
        </div>
      `;
      chatBody.insertAdjacentHTML('beforeend', typingHTML);
      chatBody.scrollTop = chatBody.scrollHeight;
      
      // Calculate a realistic typing delay based on response length
      const botResponse = getBotResponse(message);
      const typingDelay = Math.min(1000 + (botResponse.length * 10), 3000);
      
      // Simulate bot response after typing delay
      setTimeout(() => {
        // Remove typing indicator
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
          typingIndicator.remove();
        }
        
        // Add bot response
        const botMessageHTML = `
          <div class="chat-message bot-message">
            <div class="message-content">
              <p>${botResponse}</p>
            </div>
          </div>
        `;
        chatBody.insertAdjacentHTML('beforeend', botMessageHTML);
        chatHistory.push(botMessageHTML);
        sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        chatBody.scrollTop = chatBody.scrollHeight;
      }, typingDelay);
    }
    
    // Send message on button click
    chatSend.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // Helper function to escape HTML for security
    function escapeHTML(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }
  
  // Enhanced Scroll Animations with Intersection Observer API
  function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers that don't support IntersectionObserver
      const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
      function checkFade() {
        fadeElements.forEach(element => {
          const elementTop = element.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          
          if (elementTop < windowHeight - 100) {
            element.classList.add('active');
          }
        });
      }
      
      // Initial check
      checkFade();
      
      // Check on scroll
      window.addEventListener('scroll', checkFade);
      return;
    }
    
    // Modern approach using Intersection Observer
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          fadeObserver.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });
    
    // Observe all animation elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(element => {
      fadeObserver.observe(element);
    });
    
    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    });
  }
  
  // Enhanced Skill Bars Animation
  function initSkillBars() {
    const skillSection = document.querySelector('.skills');
    const skillBars = document.querySelectorAll('.skill-progress span');
    
    if (!skillSection || !skillBars.length) return;
    
    // Use Intersection Observer for more efficient animation triggering
    const skillObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        skillBars.forEach(bar => {
          const targetWidth = bar.parentElement.previousElementSibling.lastElementChild.textContent;
          // Add animation with delay for each bar
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 200 * Array.from(skillBars).indexOf(bar));
        });
        
        // Stop observing once animated
        skillObserver.unobserve(skillSection);
      }
    }, {
      threshold: 0.5
    });
    
    skillObserver.observe(skillSection);
  }
  
  // Work Filter - Enhanced with smooth transitions
  function initWorkFilter() {
    const filterButtons = document.querySelectorAll('.work-filter button');
    const workItems = document.querySelectorAll('.work-item');
    
    if (!filterButtons.length || !workItems.length) return;
    
    // Initialize isotope-like layout functionality
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get filter value
        const filter = button.getAttribute('data-filter');
        
        // Prepare for animation
        workItems.forEach(item => {
          // First make all visible but with opacity 0
          if (item.style.display === 'none') {
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
          }
        });
        
        // Apply filter with animation
        setTimeout(() => {
          workItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
              item.style.display = 'block';
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              }, 50);
            } else {
              item.style.opacity = '0';
              item.style.transform = 'scale(0.8)';
              setTimeout(() => {
                item.style.display = 'none';
              }, 300);
            }
          });
        }, 100);
      });
    });
    
    // Add image lightbox functionality
    workItems.forEach(item => {
      const projectLink = item.querySelector('.work-overlay a');
      const image = item.querySelector('img');
      
      if (projectLink && image) {
        projectLink.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Create lightbox
          const lightbox = document.createElement('div');
          lightbox.className = 'lightbox';
          
          const lightboxContent = document.createElement('div');
          lightboxContent.className = 'lightbox-content';
          
          const lightboxImage = document.createElement('img');
          lightboxImage.src = image.src;
          lightboxImage.alt = image.alt;
          
          const closeButton = document.createElement('button');
          closeButton.className = 'lightbox-close';
          closeButton.innerHTML = '<i class="fas fa-times"></i>';
          
          const projectTitle = document.createElement('h3');
          projectTitle.textContent = item.querySelector('h3').textContent;
          
          const projectDesc = document.createElement('p');
          projectDesc.textContent = item.querySelector('p').textContent;
          
          // Assemble lightbox
          lightboxContent.appendChild(lightboxImage);
          lightboxContent.appendChild(projectTitle);
          lightboxContent.appendChild(projectDesc);
          lightboxContent.appendChild(closeButton);
          lightbox.appendChild(lightboxContent);
          document.body.appendChild(lightbox);
          
          // Prevent body scrolling
          document.body.style.overflow = 'hidden';
          
          // Add animation
          setTimeout(() => {
            lightbox.classList.add('active');
          }, 10);
          
          // Close on button click
          closeButton.addEventListener('click', () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
              document.body.removeChild(lightbox);
              document.body.style.overflow = '';
            }, 300);
          });
          
          // Close on click outside content
          lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
              lightbox.classList.remove('active');
              setTimeout(() => {
                document.body.removeChild(lightbox);
                document.body.style.overflow = '';
              }, 300);
            }
          });
        });
      }
    });
  }
  
  // Enhanced Contact Form with validation and security
  function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    const notification = document.getElementById('form-notification');
    
    if (!contactForm || !formInputs.length) return;
    
    // Add aria-invalid attribute to all required inputs
    formInputs.forEach(input => {
        if (input.hasAttribute('required')) {
            input.setAttribute('aria-invalid', 'false');
        }
        
        // Add focus effects
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
            // Validate on blur
            validateInput(input);
        });
        
        // Remove error on input
        input.addEventListener('input', () => {
            const errorElement = document.getElementById(`${input.id}-error`);
            if (errorElement) {
                errorElement.textContent = '';
                input.setAttribute('aria-invalid', 'false');
            }
        });
    });
    
    // Form submission with validation and security
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const formData = new FormData(contactForm);
            const sanitizedData = {};
            
            // Sanitize all inputs
            for (let [key, value] of formData.entries()) {
                sanitizedData[key] = DOMPurify.sanitize(value.trim());
            }
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
            
            try {
                // Simulate API call (replace with actual API endpoint in production)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Success state
                showNotification('success', 'Thank you! Your message has been sent successfully.');
                contactForm.reset();
                formInputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                    input.setAttribute('aria-invalid', 'false');
                });
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('error', 'Sorry, there was an error sending your message. Please try again.');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message';
            }
        }
    });
    
    // Validate individual input
    function validateInput(input) {
        const errorElement = document.getElementById(`${input.id}-error`);
        let isValid = true;
        let errorMessage = '';
        
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (input.type === 'email' && input.value.trim()) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value.trim())) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        if (errorElement) {
            errorElement.textContent = errorMessage;
            input.setAttribute('aria-invalid', !isValid);
        }
        
        return isValid;
    }
    
    // Validate entire form
    function validateForm() {
        let isValid = true;
        
        formInputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Show notification message
    function showNotification(type, message) {
        if (!notification) return;
        
        notification.className = `form-notification ${type}`;
        notification.textContent = message;
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
            notification.className = 'form-notification';
            notification.textContent = '';
        }, 5000);
    }
  }
  
  // Smooth Scrolling for anchor links
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        // Close mobile menu if open
        const mainNav = document.querySelector('.main-nav');
        if (mainNav.classList.contains('active')) {
          mainNav.classList.remove('active');
          document.querySelector('.mobile-toggle').setAttribute('aria-expanded', 'false');
        }
        
        // Calculate header height for offset
        const headerHeight = document.querySelector('header').offsetHeight;
        
        // Scroll to target with offset
        window.scrollTo({
          top: targetElement.offsetTop - headerHeight,
          behavior: 'smooth'
        });
      });
    });

  }