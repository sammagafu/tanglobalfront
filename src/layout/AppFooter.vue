<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
    return '@/assets/branding/png.png';
});
</script>

<template>
    <div class="layout-footer text-center">
        <span class="font-medium mr-4">&copy; TanGlobal</span>
        <img src="@/assets/branding/png.png" alt="Logo" height="32" class="mr-2" />
        <span class="font-medium ml-2">Powered by Power and Networks Back-up LTD</span>
    </div>
</template>
<style lang="scss" scoped></style>
