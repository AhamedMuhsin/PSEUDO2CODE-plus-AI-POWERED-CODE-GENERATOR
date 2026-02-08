<template>
    <AuthNavbar />
    <SortingVisualizerBase title="Merge Sort" description="Divide the array into halves, sort them, and merge."
        :generateSteps="generateMergeSortSteps" :pseudoCode="mergeSortPseudo" :algorithmName="'Merge Sort'"
        :currentOperation="operation" />
</template>
<script setup>
import AuthNavbar from '../Navbar/AuthNavbar.vue';
import SortingVisualizerBase from '@/components/visualizer/SortingVisualizerBase.vue'
import { generateMergeSortSteps } from '@/algorithms/sorting/mergeSortSteps'
import { mergeSortPseudo } from '@/algorithms/sorting/mergeSortPseudo'
import { sortingOperations } from "@/algorithms/sorting/sortingOperations"

const operation = sortingOperations.merge
</script>
