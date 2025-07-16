'use client'

import clsx from 'clsx'
import { z } from 'zod'
import Picker from 'react-mobile-picker'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'

export type PickerType = string
export type PickerOptions = Record<string, string[]>

interface DatePickerProps {
  pickers: PickerOptions
  selected: Record<string, string>
  setSelected: (val: Record<string, string>) => void
  labels?: Record<string, string>
  className?: string
  triggerClassNames?: Record<string, string>
  confirmText?: (picker: string, value: string) => React.ReactNode
}

export default function DatePicker({
  pickers,
  selected,
  setSelected,
  confirmText = (picker, value) => `select : ${value}`,
  className = '',
  triggerClassNames = {},
}: DatePickerProps) {
  const [activePicker, setActivePicker] = useState<PickerType | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const PickerContent = (picker: PickerType) => (
    <Picker
      value={{ [picker]: selected[picker] }}
      onChange={(val) => setSelected({ ...selected, [picker]: val[picker] })}
      height={180}
      itemHeight={40}
      className="text-lg font-medium"
    >
      <Picker.Column name={picker}>
        {pickers[picker].map((val) => (
          <Picker.Item key={val} value={val}>
            {val}
          </Picker.Item>
        ))}
      </Picker.Column>
    </Picker>
  )

  const DesktopPickerContent: React.FC<{
    picker: PickerType
    options: string[]
    selected: Record<string, string>
    setSelected: (val: Record<string, string>) => void
    onConfirm?: () => void
  }> = ({ picker, options, selected, setSelected, onConfirm }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const selectedItemRef = React.useRef<HTMLDivElement>(null)

    const schema = z.object({ value: z.string() })
    const { handleSubmit, setValue, watch } = useForm<{ value: string }>({
      resolver: zodResolver(schema),
      defaultValues: { value: selected[picker] },
    })
    const tempSelected = watch('value')

    useEffect(() => {
      selectedItemRef.current?.scrollIntoView({ block: 'center', behavior: 'auto' })
    }, [])

    const [isDragging, setIsDragging] = useState(false)
    const [startY, setStartY] = useState(0)
    const [scrollTop, setScrollTop] = useState(0)

    const onMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true)
      setStartY(e.clientY)
      setScrollTop(scrollRef.current?.scrollTop || 0)
    }

    const onMouseMove = (e: React.MouseEvent) => {
      if (!isDragging || !scrollRef.current) return
      scrollRef.current.scrollTop = scrollTop - (e.clientY - startY)
    }

    const onMouseUp = () => setIsDragging(false)

    const onWheel = (e: React.WheelEvent) => {
      if (!scrollRef.current) return
      e.preventDefault()
      scrollRef.current.scrollTop += e.deltaY * 0.2
    }

    const onSubmit = (data: { value: string }) => {
      setSelected({ ...selected, [picker]: data.value })
      if (onConfirm) onConfirm()
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full justify-between">
        <div
          ref={scrollRef}
          className="relative h-[180px] no-scrollbar overflow-y-auto scroll-smooth flex items-center flex-col gap-1 select-none"
          style={{
            WebkitOverflowScrolling: 'touch',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onWheel={onWheel}
        >
          {options.map((val) => {
            const isSelected = tempSelected === val
            return (
              <div
                key={val}
                ref={isSelected ? selectedItemRef : null}
                className={clsx(
                  'w-18 text-center border-b text-sm font-medium cursor-pointer transition-all duration-200 select-none py-1 hover:rounded-lg',
                  isSelected
                    ? 'bg-gradient-to-r from-purple-200 to-purple-100 text-purple-700 transition border-gray-200 rounded-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                )}
                onClick={() => setValue('value', val)}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
              >
                {val}
              </div>
            )
          })}
        </div>
        <Button type="submit" className="w-full mt-4">
          select
        </Button>
      </form>
    )
  }

  return (
    <div className={clsx('w-full flex items-center justify-between gap-2 mt-10', className)}>
      {Object.keys(pickers).map((picker) => {
        const triggerClass = triggerClassNames[picker] || ''

        return (
          <div key={picker}>
            {isMobile ? (
              <Sheet
                open={activePicker === picker}
                onOpenChange={(o) => setActivePicker(o ? picker : null)}
              >
                <SheetTrigger asChild>
                  <Button variant="outline" className={triggerClass}>
                    <span
                      className={
                        selected[picker]?.startsWith('Exp:')
                          ? 'text-[10px] font-medium text-light-gray'
                          : 'text-xs font-bold'
                      }
                    >
                      {selected[picker]}
                    </span>{' '}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="w-full h-[36vh] pt-10">
                  <div className="flex flex-col h-full justify-between">
                    {PickerContent(picker)}
                    <div className="mx-4 my-4">
                      <Button
                        onClick={() => setActivePicker(null)}
                        className="w-full py-3.5 h-fit rounded-2xl"
                      >
                        {confirmText(picker, selected[picker])}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Dialog
                open={activePicker === picker}
                onOpenChange={(o) => setActivePicker(o ? picker : null)}
              >
                <DialogTrigger className="flex w-full" asChild>
                  <Button variant="outline" className={triggerClass} type="button">
                    <span
                      className={
                        selected[picker]?.startsWith('Exp:')
                          ? 'text-[10px] font-medium text-light-gray'
                          : 'text-xs font-medium'
                      }
                    >
                      {selected[picker]}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-40 py-6 overflow-visible">
                  <DialogTitle>
                    <span className="sr-only">value</span>
                  </DialogTitle>
                  <div className="flex flex-col h-64">
                    <DesktopPickerContent
                      picker={picker}
                      options={pickers[picker]}
                      selected={selected}
                      setSelected={setSelected}
                      onConfirm={() => setActivePicker(null)}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )
      })}
    </div>
  )
}
