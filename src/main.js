import Alpine from 'alpinejs';
import confetti from 'canvas-confetti';

window.Alpine = Alpine;

Alpine.data('formApp', () => ({
  uuid: null,
  formSchema: null,
  formData: {},
  formLoaded: false,

  async init() {
    // Extract UUID from URL
    this.uuid = window.location.pathname.split('/').pop();
    
    try {
      // Fetch form schema from backend
      const response = await fetch(`/api/form-schema/${this.uuid}`);
      this.formSchema = await response.json();
      
      // Initialize form data based on schema
      Object.keys(this.formSchema.properties).forEach(key => {
        this.formData[key] = null;
      });
      
      this.formLoaded = true;
    } catch (error) {
      console.error('Failed to load form schema:', error);
      alert('Failed to load form. Please try again later.');
    }
  },

  async submitForm() {
    try {
      const response = await fetch(`/api/submit-form/${this.uuid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.formData)
      });

      if (response.ok) {
        // Trigger confetti on successful submission
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        alert('Form submitted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Submission failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit form. Please try again.');
    }
  }
}));

Alpine.start();
