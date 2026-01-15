import { useRef, type KeyboardEvent, type ClipboardEvent, type ChangeEvent } from 'react'
import { motion } from 'framer-motion'

interface OtpInputProps {
    value: string
    onChange: (value: string) => void
    length?: number
    disabled?: boolean
    className?: string
}

export const OtpInput = ({ value, onChange, length = 6, disabled = false, className = '' }: OtpInputProps) => {
    const inputs = useRef<(HTMLInputElement | null)[]>([])

    // Ensure value is always provided and of correct length visually (padded with empty strings if not)
    // But we rely on parent to pass correct string length

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value
        if (disabled) return

        // Allow only digits
        if (!/^\d*$/.test(val)) return

        // Get the last character entered (handle cases where input might have previous value)
        const char = val.slice(-1)

        const newValue = value.split('')
        // Extend if needed
        while (newValue.length < length) newValue.push('')

        newValue[index] = char
        const newString = newValue.join('').slice(0, length)
        onChange(newString)

        // Auto focus next
        if (char && index < length - 1) {
            inputs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (disabled) return

        if (e.key === 'Backspace') {
            if (!value[index] && index > 0) {
                // If empty, move back and delete that one
                const newValue = value.split('')
                newValue[index - 1] = ''
                onChange(newValue.join(''))
                inputs.current[index - 1]?.focus()
            } else {
                // Just delete current
                const newValue = value.split('')
                newValue[index] = ''
                onChange(newValue.join(''))
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputs.current[index - 1]?.focus()
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputs.current[index + 1]?.focus()
        }
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (disabled) return

        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
        if (pastedData) {
            onChange(pastedData)
            // Focus last filled input or end
            const focusIndex = Math.min(pastedData.length, length - 1)
            inputs.current[focusIndex]?.focus()
        }
    }

    return (
        <div className={`flex gap-2 sm:gap-3 justify-center ${className}`}>
            {Array.from({ length }).map((_, i) => (
                <motion.input
                    key={i}
                    ref={(el) => { inputs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[i] || ''}
                    placeholder="-"
                    disabled={disabled}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="h-12 w-10 sm:h-14 sm:w-12 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] text-center text-xl font-bold text-[var(--page-fg)] shadow-sm outline-none transition-all placeholder:text-[var(--text-muted)] focus:border-[#3498db] focus:ring-4 focus:ring-[#3498db]/10 disabled:opacity-50"
                />
            ))}
        </div>
    )
}
