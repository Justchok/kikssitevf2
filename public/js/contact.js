document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                // Send form data to server
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    // Show success message
                    Swal.fire({
                        title: translations['successTitle'][getCurrentLanguage()],
                        text: translations['successMessage'][getCurrentLanguage()],
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });

                    // Clear form
                    contactForm.reset();
                } else {
                    throw new Error(data.error || 'Error sending message');
                }
            } catch (error) {
                // Show error message
                Swal.fire({
                    title: translations['errorTitle'][getCurrentLanguage()],
                    text: translations['errorMessage'][getCurrentLanguage()],
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        });
    }
});
