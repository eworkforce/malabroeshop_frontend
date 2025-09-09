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
    as="p"
    :class="cn('text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </Primitive>
</template>
