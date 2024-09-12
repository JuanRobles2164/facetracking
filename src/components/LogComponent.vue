<template>
    <div>
        <button @click="handleClick"
            class="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out">
            <EyeIcon class="w-5 h-5 mr-2" />
            <span>Log</span>
        </button>

        <Teleport to="body">
            <div v-if="isModalOpen"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
                    <div class="p-6">
                        <h2 class="text-2xl font-bold mb-4 text-gray-800">Log de Eventos</h2>
                        <div class="overflow-y-auto max-h-96">
                            <table class="w-full">
                                <thead>
                                    <tr>
                                        <th class="text-left pb-2 font-semibold text-gray-600">Descripción</th>
                                        <th class="text-left pb-2 font-semibold text-gray-600">Fecha-Hora</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(event, index) in events" :key="index" class="border-t border-gray-200">
                                        <td class="py-2 text-gray-800">{{ event.description }}</td>
                                        <td class="py-2 text-gray-600">{{ event.datetime }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="bg-gray-100 px-6 py-3 flex justify-end rounded-b-lg">
                        <button @click="isModalOpen = false"
                            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition duration-300 ease-in-out">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { EyeIcon } from 'lucide-vue-next'
import FaceTrackingService from '@/services/FaceTrackingService';

const isModalOpen = ref(false)
const FTService = new FaceTrackingService();
const events = ref([])

const handleClick = async () => {
    await consultarLog();
    abrirModal();
}

const abrirModal = () => {
    isModalOpen.value = true;
}

const consultarLog = async () => {
    await FTService.requestLogData();
    let response = FTService.getLog();
    console.log(response.value);
    if (response.value != null) {
        events.value = response.value.map(x => {
            return { description: x.descripcion, datetime: x.fecha_hora };
        });
    }
}
</script>