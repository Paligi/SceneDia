'use client'

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import Button from "@/components/ui/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const fonts = [
  {
    value: "noto-sans",
    label: "Noto Sans SC",
    preview: "优雅现代",
  },
  {
    value: "source-han",
    label: "思源黑体",
    preview: "清晰易读",
  },
  {
    value: "harmony-sans",
    label: "鸿蒙黑体",
    preview: "简约大方",
  },
  {
    value: "lxgw",
    label: "霞鹜文楷",
    preview: "传统书法",
  },
] as const

type Font = (typeof fonts)[number];

export function FontSelector({
  onFontChange
}: {
  onFontChange: (font: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [selectedFont, setSelectedFont] = React.useState<Font>(fonts[0])

  const handleSelect = (font: Font) => {
    setSelectedFont(font);
    onFontChange(font.value);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <span className={`font-${selectedFont.value}`}>
            {selectedFont.label}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="搜索字体..." />
          <CommandEmpty>未找到字体</CommandEmpty>
          <CommandGroup>
            {fonts.map((font) => (
              <CommandItem
                key={font.value}
                value={font.value}
                onSelect={() => handleSelect(font)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedFont.value === font.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <div>
                  <div className={`font-${font.value}`}>{font.label}</div>
                  <div className="text-sm text-muted-foreground">{font.preview}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 