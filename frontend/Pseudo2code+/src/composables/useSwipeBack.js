import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

/**
 * Composable that detects a right-swipe gesture (finger moves left→right)
 * starting from the left edge of the screen, then navigates back.
 *
 * @param {Object} options
 * @param {number} options.edgeWidth   - Max X for touch start (px). Default 40.
 * @param {number} options.threshold   - Min horizontal distance (px). Default 80.
 * @param {number} options.maxVertical - Max vertical drift (px). Default 60.
 */
export function useSwipeBack(options = {}) {
  const router = useRouter()
  const edgeWidth = options.edgeWidth ?? 40
  const threshold = options.threshold ?? 80
  const maxVertical = options.maxVertical ?? 60

  let startX = 0
  let startY = 0
  let tracking = false

  function onTouchStart(e) {
    const touch = e.touches[0]
    if (touch.clientX <= edgeWidth) {
      startX = touch.clientX
      startY = touch.clientY
      tracking = true
    }
  }

  function onTouchEnd(e) {
    if (!tracking) return
    tracking = false

    const touch = e.changedTouches[0]
    const dx = touch.clientX - startX
    const dy = Math.abs(touch.clientY - startY)

    if (dx >= threshold && dy <= maxVertical) {
      router.back()
    }
  }

  onMounted(() => {
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
  })

  onUnmounted(() => {
    document.removeEventListener('touchstart', onTouchStart)
    document.removeEventListener('touchend', onTouchEnd)
  })
}
