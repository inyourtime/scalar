<script lang="ts">
/**
 * Scalar Sidebar Button component
 *
 * Provide a styled link for the ScalarSidebar or similar, supports
 * the same props and slots as ScalarSidebarItem
 *
 * This is used internally by the ScalarSidebarItem component
 *
 * If you're looking to create items in ScalarSidebarItems
 * you probably want the ScalarSidebarItem component
 *
 * @example
 *   <ScalarSidebarButton>
 *     <template #icon>
 *       <!-- Overrides the icon slot -->
 *     </template>
 *     <!-- Button text -->
 *     <template #aside>
 *       <!-- After the button text -->
 *     </template>
 *   </ScalarSidebarButton>
 */
export default {}
</script>
<script setup lang="ts">
import { useBindCx } from '@scalar/use-hooks/useBindCx'
import { cva } from '@scalar/use-hooks/useBindCx'

import { ScalarIconLegacyAdapter } from '../ScalarIcon'
import ScalarSidebarIndent from './ScalarSidebarIndent.vue'
import type { ScalarSidebarItemProps, ScalarSidebarItemSlots } from './types'

const { is = 'a', indent = 0 } = defineProps<ScalarSidebarItemProps>()

defineSlots<ScalarSidebarItemSlots>()

const variants = cva({
  base: [
    'group/button flex items-stretch rounded px-2 font-sidebar text-c-2 no-underline',
  ],
  variants: {
    active: { true: 'text-c-1 font-sidebar-active' },
    disabled: { true: 'cursor-auto' },
    selected: { true: 'cursor-auto bg-b-2 text-c-1 font-sidebar-active' },
  },
  compoundVariants: [
    { selected: false, disabled: false, class: 'hover:bg-b-2' },
  ],
  defaultVariants: { selected: false, disabled: false, active: false },
})
defineOptions({ inheritAttrs: false })
const { cx } = useBindCx()
</script>
<template>
  <component
    :is="is"
    :aria-selected="selected"
    :type="is === 'button' ? 'button' : undefined"
    v-bind="cx(variants({ selected, disabled, active }))">
    <slot name="indent">
      <ScalarSidebarIndent
        :indent
        :selected
        :disabled />
    </slot>
    <div class="flex items-center gap-1 flex-1 py-2 leading-5">
      <div
        v-if="icon || $slots.icon"
        class="size-4">
        <slot name="icon">
          <ScalarIconLegacyAdapter
            v-if="icon"
            :icon="icon" />
        </slot>
      </div>
      <slot />
    </div>
    <div
      v-if="$slots.aside"
      class="flex items-center">
      <slot name="aside" />
    </div>
  </component>
</template>
