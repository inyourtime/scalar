import { useMultipleDocuments } from '@/hooks/useMultipleDocuments'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

describe('useMultipleDocuments', () => {
  let mockUrl: URL
  let replaceStateSpy: any

  // Common test setup
  beforeEach(() => {
    mockUrl = new URL('http://example.com')
    vi.spyOn(window, 'location', 'get').mockReturnValue(mockUrl as any)
    replaceStateSpy = vi.spyOn(window.history, 'replaceState').mockImplementation(() => {})
  })

  describe('document selection', () => {
    it('should select document using numeric index from query parameter', () => {
      mockUrl = new URL('http://example.com?api=1')
      vi.spyOn(window, 'location', 'get').mockReturnValue(mockUrl as any)

      const multiConfig = {
        configuration: ref([
          { url: '/openapi.json', slug: 'first-api' },
          { url: '/openapi-2.yaml', slug: 'second-api' },
        ]),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { selectedDocumentIndex, selectedConfiguration } = useMultipleDocuments(multiConfig)

      expect(selectedDocumentIndex.value).toBe(1)
      expect(selectedConfiguration.value).toMatchObject(multiConfig.configuration.value[1])
    })

    it('should select document using slug from query parameter', () => {
      mockUrl = new URL('http://example.com?api=second-api')
      vi.spyOn(window, 'location', 'get').mockReturnValue(mockUrl as any)

      const multiConfig = {
        configuration: ref([
          { url: '/openapi.json', slug: 'first-api' },
          { url: '/openapi-2.yaml', slug: 'second-api' },
        ]),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { selectedDocumentIndex, selectedConfiguration } = useMultipleDocuments(multiConfig)

      expect(selectedDocumentIndex.value).toBe(1)
      expect(selectedConfiguration.value).toMatchObject(multiConfig.configuration.value[1])
    })

    it('should default to first API when query parameter is invalid', () => {
      mockUrl = new URL('http://example.com?api=invalid')
      vi.spyOn(window, 'location', 'get').mockReturnValue(mockUrl as any)

      const multiConfig = {
        configuration: ref([
          { url: '/openapi.json', slug: 'first-api' },
          { url: '/openapi-2.yaml', slug: 'second-api' },
        ]),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { selectedDocumentIndex, selectedConfiguration } = useMultipleDocuments(multiConfig)

      expect(selectedDocumentIndex.value).toBe(0)
      expect(selectedConfiguration.value).toMatchObject(multiConfig.configuration.value[0])
    })

    it('omits sources without url and content', () => {
      const multiConfig = {
        configuration: ref({ sources: [{}] }),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { availableDocuments } = useMultipleDocuments(multiConfig)
      expect(availableDocuments.value).toHaveLength(0)
    })
  })

  describe('URL management', () => {
    // We do not set the initial url as its not needed, also was breaking the hash
    it.todo('should update URL when initializing with a selection', () => {
      const multiConfig = {
        configuration: ref([
          { url: '/openapi.json', slug: 'first-api' },
          { url: '/openapi-2.yaml', slug: 'second-api' },
        ]),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { selectedDocumentIndex, selectedConfiguration } = useMultipleDocuments(multiConfig)

      expect(replaceStateSpy).toHaveBeenCalledWith({}, '', 'http://example.com/?api=first-api')
      expect(selectedDocumentIndex.value).toBe(0)
      expect(selectedConfiguration.value).toMatchObject(multiConfig.configuration.value[0])
    })

    it('should not update URL when there is only one document', () => {
      const singleConfig = {
        configuration: ref([{ url: '/openapi.json', slug: 'single-api' }]),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      useMultipleDocuments(singleConfig)

      expect(replaceStateSpy).not.toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should handle single API configuration', () => {
      const singleConfig = {
        configuration: ref({ url: '/openapi.json', slug: 'single-api' }),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { selectedConfiguration, availableDocuments } = useMultipleDocuments(singleConfig)

      expect(availableDocuments.value).toHaveLength(1)
      expect(selectedConfiguration.value).toMatchObject(singleConfig.configuration.value)
    })

    it('should handle undefined configuration', () => {
      const emptyConfig = {
        configuration: ref(undefined),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { selectedConfiguration, availableDocuments } = useMultipleDocuments(emptyConfig)

      expect(availableDocuments.value).toHaveLength(0)
      expect(selectedConfiguration.value).toMatchObject({
        hideClientButton: false,
        showSidebar: true,
        theme: 'default',
        layout: 'modern',
        isEditable: false,
        hideModels: false,
        hideDownloadButton: false,
        hideTestRequestButton: false,
        hideSearch: false,
        hideDarkModeToggle: false,
        withDefaultFonts: true,
      })
    })

    it('should filter out APIs with undefined sources/url/content', () => {
      const configWithUndefinedSpec = {
        configuration: ref([{ url: undefined }, { url: '/openapi-2.yaml', slug: 'valid-api' }]),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { availableDocuments } = useMultipleDocuments(configWithUndefinedSpec)

      expect(availableDocuments.value).toHaveLength(1)
    })
  })

  describe('multiple sources', () => {
    it('should select API using numeric index from query parameter', () => {
      mockUrl = new URL('http://example.com?api=1')
      vi.spyOn(window, 'location', 'get').mockReturnValue(mockUrl as any)

      const multiConfig = {
        configuration: ref({
          sources: [
            {
              url: '/openapi-1.yaml',
              slug: 'first-api',
            },
            {
              url: '/openapi-2.yaml',
              slug: 'second-api',
            },
          ],
        }),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { selectedDocumentIndex, selectedConfiguration } = useMultipleDocuments(multiConfig)

      expect(selectedDocumentIndex.value).toBe(1)
      expect(selectedConfiguration.value).toMatchObject({
        url: '/openapi-2.yaml',
        slug: 'second-api',
      })
    })

    it('should select API using slug from query parameter', () => {
      mockUrl = new URL('http://example.com?api=second-api')
      vi.spyOn(window, 'location', 'get').mockReturnValue(mockUrl as any)

      const multiConfig = {
        configuration: ref({
          sources: [
            {
              url: '/openapi-1.yaml',
              slug: 'first-api',
            },
            {
              url: '/openapi-2.yaml',
              slug: 'second-api',
            },
          ],
        }),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { selectedDocumentIndex, selectedConfiguration } = useMultipleDocuments(multiConfig)

      expect(selectedDocumentIndex.value).toBe(1)
      expect(selectedConfiguration.value).toMatchObject({
        url: '/openapi-2.yaml',
        slug: 'second-api',
      })
    })

    it('should default to first API if query parameter is invalid', () => {
      mockUrl = new URL('http://example.com?api=invalid-api')
      vi.spyOn(window, 'location', 'get').mockReturnValue(mockUrl as any)

      const multiConfig = {
        configuration: ref({
          sources: [
            {
              url: '/openapi-1.yaml',
              slug: 'first-api',
            },
            {
              url: '/openapi-2.yaml',
              slug: 'second-api',
            },
          ],
        }),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { selectedDocumentIndex, selectedConfiguration } = useMultipleDocuments(multiConfig)

      expect(selectedDocumentIndex.value).toBe(0)
      expect(selectedConfiguration.value).toMatchObject({
        url: '/openapi-1.yaml',
        slug: 'first-api',
      })
    })

    it('should update URL when selection changes', async () => {
      mockUrl = new URL('http://example.com')
      vi.spyOn(window, 'location', 'get').mockReturnValue(mockUrl as any)
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState')

      const multiConfig = {
        configuration: ref({
          sources: [
            {
              url: '/openapi-1.yaml',
              slug: 'first-api',
            },
            {
              url: '/openapi-2.yaml',
              slug: 'second-api',
            },
          ],
        }),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { selectedDocumentIndex } = useMultipleDocuments(multiConfig)

      selectedDocumentIndex.value = 1

      expect(replaceStateSpy).toHaveBeenCalledWith({}, '', 'http://example.com/?api=second-api')
    })

    it('should filter out undefined sources', () => {
      const configWithUndefinedSource = {
        configuration: ref({
          sources: [
            undefined,
            {
              url: '/openapi.yaml',
              slug: 'valid-api',
            },
          ],
        }),
      }

      // @ts-expect-error This is a test for the edge case
      const { availableDocuments } = useMultipleDocuments(configWithUndefinedSource)

      expect(availableDocuments.value).toHaveLength(1)
      expect(availableDocuments.value[0].slug).toBe('valid-api')
    })
  })

  describe('title and slug handling', () => {
    it('should generate slug from title if only title exists', () => {
      const config = {
        configuration: ref({
          sources: [
            {
              url: '/openapi-1.yaml',
              title: 'My Cool API',
            },
          ],
        }),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { availableDocuments } = useMultipleDocuments(config)

      expect(availableDocuments.value[0]).toMatchObject({
        title: 'My Cool API',
        slug: 'my-cool-api',
      })
    })

    it('should use slug as title if only slug exists', () => {
      const config = {
        configuration: ref({
          sources: [
            {
              url: '/openapi-1.yaml',
              slug: 'my-api',
            },
          ],
        }),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { availableDocuments } = useMultipleDocuments(config)

      expect(availableDocuments.value[0]).toMatchObject({
        title: 'my-api',
        slug: 'my-api',
      })
    })

    it('should generate both title and slug from index if neither exists', () => {
      const config = {
        configuration: ref({
          sources: [
            {
              url: '/openapi-1.yaml',
            },
            {
              url: '/openapi-2.yaml',
            },
          ],
        }),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { availableDocuments } = useMultipleDocuments(config)

      expect(availableDocuments.value[0]).toMatchObject({
        title: 'API #1',
        slug: 'api-1',
      })
      expect(availableDocuments.value[1]).toMatchObject({
        title: 'API #2',
        slug: 'api-2',
      })
    })

    it('should preserve existing slug when title is present', () => {
      const config = {
        configuration: ref({
          sources: [
            {
              url: '/openapi-1.yaml',
              title: 'My Cool API',
              slug: 'custom-slug',
            },
          ],
        }),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { availableDocuments } = useMultipleDocuments(config)

      expect(availableDocuments.value[0]).toMatchObject({
        title: 'My Cool API',
        slug: 'custom-slug',
      })
    })
  })

  describe('slugs', () => {
    it('generates slugs from the title', () => {
      mockUrl = new URL('http://example.com?slug=second-api')
      vi.spyOn(window, 'location', 'get').mockReturnValue(mockUrl as any)

      const multiConfig = {
        configuration: ref({
          sources: [
            {
              url: '/openapi-1.yaml',
              title: 'First API',
            },
            {
              url: '/openapi-2.yaml',
              title: 'Second API',
            },
          ],
        }),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { availableDocuments } = useMultipleDocuments(multiConfig)

      expect(availableDocuments.value[0].slug).toBe('first-api')
      expect(availableDocuments.value[1].slug).toBe('second-api')
      expect(availableDocuments.value[0].title).toBe('First API')
      expect(availableDocuments.value[1].title).toBe('Second API')
    })
  })

  describe('SSR compatibility', () => {
    it('works in SSR environment without window object', () => {
      // Temporarily remove window.location and window.history
      const originalWindow = global.window
      // @ts-expect-error Testing SSR environment
      global.window = undefined

      const config = {
        configuration: ref({
          sources: [
            {
              url: '/openapi-1.yaml',
              title: 'My API',
            },
          ],
        }),
        hash: ref(''),
        hashPrefix: ref(''),
        isIntersectionEnabled: ref(false),
      }

      const { selectedConfiguration, availableDocuments } = useMultipleDocuments(config)

      expect(availableDocuments.value).toHaveLength(1)
      expect(selectedConfiguration.value).toMatchObject({
        url: '/openapi-1.yaml',
        title: 'My API',
        slug: 'my-api',
      })

      // Restore window object
      global.window = originalWindow
    })
  })
})
