<template>
  <div class="container-fluid py-4">
    <header class="mb-4 text-center">
      <h1 class="display-5 fw-bold">Video Chunk Admin</h1>
      <p class="text-muted">Upload, split, and download your video chunks</p>
    </header>

    <div class="row justify-content-center">
      <!-- Navigation Tabs -->
      <div class="col-12 text-center mb-4">
        <div class="btn-group" role="group">
          <button @click="view = 'process'" class="btn" :class="view === 'process' ? 'btn-primary' : 'btn-outline-primary'">Processor</button>
          <button @click="view = 'docs'" class="btn" :class="view === 'docs' ? 'btn-primary' : 'btn-outline-primary'">Documentation</button>
        </div>
      </div>

      <!-- Processor View -->
      <div v-if="view === 'process'" class="col-12 col-md-8 col-lg-6">
        <div class="card shadow-sm mb-4">
          <div class="card-body p-4">
            <!-- Step 1: Upload -->
            <div v-if="!jobId" class="text-center">
              <h5 class="mb-3">Upload Video</h5>
              <div class="mb-3">
                <input type="file" @change="handleUpload" class="form-control" accept="video/*">
              </div>
              <div v-if="uploading" class="text-center">
                <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                <span class="ms-2">Uploading...</span>
              </div>
            </div>

            <!-- Step 2: Process -->
            <div v-else>
              <h5 class="mb-3">Process Video: {{ fileName }}</h5>
              <div class="mb-3">
                <label class="form-label">Chunk Duration (seconds)</label>
                <input v-model.number="chunkDuration" type="number" class="form-control">
              </div>
              <div class="d-flex gap-2">
                <button @click="processVideo" class="btn btn-primary flex-grow-1" :disabled="processing">
                  <span v-if="processing" class="spinner-border spinner-border-sm me-2"></span>
                  {{ processing ? 'Processing...' : 'Start Splitting' }}
                </button>
                <button @click="reset" class="btn btn-outline-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Section -->
        <div v-if="jobId" class="mb-4">
          <h5 class="mb-3">Original Video Preview</h5>
          <div class="card shadow-sm mb-4">
            <div class="card-body p-0">
              <video :src="originalUrl" controls class="w-100" style="max-height: 300px; background: black;"></video>
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div v-if="results" class="mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="m-0">Split Chunks</h5>
            <a :href="`/api/download/${jobId}`" class="btn btn-success btn-sm">
              📦 Download All (ZIP)
            </a>
          </div>
          <div class="row g-3">
            <div v-for="res in results" :key="res.chunkIndex" class="col-12 col-md-6">
              <div class="card shadow-sm">
                <div class="card-body p-2">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-bold">Chunk {{ res.chunkIndex }}</span>
                    <span class="badge bg-secondary">{{ res.startTime }}s - {{ res.endTime }}s</span>
                  </div>
                  <video :src="res.url" controls class="w-100 rounded" style="max-height: 150px; background: black;"></video>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="error" class="alert alert-danger mt-4">
          {{ error }}
        </div>
      </div>

      <!-- Docs View -->
      <div v-else class="col-12 col-lg-10">
        <DocsComponent />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import DocsComponent from './components/Docs.vue';

const view = ref('process');
const jobId = ref(null);
const fileName = ref('');
const originalUrl = ref('');
const chunkDuration = ref(60);
const uploading = ref(false);
const processing = ref(false);
const results = ref(null);
const error = ref(null);

async function handleUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  uploading.value = true;
  error.value = null;

  const formData = new FormData();
  formData.append('video', file);

  try {
    const response = await axios.post('/api/upload', formData);
    jobId.value = response.data.jobId;
    fileName.value = response.data.fileName;
    originalUrl.value = response.data.filePath;
  } catch (err) {
    error.value = 'Upload failed. Please try again.';
  } finally {
    uploading.value = false;
  }
}

async function processVideo() {
  processing.value = true;
  error.value = null;
  results.value = null;

  try {
    const response = await axios.post('/api/process', {
      jobId: jobId.value,
      filePath: originalUrl.value,
      chunkDuration: chunkDuration.value
    });
    results.value = response.data.chunks;
  } catch (err) {
    error.value = err.response?.data?.error || 'Processing failed.';
  } finally {
    processing.value = false;
  }
}

function reset() {
  jobId.value = null;
  fileName.value = '';
  originalUrl.value = '';
  results.value = null;
  error.value = null;
}
</script>

<style scoped>
body {
  background-color: #f8f9fa;
}
</style>
