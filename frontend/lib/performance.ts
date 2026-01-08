// Performance monitoring utilities for frontend

export interface PerformanceMetrics {
  loadTime: number
  domContentLoaded: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {}
  private observers: PerformanceObserver[] = []

  constructor() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      this.init()
    }
  }

  private init() {
    // Page load metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.collectLoadMetrics()
      }, 0)
    })

    // Web Vitals monitoring
    this.observeWebVitals()
  }

  private collectLoadMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    this.metrics = {
      loadTime: navigation.loadEventEnd - navigation.fetchStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
    }
  }

  private observeWebVitals() {
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.firstContentfulPaint = entry.startTime
            }
          })
        })
        observer.observe({ type: 'paint', buffered: true })
        this.observers.push(observer)
      } catch (e) {
        console.warn('Paint observer not supported')
      }

      // Largest Contentful Paint
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          this.metrics.largestContentfulPaint = lastEntry.startTime
        })
        observer.observe({ type: 'largest-contentful-paint', buffered: true })
        this.observers.push(observer)
      } catch (e) {
        console.warn('LCP observer not supported')
      }

      // Cumulative Layout Shift
      try {
        let clsValue = 0
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          })
          this.metrics.cumulativeLayoutShift = clsValue
        })
        observer.observe({ type: 'layout-shift', buffered: true })
        this.observers.push(observer)
      } catch (e) {
        console.warn('CLS observer not supported')
      }

      // First Input Delay
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime
          })
        })
        observer.observe({ type: 'first-input', buffered: true })
        this.observers.push(observer)
      } catch (e) {
        console.warn('FID observer not supported')
      }
    }
  }

  public getMetrics(): PerformanceMetrics {
    return {
      loadTime: this.metrics.loadTime || 0,
      domContentLoaded: this.metrics.domContentLoaded || 0,
      firstContentfulPaint: this.metrics.firstContentfulPaint || 0,
      largestContentfulPaint: this.metrics.largestContentfulPaint || 0,
      cumulativeLayoutShift: this.metrics.cumulativeLayoutShift || 0,
      firstInputDelay: this.metrics.firstInputDelay || 0,
    }
  }

  public logPerformance() {
    const metrics = this.getMetrics()
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics')
      console.table(metrics)
      console.groupEnd()
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metrics)
    }
  }

  private sendToAnalytics(metrics: PerformanceMetrics) {
    // Send to your analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_performance', {
        custom_map: {
          dimension1: 'load_time',
          dimension2: 'fcp',
          dimension3: 'lcp',
          dimension4: 'cls',
          dimension5: 'fid',
        },
        load_time: metrics.loadTime,
        fcp: metrics.firstContentfulPaint,
        lcp: metrics.largestContentfulPaint,
        cls: metrics.cumulativeLayoutShift,
        fid: metrics.firstInputDelay,
      })
    }
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect())
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Hook for React components
export function usePerformanceMonitor() {
  return {
    getMetrics: () => performanceMonitor.getMetrics(),
    logPerformance: () => performanceMonitor.logPerformance(),
  }
}
