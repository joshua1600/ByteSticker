<template>
  <div class="app">
    <!-- Header Section -->
    <header class="top-section">
      <img src="BYTESticker.png" alt="Logo" class="logo" />
      <h1 class="website-title">ByteSticker</h1>
    </header>

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- File Upload Section -->
      <div class="upload-section">
        <input 
          type="file" 
          accept="image/*" 
          @change="handleFileUpload"
          class="upload-input"
        />

        <!-- Guide -->
        <img
          :src="tutorialIcon"
          alt="Tutorial"
          class="tutorial-icon"
          @click="showTutorial = true"
        />
      </div>

      <!-- Image Processing Section -->
      <div class="processing-section">
        <!-- Cropper Interface -->
        <div v-if="showCropper" class="cropper-wrapper">
          <div class="cropper-container">
            <img 
              ref="cropperImage" 
              :src="uploadedImageUrl" 
              alt="Image to crop"
              class="cropper-image"
              style="max-width: 100%; max-height: 60vh; object-fit: contain;"
            />
          </div>
          <div class="cropper-controls">
            <button @click="cropImage" class="action-btn primary">
              Confirm Crop
            </button>
          </div>
        </div>
        <!-- Image Action Buttons -->
        <div v-else-if="originalFile" class="action-group">
          <button @click="activateCropper" class="action-btn secondary">
            <i class="icon-crop"></i> Crop
          </button>
          <BackgroundRemover
            :image="originalFile"
            :canvas="canvas"
            @processed="handleBackgroundRemoved"
            class="action-btn secondary"
          >
            <i class="icon-bg-remove"></i> Remove Background
          </BackgroundRemover>
        </div>
      </div>

      <!-- Canvas Area -->
      <div class="canvas-container">
        <div class="drag-zone" ref="dragZone">
          <canvas ref="canvas" width="240" height="240" class="main-canvas"></canvas>
          <div
            class="text-box"
            :style="textBoxStyles"
            @mousedown="startDrag"
            @mousemove="handleDrag"
            @mouseup="stopDrag"
            @mouseleave="stopDrag"

            @touchstart.prevent="startDrag"
            @touchmove.prevent="handleDrag"
            @touchend.prevent="stopDrag"
            @touchcancel.prevent="stopDrag"
          >
            <span class="text-content" :style="textContentStyles">
              {{ formattedText }}
            </span>
          </div>
        </div>
      </div>

      <!-- Text Controls -->
      <div class="controls-section">
        <div class="text-controls card">
          <h3 class="controls-title">Text Customization</h3>
          
          <div class="control-group">
            <label class="control-label">Text Content</label>
            <input
              v-model="text"
              type="text"
              placeholder="Enter your text here"
              class="text-input"
            />
          </div>

          <div class="control-row">
            <div class="control-group">
              <label class="control-label">Font Size</label>
              <div class="range-group">
                <input 
                  type="range" 
                  v-model.number="fontSize" 
                  min="10" 
                  max="50" 
                  class="range-input"
                />
                <span class="range-value">{{ fontSize }}px</span>
              </div>
            </div>

            <div class="control-group">
              <label class="control-label">Text Color</label>
              <input type="color" v-model="fontColor" class="color-input" />
            </div>
          </div>

          <div class="control-row">
            <div class="control-group">
              <label class="control-label">
                <input 
                  type="checkbox" 
                  v-model="showFontPicker" 
                  class="checkbox-input"
                />
                Change Font Style
              </label>
            </div>

            <div v-if="showFontPicker" class="control-group">
              <label class="control-label">Font Family</label>
              <select v-model="fontStyle" class="select-input">
                <option
                  v-for="font in fontOptions"
                  :key="font.value"
                  :value="font.value"
                >
                  {{ font.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button 
          @click="downloadSticker"
          :disabled="!image"
          class="download-btn"
        >
          <span class="btn-text">Download Sticker</span>
          <span class="download-icon">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
          </span>
        </button>
        <button 
          @click="copyToClipboard"
          :disabled="!image || isCopying"
          class="action-btn secondary large"
        >
          <i class="icon-copy"></i> 
          {{ isCopying ? 'Copying...' : 'Copy to Clipboard' }}
        </button>
      </div>

      <!-- Share Sticker -->
      <button
          @click="shareSticker"
          :disabled="!image"
          class="icon-btn"
          title="Share Sticker"
        >
          <img src="@/assets/Share-icon.png" alt="Share" class="share-icon" />
        </button>


      <!-- Toast Notification -->
      <div class="toast-container">
        <div 
          v-if="toastMessage" 
          class="toast"
          @click="toastMessage = ''"
        >
          {{ toastMessage }}
        </div>
      </div>
    </main>

    <!-- About Us Section -->
    <footer class="about-us">
      <div class="about-container">
        <div class="about-content">
          <h2>About ByteSticker</h2>
          <p>
            Welcome to ByteSticker! Our mission is to empower creativity by providing a 
            seamless platform to design and customise stickers for your social media needs.
          </p>
        </div>
        <div class="about-links">
          <h3>Explore the ByteSticker</h3>
          <ul>
            <li><a href="#" @click.prevent="showTutorial = true">Tutorial</a></li>
            <li><a href="#" @click.prevent="showFeatures = true">Features</a></li>
            <li><a href="#" @click.prevent="showContact = true">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 ByteSticker. All rights reserved.</p>
      </div>
    </footer>

    <!-- Modals -->
    <InfoModal
      v-if="showTutorial"
      title="How to Use ByteSticker"
      @close="showTutorial = false"
    >
      <ol>
        <li><strong>Upload:</strong> Select any image from your device.</li>
        <li><strong>Crop:</strong> Frame your sticker using the crop tool.</li>
        <li><strong>Remove Background:</strong> Click the button to remove image background.</li>
        <li><strong>Customize:</strong> Add and style your text.</li>
        <li><strong>Export:</strong> Download or share directly.</li>
      </ol>
      <p class="tip">💡 High-contrast images + short text = best sticker!</p>
    </InfoModal>

    <InfoModal
      v-if="showFeatures"
      title="ByteSticker Features"
      @close="showFeatures = false"
    >
      <ul>
        <li>🌟 Easy Upload</li>
        <li>✂️ Smart Crop</li>
        <li>🧼 One-Click Background Removal</li>
        <li>🎨 Text Styling & Drag-Drop</li>
        <li>📱 Native Share & Dark Mode</li>
        <li>📤 Download & Copy To Clipboard</li>
      </ul>
    </InfoModal>

    <InfoModal
      v-if="showContact"
      title="Contact Us"
      @close="showContact = false"
    >
      <p>We’d love to hear from you:</p>
      <ul>
        <li>Location: <a>Level 5, Menara ABC, 123 Jalan Tun Razak, 50400 Kuala Lumpur, Wilayah Persekutuan, Malaysia.
        </a></li>
        <li>Email: <a>support@bytesticker.com</a></li>
        <li>Contact: <a>+603-1234 5678</a></li>
      </ul>
    </InfoModal>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted, nextTick, computed, toRefs } from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import BackgroundRemover from './components/BackgroundRemover.vue';
import InfoModal from './components/InfoModal.vue';
import tutorialIcon from '@/assets/tutorial-icon.png';


export default {
  components: {
    BackgroundRemover,
    InfoModal
  },
  setup() {
    // DOM References
    const canvas = ref(null);
    const dragZone = ref(null);
    const cropperImage = ref(null);

    const shareText = 'Here’s my ByteSticker:';
    const currentUrl = window.location.href;
    const shareTextWithUrl = `${shareText} ${currentUrl}`;


    const showTutorial = ref(false)
    const showFeatures = ref(false)
    const showContact = ref(false)

    // Reactive State
    const state = reactive({
      // Image Handling
      originalFile: null,
      uploadedImageUrl: null,
      originalImageUrl: null,
      image: null,
      showCropper: false,
      cropperInstance: null,

      // Text Styling
      text: 'Edit Text',
      fontSize: 20,
      fontColor: '#FFFFFF',
      fontStyle: 'Montserrat, sans-serif',
      showFontPicker: false,
      fontOptions: [
      { label: 'Montserrat',      value: 'Montserrat, sans-serif' },
      { label: 'Pacifico',        value: 'Pacifico, cursive' },
      { label: 'Open Sans',       value: '"Open Sans", sans-serif' },
      { label: 'Raleway',         value: 'Raleway, sans-serif' },
      { label: 'Lobster',         value: 'Lobster, cursive' },
      { label: 'Playfair Display',value: '"Playfair Display", serif' },
      { label: 'Roboto',          value: 'Roboto, sans-serif' },
      { label: 'Tangerine',       value: 'Tangerine, cursive' },
      { label: 'Ma Shan Zheng',   value: '"Ma Shan Zheng", cursive' },
      { label: 'Mouse Memoirs',   value: '"Mouse Memoirs", sans-serif' }
      ],

      // Text Positioning
      textPosition: { x: 10, y: 10 },
      textBoxWidth: 150,
      textBoxHeight: 50,
      dragging: false,
      dragOffset: { x: 0, y: 0 },
      formattedText: '',

      isCopying: false,
      toastMessage: ''
    });

    // Computed Styles
    const textBoxStyles = computed(() => ({
      left: `${state.textPosition.x}px`,
      top: `${state.textPosition.y}px`,
      width: `${state.textBoxWidth}px`,
      height: `${state.textBoxHeight}px`,
      fontSize: `${state.fontSize}px`
    }));

    const textContentStyles = computed(() => ({
      fontSize: `${state.fontSize}px`,
      color: state.fontColor,
      fontFamily: state.fontStyle,
      lineHeight: '1.2'
    }));
    

    // Image Handling Methods
    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Reset processing state
      if (state.cropperInstance) {
        state.cropperInstance.destroy();
        state.cropperInstance = null;
      }
      
      state.showCropper = false;
      state.originalFile = file;
      
      // Clear previous state
      const ctx = canvas.value.getContext('2d');
      ctx.clearRect(0, 0, 240, 240);

      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 240, 240);
        state.image = img;
        state.currentImageUrl = url;
        state.uploadedImageUrl = url;
      };
      img.src = url;
    };

    const initializeCropper = () => {
      if (!cropperImage.value) return;
      if (state.cropperInstance) state.cropperInstance.destroy();
      
      state.cropperInstance = new Cropper(cropperImage.value, {
        aspectRatio: 1,
        viewMode: 1, 
        autoCropArea: 1, 
        background: false,
        zoomOnWheel: true,
        minContainerWidth: 300,
        minContainerHeight: 300,
        responsive: true,
        checkCrossOrigin: false,
        ready() {
          const containerRatio = this.cropper.containerData.width / this.cropper.containerData.height;
          const imageRatio = this.cropper.imageData.width / this.cropper.imageData.height;
          
          if (imageRatio > containerRatio) {
            this.cropper.scaleX(this.cropper.containerData.width / this.cropper.imageData.naturalWidth);
            this.cropper.scaleY(this.cropper.containerData.width / this.cropper.imageData.naturalWidth);
          } else {
            this.cropper.scaleX(this.cropper.containerData.height / this.cropper.imageData.naturalHeight);
            this.cropper.scaleY(this.cropper.containerData.height / this.cropper.imageData.naturalHeight);
          }
          
          // Reset crop area to full container
          this.cropper.setCropBoxData({
            width: this.cropper.containerData.width,
            height: this.cropper.containerData.height
          });
        }
      });
    };

    const activateCropper = () => {
      const currentCanvas = canvas.value;
      const url = currentCanvas.toDataURL();
      state.uploadedImageUrl = url;
      state.showCropper = true;
      nextTick(initializeCropper);
    };

    const cropImage = () => {
      if (!state.cropperInstance) return;
      
      const currentCanvas = canvas.value;
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      
      tempCanvas.width = 240;
      tempCanvas.height = 240;
      
      tempCtx.drawImage(currentCanvas, 0, 0);

      state.cropperInstance.getCroppedCanvas({
        width: 240,
        height: 240
      }).toBlob(blob => {
        const croppedFile = new File([blob], "processed.png", {
          type: "image/png",
          lastModified: Date.now()
        });

        state.originalFile = croppedFile;
        const url = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
          const ctx = canvas.value.getContext('2d');
          ctx.clearRect(0, 0, 240, 240);
          const scale = Math.min(240 / img.width, 240 / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          const x = (240 - w) / 2;
          const y = (240 - h) / 2;

          ctx.clearRect(0, 0, 240, 240);
          ctx.drawImage(img, x, y, w, h);
          state.image = img;
          state.currentImageUrl = url;
        };
        img.src = url;
      });

      state.showCropper = false;
      state.cropperInstance.destroy();
      state.cropperInstance = null;
    };
  
  
    // Background Removal Handler
    const handleBackgroundRemoved = (processedBlob) => {
      if (!processedBlob) {
        showToast('Background removal failed');
        return;
      }
      
      // Create new File from processed blob
      state.originalFile = new File([processedBlob], "processed.png", {
        type: "image/png",
        lastModified: Date.now()
      });

      // Update both current image URL and canvas
      const url = URL.createObjectURL(processedBlob);
      state.currentImageUrl = url;
      
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.value.getContext('2d');
        ctx.clearRect(0, 0, 240, 240);
        ctx.drawImage(img, 0, 0, 240, 240);
        state.image = img;
      };
      img.src = url;
    };

    // Drag & Drop Handlers
    const getXY = (event) => {
      if (event.touches && event.touches.length) {
        return { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }
      return { x: event.clientX, y: event.clientY };
    };

    const startDrag = (event) => {
      state.dragging = true;
      const { x, y } = getXY(event);
      const rect = dragZone.value.getBoundingClientRect();
      state.dragOffset.x = x - rect.left  - state.textPosition.x;
      state.dragOffset.y = y - rect.top   - state.textPosition.y;
    };

    const handleDrag = (event) => {
      if (!state.dragging) return;
      const { x, y } = getXY(event);
      const rect = dragZone.value.getBoundingClientRect();
      let newX = x - rect.left - state.dragOffset.x;
      let newY = y - rect.top  - state.dragOffset.y;
      
      state.textPosition.x = Math.max(0, Math.min(newX, 240 - state.textBoxWidth));
      state.textPosition.y = Math.max(0, Math.min(newY, 240 - state.textBoxHeight));
    };

    const stopDrag = () => {
      state.dragging = false;
    };


    // Text Box Calculations
    const updateTextBoxSize = () => {
      const context = document.createElement('canvas').getContext('2d');
      context.font = `${state.fontSize}px ${state.fontStyle}`;
      
      // Text wrapping logic
      const maxWidth = 240 - 20; // 10px padding on both sides
      const words = state.text.split(' ');
      let lines = [];
      let currentLine = '';

      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = context.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      
      lines.push(currentLine);
      state.formattedText = lines.join('\n');

      // Calculate dimensions
      state.textBoxWidth = Math.min(
        240, 
        context.measureText(lines[0]).width + 20
      );
      
      state.textBoxHeight = lines.length * state.fontSize * 1.2 + 20;
    };

    const downloadSticker = () => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = 240;
      tempCanvas.height = 240;
      
      tempCtx.drawImage(canvas.value, 0, 0);
      
      tempCtx.font = `${state.fontSize}px ${state.fontStyle}`;
      tempCtx.fillStyle = state.fontColor;
      const lines = state.formattedText.split('\n');
      lines.forEach((line, index) => {
        const x = state.textPosition.x + 10;
        const y = state.textPosition.y + (index + 1) * state.fontSize * 1.2;
        tempCtx.fillText(line, x, y);
      });

      const link = document.createElement('a');
      link.download = 'sticker.png';
      link.href = tempCanvas.toDataURL('image/png');
      link.click();
    };

    // Clipboard
    const copyToClipboard = async () => {
      if (state.isCopying) return;
      state.isCopying = true;
      
      try {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = 240;
        tempCanvas.height = 240;
        
        tempCtx.drawImage(canvas.value, 0, 0);
        
        tempCtx.font = `${state.fontSize}px ${state.fontStyle}`;
        tempCtx.fillStyle = state.fontColor;
        const lines = state.formattedText.split('\n');
        lines.forEach((line, index) => {
          const x = state.textPosition.x + 10;
          const y = state.textPosition.y + (index + 1) * state.fontSize * 1.2;
          tempCtx.fillText(line, x, y);
        });

        tempCanvas.toBlob(async (blob) => {
          try {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            showToast('Sticker copied to clipboard! 📋');
          } catch (err) {
            console.error('Clipboard write failed:', err);
            showToast('Failed to copy to clipboard 😢');
          } finally {
            state.isCopying = false;
          }
        }, 'image/png');
      } catch (error) {
        console.error('Clipboard error:', error);
        showToast('Clipboard access not supported ❌');
        state.isCopying = false;
      }
    };

    //Share Button
    const shareSticker = () => {
      if (!canvas.value) return;

      const temp = document.createElement('canvas');
      temp.width = 240;
      temp.height = 240;
      const ctx = temp.getContext('2d');

      ctx.clearRect(0, 0, 240, 240);
      ctx.drawImage(canvas.value, 0, 0);
      ctx.font = `${state.fontSize}px ${state.fontStyle}`;
      ctx.fillStyle = state.fontColor;

      const lines = state.formattedText.split('\n');
      lines.forEach((line, i) => {
        const x = state.textPosition.x + 10;
        const y = state.textPosition.y + (i + 1) * state.fontSize * 1.2;
        ctx.fillText(line, x, y);
      });

      temp.toBlob(async blob => {
        if (!blob) return;
        const file = new File([blob], 'sticker.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'My ByteSticker',
              text: shareTextWithUrl,
            });
          } catch (err) {
            console.warn('Native share failed:', err);
          }
        } else {
          alert('Sharing is not supported on this device.');
        }
      });
    };

    const drawCanvas = (ctx, includeText = false) => {
      ctx.clearRect(0, 0, 240, 240);
      
      if (state.image) {
        ctx.drawImage(state.image, 0, 0, 240, 240);
      }

      if (includeText) {
        ctx.font = `${state.fontSize}px ${state.fontStyle}`;
        ctx.fillStyle = state.fontColor;
        const lines = state.formattedText.split('\n');
        lines.forEach((line, index) => {
          const x = state.textPosition.x + 10;
          const y = state.textPosition.y + (index + 1) * state.fontSize * 1.2;
          ctx.fillText(line, x, y);
        });
      }
    };

    const showToast = (message) => {
      state.toastMessage = message;
      setTimeout(() => {
        state.toastMessage = '';
      }, 3000);
    };

    // Watchers
    watch(
      () => [state.text, state.fontSize, state.fontStyle],
      updateTextBoxSize
    );

    // Lifecycle Hooks
    onMounted(() => {
      updateTextBoxSize();
    });
    

    // Expose to template
    return {
      // DOM Refs
      canvas,
      dragZone,
      cropperImage,

      // State
      ...toRefs(state),

      // Computed
      textBoxStyles,
      textContentStyles,

      // Methods
      handleFileUpload,
      initializeCropper,
      activateCropper,
      cropImage,
      handleBackgroundRemoved,
      startDrag,
      handleDrag,
      stopDrag,
      drawCanvas,
      copyToClipboard,
      showToast,
      downloadSticker,
      shareSticker,
      showTutorial,
      showFeatures,
      showContact,
      tutorialIcon,
    };
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: #121212;
  color: #ffffff;
}

