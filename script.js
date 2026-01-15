// ===========================
// LIFECYCLE CIRCULAR DIAGRAM
// ===========================

const lifecycleSteps = document.querySelectorAll('.lifecycle-step');
const navbarEl = document.querySelector('.navbar');

function getHeaderOffset() {
    return ((navbarEl && navbarEl.offsetHeight) ? navbarEl.offsetHeight : 0) + 12;
}

function scrollToElement(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top - getHeaderOffset();
    window.scrollTo({ top, behavior: 'smooth' });
}

lifecycleSteps.forEach(step => {
    const stepButton = step;
    const stepNumber = step.getAttribute('data-step');
    
    // Click handler
    stepButton.addEventListener('click', function(e) {
        e.preventDefault();
        handleLifecycleStepClick(stepNumber);
    });

    // Keyboard navigation
    stepButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleLifecycleStepClick(stepNumber);
        }
    });

    // Mouse enter/leave for visual feedback
    stepButton.addEventListener('mouseenter', function() {
        highlightFlowToStep(stepNumber);
    });

    stepButton.addEventListener('mouseleave', function() {
        clearFlowHighlight();
    });
});

function handleLifecycleStepClick(stepNumber) {
    // Find the corresponding cycle step card and click it
    const cycleStep = document.querySelector(`.cycle-step[data-step="${stepNumber}"]`);
    if (cycleStep) {
        const button = cycleStep.querySelector('.step-button');
        if (button) {
            button.click();
            // Scroll to the card
            setTimeout(() => {
                scrollToElement(cycleStep);
            }, 120);
        }
    }

    // Update aria-expanded
    const lifecycleStep = document.querySelector(`.lifecycle-step[data-step="${stepNumber}"]`);
    if (lifecycleStep) {
        const isExpanded = lifecycleStep.getAttribute('aria-expanded') === 'true';
        lifecycleStep.setAttribute('aria-expanded', !isExpanded);
    }
}

function highlightFlowToStep(stepNumber) {
    // Optional: Add visual highlighting of the flow
    const lifecycleStep = document.querySelector(`.lifecycle-step[data-step="${stepNumber}"]`);
    if (lifecycleStep) {
        lifecycleStep.style.filter = 'brightness(1.15)';
    }
}

function clearFlowHighlight() {
    lifecycleSteps.forEach(step => {
        step.style.filter = '';
    });
}

// ===========================
// MOBILE MENU TOGGLE
// ===========================

const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Update aria-expanded attribute
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when a nav link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===========================
// ACCORDION: CYCLE STEPS
// ===========================

const cycleSteps = document.querySelectorAll('.cycle-step');

cycleSteps.forEach(step => {
    const button = step.querySelector('.step-button');
    const content = step.querySelector('.step-content');

    if (button && content) {
        button.addEventListener('click', function () {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            // Close all other steps
            cycleSteps.forEach(otherStep => {
                if (otherStep !== step) {
                    const otherButton = otherStep.querySelector('.step-button');
                    const otherContent = otherStep.querySelector('.step-content');
                    if (otherButton && otherContent) {
                        otherButton.setAttribute('aria-expanded', 'false');
                        otherContent.hidden = true;
                    }
                }
            });

            // Toggle current step
            button.setAttribute('aria-expanded', !isExpanded);
            content.hidden = isExpanded;

            // Scroll into view if opening
            if (!isExpanded) {
                setTimeout(() => {
                    scrollToElement(step);
                }, 120);
            }
        });

        // Keyboard navigation (Enter/Space to expand)
        button.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    }
});

// ===========================
// ACCORDION: MISTAKE CARDS
// ===========================

const mistakeCards = document.querySelectorAll('.mistake-card');

