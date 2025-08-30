'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Loading from '@/components/loading'

interface SearchComponentProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void
  isLoading: boolean
}

export function SearchComponent({ handleSubmit, input, handleInputChange, isLoading }: SearchComponentProps) {
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pt-12">
      <div className="relative flex items-center group">
        <Search className="absolute left-4 w-6 h-6 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-orange-500" />
        <Input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything..."
          className="pl-14 pr-24 h-16 text-lg rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input || input.trim() === ''}
          className="absolute right-2 p-0 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed active:scale-95 transition-all duration-300 w-12 h-12 group"
        >
          {isLoading ? (
            <Loading text="" />
          ) : (
            <svg
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white transform transition-transform duration-300 group-hover:rotate-45"
            >
              <path
                d="M14 5l7 7m0 0l-7 7m7-7H3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          )}
        </button>
      </div>
      {isLoading && (
        <div className="mt-6 text-center">
          <Loading text="Searching the web..." />
        </div>
      )}
    </form>
  )
}