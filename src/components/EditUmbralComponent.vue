<template>
    <div class="flex items-center max-w-md">
        <input type="text" v-model="inputValue" placeholder="Modificar umbral..."
            class="flex-grow py-2 border border-gray-300 rounded-l-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="handleSubmit" />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import FaceTrackingService from '@/services/FaceTrackingService';


let inputValue = ref(0)
const FTService = new FaceTrackingService();

const handleSubmit = async () => {
    if (inputValue.value.trim()) {
        await FTService.requestUmbral(inputValue.value);
        inputValue.value = FTService.getUmbral().value;
        console.log(inputValue.value);
    }
}
onMounted(() => {
    FTService.requestUmbral();
    inputValue.value = FTService.getUmbral().value;
});
</script>