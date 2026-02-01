<template>
    <AuthNavbar />
    <SortingVisualizerBase title="Selection Sort"
        description="Repeatedly selects the minimum element and places it at the beginning."
        :generateSteps="generateSelectionSortSteps" :pseudoCode="selectionSortPseudo" />
</template>

<script setup>
import AuthNavbar from '../Navbar/AuthNavbar.vue';
import SortingVisualizerBase from '@/components/visualizer/SortingVisualizerBase.vue'
import { generateSelectionSortSteps } from '@/algorithms/sorting/selectionSortSteps'
import { selectionSortPseudo } from '@/algorithms/sorting/selectionSortPseudo'
</script>
