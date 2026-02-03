<template>
    <AuthNavbar />
    <SortingVisualizerBase title="Insertion Sort"
        description="Builds the sorted array one element at a time by inserting elements in the correct position."
        :generateSteps="generateInsertionSortSteps" :pseudoCode="insertionSortPseudo" :algorithmName="'Insertion Sort'"/>
</template>

<script setup>
import AuthNavbar from '../Navbar/AuthNavbar.vue';
import SortingVisualizerBase from '@/components/visualizer/SortingVisualizerBase.vue'
import { generateInsertionSortSteps } from '@/algorithms/sorting/insertionSortSteps'
import { insertionSortPseudo } from '@/algorithms/sorting/insertionSortPseudo'
</script>
