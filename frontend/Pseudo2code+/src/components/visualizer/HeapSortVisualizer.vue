<template>
    <AuthNavbar />
    <SortingVisualizerBase title="Heap Sort" description="Build a max heap and repeatedly extract the maximum element."
        :generateSteps="generateHeapSortSteps" :pseudoCode="heapSortPseudo" />

</template>
<script setup>
import AuthNavbar from '../Navbar/AuthNavbar.vue';
import SortingVisualizerBase from '@/components/visualizer/SortingVisualizerBase.vue'
import { generateHeapSortSteps } from '@/algorithms/sorting/heapSortSteps'
import { heapSortPseudo } from '@/algorithms/sorting/heapSortPseudo'
</script>