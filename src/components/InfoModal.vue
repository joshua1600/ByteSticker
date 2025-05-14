<template>
    <div class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal">
        <header class="modal-header">
          <h2>{{ title }}</h2>
          <button class="close-btn" @click="$emit('close')">&times;</button>
        </header>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'InfoModal',
    props: {
      title: { type: String, required: true }
    }
  }
  </script>
  
  <style scoped>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal {
    background: #1e1e1e;
    color: #fff;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #2a2a2a;
  }
  .modal-header h2 {
    margin: 0;
    font-size: 1.25rem;
  }
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    line-height: 1;
    color: #999;
    cursor: pointer;
    transition: color 0.2s;
  }
  .close-btn:hover {
    color: #fff;
  }
  .modal-body {
    padding: 1rem;
    line-height: 1.6;
  }
  .modal-body ol,
  .modal-body ul {
    margin: 0 0 1rem 1.5rem;
  }
  .tip {
    color: #52c0a2;
    font-style: italic;
  }
  </style>
  