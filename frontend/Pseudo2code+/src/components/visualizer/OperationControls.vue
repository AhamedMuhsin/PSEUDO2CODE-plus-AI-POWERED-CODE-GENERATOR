<template>
    <section class="op-controls">

        <!-- HELPER TEXT -->
        <p class="op-hint" v-if="hint">
            {{ hint }}
        </p>

        <!-- SEARCH -->
        <input v-if="type === 'search'" v-model.number="local.target" type="number" placeholder="Target value" />

        <!-- INSERT -->
        <template v-if="type === 'insert'">

            <!-- INSERT AT END -->
            <input v-if="mode === 'insertEnd'" v-model.number="local.value" type="number"
                placeholder="Value to insert" />

            <!-- INSERT AT INDEX -->
            <template v-if="mode === 'insertIndex'">
                <input v-model.number="local.value" type="number" placeholder="Value to insert" />
                <input v-model.number="local.index" type="number" placeholder="Index position" />
            </template>

        </template>


        <!-- UPDATE -->
        <template v-if="type === 'update'">
            <input v-model.number="local.index" type="number" placeholder="Index to update" />
            <input v-model.number="local.value" type="number" placeholder="New value" />
        </template>

        <!-- DELETE -->
        <input v-if="mode === 'deleteIndex'" v-model.number="local.index" type="number" placeholder="Index to delete" />

    </section>
</template>


<script setup>
import { watch, reactive, computed } from "vue"

const props = defineProps({
    type: String,
    mode: String,
    modelValue: Object
})

const emit = defineEmits(["update:modelValue"])
const local = reactive({ ...props.modelValue })

watch(local, () => emit("update:modelValue", local), { deep: true })

const hint = computed(() => {
    if (props.type === "search")
        return "Enter the value you want to search in the array"

    if (props.mode === "insertEnd")
        return "Enter the value to insert at the end of the array"

    if (props.mode === "insertIndex")
        return "Enter a value and the index where it should be inserted"

    if (props.mode === "deleteEnd")
        return "The last element will be removed from the array"

    if (props.mode === "deleteIndex")
        return "Enter the index of the element to remove"

    if (props.type === "update")
        return "Enter the index and the new value"

    return ""
})
</script>

<style scoped>
.op-controls {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
}

.op-hint {
    /* width: 100%; */
    font-size: 0.85rem;
    color: #94a3b8;
    margin-bottom: 8px;
}

.op-controls input {
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: white;
}
</style>
