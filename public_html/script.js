document.addEventListener("DOMContentLoaded", function() {
  const notifyButton = document.querySelector('.notify-button');
  const emailInput = document.querySelector('.search-box');

  // Handle button click
  notifyButton.addEventListener('click', function(event) {
    event.preventDefault();  // Prevent form submission

    const email = emailInput.value;

    if (validateEmail(email)) {
      sendEmail(email);  // Send email to backend
    } else {
      alert('Please enter a valid email address.'); // Show custom error message
    }
  });

  // Simple email validation function
  function validateEmail(email) {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
  }

  // Function to send email to backend via AJAX
  function sendEmail(email) {
    fetch('/submit-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert(data.message);  // Show success message or custom error message
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to submit email. Please try again.');
    });
  }
});

//hamburger 
document.getElementById("hamburger-icon").addEventListener("click", function() {
  var navLinks = document.getElementById("nav-links");
  navLinks.classList.toggle("active");  // Toggles the 'active' class to show/hide the menu
});