mistakeCards.forEach(card => {
    const button = card.querySelector('.mistake-toggle');
    const content = card.querySelector('.mistake-content');

    if (button && content) {
        button.addEventListener('click', function () {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';

            // Close all other mistake cards
            mistakeCards.forEach(otherCard => {
                if (otherCard !== card) {
                    const otherButton = otherCard.querySelector('.mistake-toggle');
                    const otherContent = otherCard.querySelector('.mistake-content');
                    if (otherButton && otherContent) {
                        otherButton.setAttribute('aria-expanded', 'false');
                        otherContent.hidden = true;
                    }
                }
            });

            // Toggle current card
            button.setAttribute('aria-expanded', !isExpanded);
            content.hidden = isExpanded;

            // Scroll into view if opening
            if (!isExpanded) {
                setTimeout(() => {
                    button.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        });

        // Keyboard navigation (Enter/Space to expand)
        button.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    }
});

// ===========================
// QUIZ FUNCTIONALITY
// ===========================

const quizForm = document.getElementById('quick-quiz');
const quizFeedback = document.getElementById('quiz-feedback');

if (quizForm) {
    quizForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const q1 = document.querySelector('input[name="q1"]:checked')?.value;
        const q2 = document.querySelector('input[name="q2"]:checked')?.value;
        const q3 = document.querySelector('input[name="q3"]:checked')?.value;

        // Check if all questions answered
        if (!q1 || !q2 || !q3) {
            quizFeedback.textContent = 'Please answer all questions before submitting.';
            quizFeedback.className = 'error';
            quizFeedback.setAttribute('role', 'alert');
            return;
        }

        // Check answers
        const correctAnswers = [q1, q2, q3].filter(answer => answer === 'correct').length;
        const totalQuestions = 3;

        // Provide feedback
        if (correctAnswers === totalQuestions) {
            quizFeedback.innerHTML = `
                <div>🎉 Perfect! You got all ${totalQuestions} questions correct!</div>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">You understand the Program Development Cycle well. Keep this knowledge with you throughout your programming journey!</p>
            `;
            quizFeedback.className = 'success';
        } else {
            const percentage = Math.round((correctAnswers / totalQuestions) * 100);
            quizFeedback.innerHTML = `
                <div>You got ${correctAnswers} out of ${totalQuestions} correct (${percentage}%)</div>
                <p style="margin-top: 0.5rem; font-size: 0.9rem;">Review the sections above to strengthen your understanding of the development cycle.</p>
            `;
            quizFeedback.className = percentage >= 67 ? 'success' : 'error';
        }

        quizFeedback.setAttribute('role', 'alert');

        // Scroll feedback into view
        setTimeout(() => {
            quizFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    });
}

// ===========================
// KEYBOARD ACCESSIBILITY
// ===========================

// Close mobile menu when Escape is pressed
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
    }
});

// ===========================
// FOCUS MANAGEMENT
// ===========================

// Enhance focus visibility for interactive elements
const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');

interactiveElements.forEach(element => {
    element.addEventListener('focus', function () {
        // Visual feedback is handled by CSS outline
    });

    element.addEventListener('blur', function () {
        // Visual feedback is handled by CSS outline
    });
});

// ===========================
// HEADING ANCHOR LINKS
// ===========================

// Create anchor links for all headings for easy sharing and navigation
const headings = document.querySelectorAll('h2[id], h3[id]');

headings.forEach(heading => {
    const id = heading.getAttribute('id');
    if (!id) return;

    const link = document.createElement('a');
    link.href = `#${id}`;
    link.className = 'heading-anchor';
    link.setAttribute('aria-label', `Link to ${heading.textContent}`);
    link.textContent = '🔗';

    heading.appendChild(link);
});

const style = document.createElement('style');
style.textContent = `
    .heading-anchor {
        margin-left: 0.5rem;
        font-size: 0.8em;
        opacity: 0;
        transition: opacity 0.2s ease;
        text-decoration: none;
        color: #667eea;
    }

    h2:hover .heading-anchor,
    h3:hover .heading-anchor {
        opacity: 1;
    }

    .heading-anchor:focus {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// ===========================
// INITIALIZATION MESSAGE
// ===========================

console.log('Program Development Cycle interactive website loaded successfully!');
console.log('Accessibility features enabled:');
console.log('- Keyboard navigation (Tab, Enter, Space, Escape)');
console.log('- ARIA labels and roles');
console.log('- Focus management');
console.log('- Screen reader support');
console.log('- Mobile responsive design');
