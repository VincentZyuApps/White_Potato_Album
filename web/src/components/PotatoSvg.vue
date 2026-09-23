<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<template>
  <svg
    class="potato-svg"
    :style="size ? { width: size + 'px' } : undefined"
    viewBox="0 0 200 200"
    width="190"
    height="190"
    aria-hidden="true"
  >
    <path
      class="p-body"
      d="M60 62 C30 82 26 132 56 160 C86 190 146 184 170 150 C190 122 180 70 144 56 C114 43 84 46 60 62 Z"
      fill="var(--paper)"
      stroke="var(--brown)"
      stroke-width="11"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <g class="p-sprout">
      <path
        class="p-stem"
        d="M150 56 C156 34 168 24 172 12"
        fill="none"
        stroke="var(--green)"
        stroke-width="9"
        stroke-linecap="round"
      />
      <path class="p-leaf" d="M172 14 C186 8 196 16 190 30 C180 34 170 28 172 14 Z" fill="var(--green)" />
      <path class="p-leaf" d="M172 16 C158 8 148 16 154 30 C166 34 176 28 172 16 Z" fill="var(--green)" />
    </g>
    <g class="p-face">
      <circle cx="90" cy="104" r="4.5" fill="var(--brown)" />
      <circle cx="112" cy="104" r="4.5" fill="var(--brown)" />
      <path
        d="M92 118 C98 126 108 126 114 118"
        fill="none"
        stroke="var(--brown)"
        stroke-width="4"
        stroke-linecap="round"
      />
    </g>
  </svg>
</template>

<style scoped>
.potato-svg {
  display: inline-block;
  width: clamp(120px, 22vw, 190px);
  height: auto;
  overflow: visible;
  vertical-align: top;
}
</style>
