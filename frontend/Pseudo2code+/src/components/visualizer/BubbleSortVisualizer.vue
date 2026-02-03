<template>
    <AuthNavbar />
    <SortingVisualizerBase title="Bubble Sort"
        description="Repeatedly compares adjacent elements and swaps them if they are in the wrong order."
        :generateSteps="generateBubbleSortSteps" :pseudoCode="bubbleSortPseudo" :algorithmName="'Bubble Sort'" />
</template>

<script setup>
import AuthNavbar from '../Navbar/AuthNavbar.vue';
import { bubbleSortPseudo } from '@/algorithms/sorting/bubbleSortPseudo'
import SortingVisualizerBase from '@/components/visualizer/SortingVisualizerBase.vue'
import { generateBubbleSortSteps } from '@/algorithms/sorting/bubbleSortSteps'
</script>