/* Header Styles */
.top-section {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1a1a1a;
  border-bottom: 1px solid #2d2d2d;
}

.logo {
  height: 48px;
  margin-right: 1rem;
}

.website-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #e0e0e0;
}

/* Main Content Layout */
.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.upload-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.upload-input {
  flex: none;
  width: 70%;    
  max-width: 300px;
  min-width: 150px;
}

.upload-input:hover {
  border-color: #2196F3;
  background: #252525;
}

.tutorial-icon {
  width: 32px;
  height: 32px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s, transform 0.2s;
  flex-shrink: 0;
}
.tutorial-icon:hover {
  opacity: 1;
  transform: scale(1.1);
}

@media (max-width: 480px) {
  .upload-section {
    flex-direction: column;
    gap: 1rem;
  }
  .tutorial-icon {
    margin-top: 0.5rem;
  }
}

/* Canvas Container */
.canvas-container {
  margin: 2rem 0;
  text-align: center;
}

.drag-zone {
  display: inline-block;
  position: relative;
  border: 2px solid #404040;
  border-radius: 12px;
  background: #1e1e1e;
  overflow: hidden;
}

.main-canvas {
  display: block;
  border-radius: 8px;
}

/* Text Controls Card */
.controls-section {
  margin: 2rem 0;
}

