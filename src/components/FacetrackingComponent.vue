<template>
  <SidebarComponent />
  <br>
  <br>
  <div class="top-4 grid grid-cols-4 gap-4 p-4 h-[600px]">
    <div class="col-span-3 bg-white shadow-md rounded-lg flex flex-col">
      <div class="flex-grow flex flex-col justify-between p-6">
        <div class="bg-gray-200 aspect-video rounded-lg flex items-center justify-center">
          <video v-if="isCameraOn" ref="videoElement" class="rounded-lg flex" autoplay playsinline></video>
          <div v-else class="text-2xl font-bold text-gray-500">Cámara Apagada</div>
        </div>
        <button @click="toggleCamera"
          class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
          <span class="mr-2">
            <Power v-if="!isCameraOn" />
            <PowerOff v-else />
          </span>
          <span class="text-center">
            {{ isCameraOn ? 'Apagar cámara' : 'Encender cámara' }}
          </span>
        </button>
      </div>
    </div>
    <div class="bg-white shadow-md rounded-lg">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">En pantalla 👀</h2>
        <ul class="space-y-2">
          <li v-for="(name, index) in names" :key="index" class="bg-gray-100 p-2 rounded-lg">
            {{ name }}
          </li>
          <ImageListItemComponent v-for="(p, index) in persons" :key="index" :name="p.name" :image="p.image"/>
        </ul>
      </div>
    </div>
  </div>
</template>


<script setup>
import FaceTrackingService from '@/services/FaceTrackingService';
import { ref, onBeforeUnmount } from 'vue'
import { Power, PowerOff } from 'lucide-vue-next';
import SidebarComponent from './SidebarComponent.vue';
import ImageListItemComponent from './ImageListItemComponent.vue';

const isCameraOn = ref(false)
const videoElement = ref(null)
const intervalId = ref(null)
const FTService = new FaceTrackingService();
let names = ref([]);
let persons = ref([]);


const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    if (videoElement.value) {
      videoElement.value.srcObject = stream;
      intervalId.value = setInterval(identifyPeople, 3000);
    }
  } catch (error) {
    console.error('Error accessing the camera:', error)
  }
}

const stopCamera = () => {
  const stream = videoElement.value?.srcObject
  const tracks = stream?.getTracks()

  tracks?.forEach(track => track.stop())

  clearInterval(intervalId.value);
}

const identifyPeople = async () => {
  if (videoElement.value) {
    const canvas = document.createElement('canvas')
    canvas.width = videoElement.value.videoWidth
    canvas.height = videoElement.value.videoHeight
    const context = canvas.getContext('2d')

    // Dibujar la imagen del video en el canvas
    context.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height)

    // Convertir la imagen del canvas a base64
    const base64Image = canvas.toDataURL('image/png').slice(22);

    // Llamar a la función que maneja la imagen en base64
    await FTService.identify({ "image": base64Image });
    //all data
    const response = FTService.getResults();
    if (response.value.length != null) {
      names.value = [];
      persons.value = response.value;
      console.log(response.value);
    } else {
      names.value = ["No hay rostros"];
      persons.value = [];
    }
  }
}

const resetListNames = () => {
  names.value = [];
};

const toggleCamera = () => {
  resetListNames();
  if (isCameraOn.value) {
    stopCamera()
  } else {
    startCamera()
  }
  isCameraOn.value = !isCameraOn.value
}

// Stop the camera when the component is unmounted
onBeforeUnmount(() => {
  if (isCameraOn.value) {
    stopCamera()
  }
})

</script>
