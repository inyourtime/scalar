import type { Spec } from '@scalar/types/legacy'

export const hasWebhooks = (spec?: Spec) => {
  if (!spec) {
    return false
  }

  if (Object.keys(spec?.webhooks ?? {}).length) {
    return true
  }

  return false
}
