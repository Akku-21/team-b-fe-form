import Alpine from 'alpinejs';
import confetti from 'canvas-confetti';
import { apiClient } from './services/apiClient';
import type * as types from './types/openapi';

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
      // Fetch form schema from backend using apiClient
      const response = await apiClient.paths['/api/validate/{uuid}'].get({
        path: { uuid: this.uuid }
      });
      
      if (response.status === 200) {
        this.formSchema = response.data.jsonSchema;
        
        // Initialize form data based on schema
        Object.keys(this.formSchema.properties).forEach(key => {
          this.formData[key] = null;
        });
        
        this.formLoaded = true;
      } else {
        console.error('Failed to validate UUID:', response.data.message);
        alert('Failed to load form. Please try again later.');
      }
    } catch (error) {
      console.error('Failed to load form schema:', error);
      alert('Failed to load form. Please try again later.');
    }
  },

  async submitForm() {
    try {
      const response = await apiClient.paths['/api/create'].post({
        requestBody: {
          uuid: this.uuid,
          jsonSchema: this.formSchema,
          expiresAt: new Date().toISOString() // Set a future expiration date
        }
      });

      if (response.status === 201) {
        // Trigger confetti on successful submission
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        alert('Form submitted successfully!');
      } else {
        console.error('Form submission error:', response.data);
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to submit form. Please try again.');
    }
  }
}));

Alpine.start();