.card {
  background: #1e1e1e;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.controls-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #e0e0e0;
}

/* Control Group Layout */
.control-row {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-bottom: 1.5rem;
}

.control-group {
  margin-bottom: 1rem;
}

.control-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #a0a0a0;
}

/* Input Styling */
.text-input {
  width: 100%;
  padding: 0.75rem;
  background: #2d2d2d;
  border: 1px solid #404040;
  border-radius: 6px;
  color: inherit;
  transition: border-color 0.2s ease;
}

.text-input:focus {
  outline: none;
  border-color: #2196F3;
}

.range-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.range-input {
  flex: 1;
  height: 4px;
  background: #404040;
  border-radius: 2px;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #2196F3;
  border-radius: 50%;
  cursor: pointer;
}

.range-value {
  min-width: 50px;
  text-align: center;
  font-weight: 500;
}

.color-input {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 2px;
}

.color-input::-webkit-color-swatch {
  border-radius: 6px;
  border: 2px solid #404040;
}

.select-input {
  width: 100%;
  padding: 0.75rem;
  background: #2d2d2d;
  border: 1px solid #404040;
  border-radius: 6px;
  color: inherit;
  cursor: pointer;
}

/* Download Button Style */
.download-btn {
  position: relative;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #24b277;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.download-btn:hover {
  background: #1b8559;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.download-btn:hover .btn-text {
  transform: translateX(-10px);
}

