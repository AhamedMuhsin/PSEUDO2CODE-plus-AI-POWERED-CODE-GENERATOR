<template>
    <AuthNavbar />
    <SortingVisualizerBase title="Quick Sort"
        description="Partition the array using a pivot and recursively sort subarrays."
        :generateSteps="generateQuickSortSteps" :pseudoCode="quickSortPseudo" :algorithmName="'Quick Sort'"
        :currentOperation="operation" />
</template>
<script setup>
import AuthNavbar from '../Navbar/AuthNavbar.vue';
import SortingVisualizerBase from '@/components/visualizer/SortingVisualizerBase.vue'
import { generateQuickSortSteps } from '@/algorithms/sorting/quickSortSteps'
import { quickSortPseudo } from '@/algorithms/sorting/quickSortPseudo'
import { sortingOperations } from "@/algorithms/sorting/sortingOperations"

const operation = sortingOperations.quick
</script>
