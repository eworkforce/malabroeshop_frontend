<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props extends PrimitiveProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <Primitive
    :as-child="asChild"
    as="h3"
    :class="cn('text-2xl font-semibold leading-none tracking-tight', props.class)"
  >
    <slot />
  </Primitive>
</template>
