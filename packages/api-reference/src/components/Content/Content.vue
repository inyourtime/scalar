<script setup lang="ts">
import type { Server, Spec } from '@scalar/types/legacy'
import { computed } from 'vue'

import { BaseUrl } from '../../features/BaseUrl'
import { getModels, hasModels } from '../../helpers'
import { useNavState, useSidebar } from '../../hooks'
import { Authentication } from './Authentication'
import { ClientLibraries } from './ClientLibraries'
import { Introduction } from './Introduction'
import { Lazy, Loading } from './Lazy'
import { Models, ModelsAccordion } from './Models'
import { Operation, OperationAccordion } from './Operation'
import { Tag, TagAccordion } from './Tag'
import { Webhooks } from './Webhooks'

const props = defineProps<{
  parsedSpec: Spec
  layout?: 'default' | 'accordion'
  baseServerURL?: string
  servers?: Server[]
  proxy?: string
}>()

const { getOperationId, getTagId, hash } = useNavState()
const { hideModels, collapsedSidebarItems } = useSidebar()

const tagLayout = computed<typeof Tag>(() =>
  props.layout === 'accordion' ? TagAccordion : Tag,
)

const endpointLayout = computed<typeof Operation>(() =>
  props.layout === 'accordion' ? OperationAccordion : Operation,
)

const introCardsSlot = computed(() =>
  props.layout === 'accordion' ? 'after' : 'aside',
)

// If the first load is models, we do not lazy load tags/operations
const isLazy = props.layout !== 'accordion' && !hash.value.startsWith('model')
</script>
<template>
  <!-- For adding gradients + animations to introduction of documents that :before / :after won't work for -->
  <div class="section-flare">
    <div class="section-flare-item"></div>
    <div class="section-flare-item"></div>
    <div class="section-flare-item"></div>
    <div class="section-flare-item"></div>
    <div class="section-flare-item"></div>
    <div class="section-flare-item"></div>
    <div class="section-flare-item"></div>
    <div class="section-flare-item"></div>
  </div>
  <div class="narrow-references-container">
    <slot name="start" />
    <Loading
      :layout="layout"
      :parsedSpec="parsedSpec" />

    <Introduction
      v-if="parsedSpec?.info?.title || parsedSpec?.info?.description"
      :info="parsedSpec.info"
      :parsedSpec="parsedSpec">
      <template #[introCardsSlot]>
        <div
          class="introduction-card"
          :class="{ 'introduction-card-row': layout === 'accordion' }">
          <BaseUrl
            class="introduction-card-item"
            :defaultServerUrl="baseServerURL"
            :servers="props.servers"
            :specification="parsedSpec" />
          <Authentication
            class="introduction-card-item"
            :parsedSpec="parsedSpec"
            :proxy="proxy" />
          <ClientLibraries class="introduction-card-item" />
        </div>
      </template>
    </Introduction>
    <slot
      v-else
      name="empty-state" />

    <Lazy
      v-for="tag in parsedSpec.tags"
      :id="getTagId(tag)"
      :key="getTagId(tag)"
      :isLazy="isLazy && !collapsedSidebarItems[getTagId(tag)]">
      <Component
        :is="tagLayout"
        :id="getTagId(tag)"
        :spec="parsedSpec"
        :tag="tag">
        <Lazy
          v-for="(operation, operationIndex) in tag.operations"
          :id="getOperationId(operation, tag)"
          :key="`${operation.httpVerb}-${operation.operationId}`"
          :isLazy="operationIndex > 0">
          <Component
            :is="endpointLayout"
            :id="getOperationId(operation, tag)"
            :operation="operation"
            :tag="tag" />
        </Lazy>
      </Component>
    </Lazy>

    <template v-if="parsedSpec.webhooks">
      <Webhooks :webhooks="parsedSpec.webhooks" />
    </template>

    <template v-if="hasModels(parsedSpec) && !hideModels">
      <ModelsAccordion
        v-if="layout === 'accordion'"
        :schemas="getModels(parsedSpec)" />
      <Models
        v-else
        :schemas="getModels(parsedSpec)" />
    </template>
    <slot name="end" />
  </div>
</template>
<style>
.narrow-references-container {
  container-name: narrow-references-container;
  container-type: inline-size;
}
</style>
<style scoped>
.render-loading {
  height: calc(var(--full-height) - var(--refs-header-height));
  display: flex;
  align-items: center;
  justify-content: center;
}
.introduction-card {
  display: flex;
  flex-direction: column;
  padding-top: 3px;
  background: var(--scalar-background-1);
  border: var(--scalar-border-width) solid var(--scalar-border-color);
  border-radius: var(--scalar-radius-lg);
}
.introduction-card-item {
  padding: 9px 12px;
  border-bottom: var(--scalar-border-width) solid var(--scalar-border-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.introduction-card-item:last-of-type {
  border-bottom: none;
}
.introduction-card :deep(.description) {
  padding: 0;
}
.introduction-card-title {
  font-weight: var(--scalar-semibold);
  font-size: var(--scalar-mini);
  color: var(--scalar-color-3);
}
.introduction-card-row {
  flex-flow: row wrap;
  gap: 24px;
}
.introduction-card-row > * {
  flex: 1;
}
@media (min-width: 600px) {
  .introduction-card-row > * {
    min-width: min-content;
  }
}
@media (max-width: 600px) {
  .introduction-card-row > * {
    max-width: 100%;
  }
}
@container (max-width: 900px) {
  .introduction-card-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0px;
  }
}
.introduction-card :deep(.security-scheme-label) {
  text-transform: uppercase;
  font-weight: var(--scalar-semibold);
}
.references-classic
  .introduction-card-row
  :deep(.scalar-card:nth-of-type(2) .scalar-card-header) {
  display: none;
}
.references-classic
  .introduction-card-row
  :deep(.scalar-card:nth-of-type(2) .scalar-card-header) {
  display: none;
}
.references-classic
  .introduction-card-row
  :deep(
    .scalar-card:nth-of-type(2)
      .scalar-card-header.scalar-card--borderless
      + .scalar-card-content
  ) {
  margin-top: 0;
}
.section-flare {
  position: absolute;
  top: 0;
  right: 0;
  pointer-events: none;
}
</style>
