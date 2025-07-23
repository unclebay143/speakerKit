import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  onCreateOption?: (label: string) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  onCreateOption,
}) => {
  const [inputValue, setInputValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(
    (opt) =>
      !value.includes(opt.value) &&
      !value.includes(opt.label) &&
      opt.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (option: Option) => {
    onChange([...value, option.value]);
    setInputValue("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleRemove = (val: string) => {
    onChange(value.filter((v) => v !== val));
  };

  React.useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const canCreate =
    !!onCreateOption &&
    inputValue.trim().length > 0 &&
    !options.some(
      (opt) =>
        opt.label.toLowerCase() === inputValue.trim().toLowerCase() ||
        opt.value.toLowerCase() === inputValue.trim().toLowerCase()
    );

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <div
        className={
          "flex flex-wrap items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-within:ring-2 ring-purple-500 min-h-[44px] cursor-text"
        }
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {value.length > 0 &&
          value.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                className='flex items-center gap-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 rounded px-2 py-0.5 text-xs'
              >
                {opt?.label || val}
                <button
                  type='button'
                  className='ml-1 text-purple-400 hover:text-purple-700 dark:hover:text-purple-100'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(val);
                  }}
                  aria-label='Remove'
                >
                  <X className='w-3 h-3' />
                </button>
              </span>
            );
          })}
        <input
          ref={inputRef}
          className='flex-1 bg-transparent outline-none min-w-[80px] text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400'
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={value.length === 0 ? placeholder : ""}
        />
      </div>
      {isOpen && (filteredOptions.length > 0 || canCreate) && (
        <div className='absolute left-0 right-0 mt-1 bg-white text-gray-900 dark:bg-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-20 max-h-48 overflow-auto'>
          {filteredOptions.map((opt) => (
            <div
              key={opt.value}
              className='px-4 py-2 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 text-sm'
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </div>
          ))}
          {canCreate && (
            <div
              className='px-4 py-2 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 text-sm font-semibold text-purple-700 dark:text-purple-300'
              onClick={async () => {
                if (onCreateOption) {
                  await onCreateOption(inputValue.trim());
                  onChange([...(value || []), inputValue.trim()]);
                } else {
                  // fallback: add as value/label
                  onChange([...value, inputValue.trim()]);
                }
                setInputValue("");
                setIsOpen(false);
                inputRef.current?.focus();
              }}
            >
              Add "{inputValue.trim()}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
