<template>
  <div class="bg-remover">
    <button 
      :disabled="!canvas || processing"
      @click="removeBackground"
      class="bg-remove-btn"
    >
      <span v-if="processing" class="spinner"></span>
      <span>{{ processing ? 'Loading...' : 'Remove Background' }}</span>
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'BackgroundRemover',
  props: {
    canvas: {
      type: HTMLCanvasElement,
      required: true
    }
  },
  data() {
    return {
      processing: false,
      error: null,
      apiUrl: process.env.VUE_APP_API_URL || 'http://localhost:3000/api/remove-bg'
    };
  },
  methods: {
    async removeBackground() {
      if (!this.canvas) return;
      this.processing = true;
      this.error = null;

      try {
        // Export canvas to blob
        const blob = await new Promise((resolve, reject) => {
          this.canvas.toBlob(b => {
            if (!b) reject(new Error('Canvas conversion failed'));
            else resolve(b);
          }, 'image/png');
        });

        // Send to backend
        const formData = new FormData();
        formData.append('image', blob, 'canvas.png');

        const response = await fetch(this.apiUrl, {
          method: 'POST',
          body: formData
        });

        const arrayBuffer = await response.arrayBuffer();

        if (!response.ok) {
          const errorObj = JSON.parse(new TextDecoder().decode(arrayBuffer));
          throw new Error(errorObj.error || 'Background removal failed');
        }

        this.applyBlobToCanvas(new Blob([arrayBuffer], { type: 'image/png' }));
        this.$emit('processed');
      } catch (err) {
        this.error = err.message;
        this.$emit('error', err.message);
      } finally {
        this.processing = false;
      }
    },

    applyBlobToCanvas(blob) {
      const img = new Image();
      img.onload = () => {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };
      img.onerror = () => {
        this.error = 'Failed to load processed image';
      };
      img.src = URL.createObjectURL(blob);
    }
  }
};
</script>

<style scoped>
.bg-remove-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #52c0a2;
  color: #000;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.bg-remove-btn:hover:not(:disabled) {
  background: #3fa88c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(82, 192, 162, 0.4);
}

.bg-remove-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.bg-remove-btn:disabled {
  background: #555;
  color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
}

.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #000;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


</style>
