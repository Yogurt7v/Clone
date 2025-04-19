import React, { ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  className?: string
  children: React.ReactNode
  errorMessage?: string
  componentName?: string
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    console.log('error', error)

    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Ошибка в ${this.props.componentName || 'компоненте'}:`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={`text-black text-[20px] ${this.props.className}`}>
          {this.props.errorMessage || 'Что-то пошло не так.'}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
