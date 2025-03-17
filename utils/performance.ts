export function measurePerformance(componentName: string) {
  if (typeof window === "undefined" || !window.performance) return

  const start = performance.now()

  return () => {
    const end = performance.now()
    const duration = end - start

    // Log performance metrics
    console.log(`[Performance] ${componentName} rendered in ${duration.toFixed(2)}ms`)

    // Report to analytics in a real app
    // reportPerformanceMetric(componentName, duration)
  }
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

