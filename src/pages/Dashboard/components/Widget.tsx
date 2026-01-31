import type { ReactNode } from 'react'

interface WidgetProps {
  children: ReactNode
}

export const Widget = ({ children }: WidgetProps) => {
  return (
    <div className="w-full flex flex-1 min-h-0 flex-col">
      {children}
    </div>
  )
}