.download-btn:hover .download-icon {
  opacity: 1;
  transform: translateX(0);
}

.btn-text {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.download-icon {
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  animation: float 1.5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@media (prefers-reduced-motion: reduce) {
  .download-btn,
  .btn-text,
  .download-icon {
    transition: none;
  }
  
  .icon {
    animation: none;
  }
} 


/* Button Styles */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: #2196F3;
  color: white;
}

.action-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  position: relative;
  padding: 0 1rem;
}

.action-group::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 60%;
  width: 1px;
  background: #404040;
}

.action-btn.secondary {
  padding: 0.75rem 1.5rem;
  background-color: #52c0a2;
  min-width: 180px;
  justify-content: center;
}


.action-btn.large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
  background: #1b8559;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
} 

/* Share Button */
.icon-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s;
}
.icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.icon-btn:hover:enabled {
  opacity: 1;
}
.share-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

/* Icon Styling */
.action-btn i {
  font-style: normal;
}

.icon-crop::before { content: "✂️"; }
.icon-copy::before { content: "📋"; }

/* Toast Notifications */
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
}

.toast {
  background: rgba(40, 40, 40, 0.95);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  backdrop-filter: blur(4px);
  animation: slideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 640px) {
  .main-content {
    padding: 1rem;
  }

  .control-row {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .drag-zone {
    width: 100%;
    max-width: 240px;
  }
}

/* Text Box Styling */
.text-box {
  position: absolute;
  cursor: move;
  user-select: none;
  touch-action: none;
}

.text-content {
  pointer-events: none;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Cropper Wrapper */
.cropper-wrapper {
  max-width: 600px;
  margin: 1rem auto;
  padding: 1rem;
  background: #2a2a2a;
  border-radius: 12px;
}

.cropper-container {
  position: relative;
  width: 100%;
  height: 60vh;
  max-height: 500px;
  margin: 0 auto;
}

.cropper-controls {
  margin-top: 1.5rem;
  text-align: center;
}

.drag-zone {
  width: 240px;
  height: 240px;
  margin: 2rem auto;
}


/* Cropper.js Overrides */
.cropper-container .cropper-crop-box,
.cropper-container .cropper-view-box {
  border-radius: 8px;
}

.cropper-container .cropper-modal {
  background: rgba(0,0,0,0.5);
}

.cropper-container .cropper-line {
  background: #2196F3;
}

.cropper-container .cropper-point {
  background: #2196F3;
  width: 8px;
  height: 8px;
}

/* About Us Section */
.about-us {
  background-color: #1e1e1e;
  color: #f0f0f0;
  padding: 20px 20px;
  text-align: left;
  border-top: 1px solid #444;
}

.about-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 768px) {
  .about-container {
    flex-direction: row;
    justify-content: space-between;
  }
}

.about-content {
  flex: 2;
}

.about-content h2 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #fdfbc3; 
}

.about-content p {
  font-size: 16px;
  line-height: 1.8;
}

.about-links {
  flex: 1;
}

.about-links h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #fdfbc3; 
}

.about-links ul {
  list-style: none;
  padding: 0;
}

.about-links ul li {
  margin-bottom: 8px;
}

.about-links ul li a {
  text-decoration: none;
  color: #f0f0f0;
  font-size: 16px;
  transition: color 0.3s ease;
}

.about-links ul li a:hover {
  color: #fdfbc3;
}

.about-links ul li a:hover,
.about-links ul li a:focus {
  color: #fdfbc3;
}

.footer-bottom {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #888;
}

</style>