<template>
    <div>
        <!-- Botón para abrir/cerrar la barra lateral -->
        <button @click="isOpen = !isOpen"
            class="fixed top-4 left-4 z-30 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
            aria-label="Toggle sidebar">
            <MenuIcon v-if="!isOpen" class="w-6 h-6" />
            <XIcon v-else class="w-6 h-6" />
        </button>

        <!-- Overlay para cerrar la barra lateral en dispositivos móviles -->
        <div v-if="isOpen" @click="isOpen = false" class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"></div>

        <!-- Barra lateral -->
        <aside :class="[
            'fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out',
            isOpen ? 'translate-x-0' : '-translate-x-full'
        ]">
            <nav class="p-4 space-y-4">
                <button @click="isOpen = !isOpen"
                    class="top-4 left-4 z-30 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                    aria-label="Toggle sidebar">
                    <MenuIcon v-if="!isOpen" class="w-6 h-6" />
                    <XIcon v-else class="w-6 h-6" />
                </button>

                <LogComponent
                    class="w-full flex items-center justify-start px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300 ease-in-out"
                    :icon="HomeIcon" />

                <TrainingDataModalComponent class="w-full flex items-center justify-start px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300 ease-in-out"/>
            </nav>
        </aside>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { MenuIcon, XIcon, HomeIcon } from 'lucide-vue-next'
import LogComponent from './LogComponent.vue';
import TrainingDataModalComponent from './TrainingDataModalComponent.vue';

const isOpen = ref(false)

</script>
