import { cn } from "@/lib/utils";
import * as React from "react";
import { Input } from "./input";

export interface InputWithPrefixProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
}

const InputWithPrefix = React.forwardRef<
  HTMLInputElement,
  InputWithPrefixProps
>(({ className, prefix, ...props }, ref) => {
  const prefixRef = React.useRef<HTMLDivElement>(null);
  const [prefixWidth, setPrefixWidth] = React.useState(0);

  React.useEffect(() => {
    if (prefixRef.current) {
      setPrefixWidth(prefixRef.current.offsetWidth);
    }
  }, [prefix]);

  if (!prefix) {
    return <Input className={className} ref={ref} {...props} />;
  }

  return (
    <div className='relative'>
      <div
        ref={prefixRef}
        className='absolute left-0 top-0 h-full flex items-center pointer-events-none bg-gray-50 dark:bg-gray-800 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-md px-3'
      >
        <span className='text-gray-500 dark:text-gray-400 text-sm'>
          {prefix}
        </span>
      </div>
      <Input
        className={cn("rounded-l-none", className)}
        style={{
          paddingLeft: prefixWidth > 0 ? `${prefixWidth}px` : undefined,
        }}
        ref={ref}
        {...props}
      />
    </div>
  );
});

InputWithPrefix.displayName = "InputWithPrefix";

export { InputWithPrefix };
