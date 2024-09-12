<template>
    <div class="p-4">
        <button @click="openModal" class="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out">
            <Cpu /> &nbsp; Entrenar
        </button>

        <teleport to="body">
            <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
                <div class="bg-white p-6 rounded-lg w-full max-w-md max-h-full overflow-y-auto">
                    <h2 class="text-2xl font-bold mb-4">Datos personales</h2>
                    <form @submit.prevent="submitForm">
                        <div class="mb-4">
                            <label for="nombre" class="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
                            <input v-model="nombre" id="nombre" type="text"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required>
                        </div>
                        <div class="mb-4">
                            <label for="apellidos" class="block text-gray-700 text-sm font-bold mb-2">Apellidos:</label>
                            <input v-model="apellidos" id="apellidos" type="text"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required>
                        </div>
                        <div class="mb-4">
                            <h3 class="text-lg font-semibold mb-2">Fotos ({{ fotos.length }}/10):</h3>
                            <div>
                                <video ref="video" autoplay class="mb-2 w-full"></video>
                                <button @click="capturarFoto" type="button"
                                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                                    :disabled="fotos.length >= 10">
                                    📸 Capturar Foto
                                </button>
                                <button @click="detenerCamara" type="button"
                                    class="text-red-500 border border-red-500 font-bold py-2 px-4 rounded hover:bg-red-500 hover:text-white">
                                    ⭕ Detener Cámara
                                </button>

                            </div>
                            <button @click="iniciarCamara" type="button"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                📷 Iniciar Cámara
                            </button>
                        </div>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <div v-for="(foto, index) in fotos" :key="index" class="relative">
                                <img :src="foto" alt="Foto capturada" class="w-20 h-20 object-cover rounded">
                                <button @click="eliminarFoto(index)" type="button"
                                    class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    ❌
                                </button>
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <button type="button" @click="closeModal"
                                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">
                                ❌ Cancelar
                            </button>
                            <button type="submit"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                :disabled="!formValido || loading">
                                ✔ Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </teleport>

        <!-- Cargando -->
        <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-4 rounded-lg flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-gray-700">Procesando...</span>
            </div>
        </div>

        <!-- Notificación -->
        <div v-if="notification" class="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg">
            {{ notification }}
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Cpu } from 'lucide-vue-next';
import FaceTrackingService from '@/services/FaceTrackingService';

const isModalOpen = ref(false);
const nombre = ref('');
const apellidos = ref('');
const fotos = ref([]);
const streamActive = ref(false);
const video = ref(null);
const loading = ref(false);
const notification = ref('');
let stream = null;
let FTService = new FaceTrackingService();

const formValido = computed(() => {
    return nombre.value.trim() !== '' && apellidos.value.trim() !== '' && fotos.value.length === 10;
});

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    detenerCamara();
    resetForm();
};

const resetForm = () => {
    nombre.value = '';
    apellidos.value = '';
    fotos.value = [];
};

const iniciarCamara = async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (video.value) {
            video.value.srcObject = stream;
            streamActive.value = true;
        }
    } catch (error) {
        console.error('Error accessing the camera:', error);
    }
};

const detenerCamara = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        streamActive.value = false;
        stream = null;
    }
};

const capturarFoto = () => {
    if (fotos.value.length >= 10) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.value.videoWidth;
    canvas.height = video.value.videoHeight;
    canvas.getContext('2d').drawImage(video.value, 0, 0);
    const foto = canvas.toDataURL('image/jpeg');
    fotos.value.push(foto);

    if (fotos.value.length === 10) {
        detenerCamara();
    }
};

const eliminarFoto = (index) => {
    fotos.value.splice(index, 1);
};

const submitForm = async () => {
    if (formValido.value) {
        loading.value = true;
        try {
            const base64Fotos = fotos.value.map(x => {return x.slice(23)});
            const nombre_completo = (nombre.value + " " + apellidos.value).replaceAll(" ", "_");
            const objParams = { folder_name: nombre_completo, images: base64Fotos };
            await FTService.addNewFace(objParams);
            notification.value = '¡Datos enviados correctamente!';
        } catch (error) {
            notification.value = 'Error al enviar los datos.';
        } finally {
            loading.value = false;
            closeModal();
            setTimeout(() => {
                notification.value = '';
            }, 3000); // Oculta la notificación después de 3 segundos
        }
    } else {
        alert('Por favor, completa todos los campos y captura 10 fotos.');
    }
};
</script>
