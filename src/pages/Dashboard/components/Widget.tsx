import type { ReactNode } from 'react'

interface WidgetProps {
  children: ReactNode
}

export const Widget = ({ children }: WidgetProps) => {
  return (
    <div className="w-full">
      {children}
    </div>
  )
}

