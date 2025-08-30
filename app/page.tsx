'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { SearchComponent } from './search'
import { ChatInterface } from './chat-interface'
import { SearchResult, NewsResult, ImageResult } from './types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ErrorDisplay } from '@/components/error-display'
import Footer from '@/components/footer'

interface MessageData {
  sources: SearchResult[]
  newsResults?: NewsResult[]
  imageResults?: ImageResult[]
  followUpQuestions: string[]
  ticker?: string
}

export default function FireplexityPage() {
  const [sources, setSources] = useState<SearchResult[]>([])
  const [newsResults, setNewsResults] = useState<NewsResult[]>([])
  const [imageResults, setImageResults] = useState<ImageResult[]>([])
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([])
  const [searchStatus, setSearchStatus] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const lastDataLength = useRef(0)
  const [messageData, setMessageData] = useState<Map<number, MessageData>>(new Map())
  const currentMessageIndex = useRef(0)
  const [currentTicker, setCurrentTicker] = useState<string | null>(null)
  const [firecrawlApiKey, setFirecrawlApiKey] = useState<string>('')
  const [hasApiKey, setHasApiKey] = useState<boolean>(false)
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false)
  const [, setIsCheckingEnv] = useState<boolean>(true)
  const [pendingQuery, setPendingQuery] = useState<string>('')
  const [input, setInput] = useState<string>('')

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/fireplexity/search',
      body: firecrawlApiKey ? { firecrawlApiKey } : undefined
    })
  })
  
  // Single consolidated effect for handling streaming data
  useEffect(() => {
    // Handle response start
    if (status === 'streaming' && messages.length > 0) {
      const assistantMessages = messages.filter(m => m.role === 'assistant')
      const newIndex = assistantMessages.length
      
      // Only clear if we're starting a new message
      if (newIndex !== currentMessageIndex.current) {
        setSearchStatus('')
        setSources([])
        setNewsResults([])
        setImageResults([])
        setFollowUpQuestions([])
        setCurrentTicker(null)
        currentMessageIndex.current = newIndex
        lastDataLength.current = 0  // Reset data tracking for new message
      }
    }
    
    // Handle data parts from messages
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (!lastMessage.parts || lastMessage.parts.length === 0) return
      
      // Check if we've already processed this data
      const partsLength = lastMessage.parts.length
      if (partsLength === lastDataLength.current) return
      lastDataLength.current = partsLength
      
      // Process ALL parts to accumulate data
      let hasSourceData = false
      let latestSources: SearchResult[] = []
      let latestNewsResults: NewsResult[] = []
      let latestImageResults: ImageResult[] = []
      let latestTicker: string | null = null
      let latestFollowUpQuestions: string[] = []
      let latestStatus: string | null = null
      
      lastMessage.parts.forEach((part: any) => {
        // Handle different data part types
        if (part.type === 'data-sources' && part.data) {
          hasSourceData = true
          // Use the latest data from this part
          if (part.data.sources) latestSources = part.data.sources
          if (part.data.newsResults) latestNewsResults = part.data.newsResults
          if (part.data.imageResults) latestImageResults = part.data.imageResults
        }
        
        if (part.type === 'data-ticker' && part.data) {
          latestTicker = part.data.symbol
        }
        
        if (part.type === 'data-followup' && part.data && part.data.questions) {
          latestFollowUpQuestions = part.data.questions
        }
        
        if (part.type === 'data-status' && part.data) {
          latestStatus = part.data.message || ''
        }
      })
      
      // Apply updates
      if (hasSourceData) {
        setSources(latestSources)
        setNewsResults(latestNewsResults)
        setImageResults(latestImageResults)
      }
      if (latestTicker !== null) setCurrentTicker(latestTicker)
      if (latestFollowUpQuestions.length > 0) setFollowUpQuestions(latestFollowUpQuestions)
      if (latestStatus !== null) setSearchStatus(latestStatus)
      
      // Update message data map
      if (hasSourceData || latestTicker !== null || latestFollowUpQuestions.length > 0) {
        setMessageData(prevMap => {
          const newMap = new Map(prevMap)
          const existingData = newMap.get(currentMessageIndex.current) || { sources: [], followUpQuestions: [] }
          newMap.set(currentMessageIndex.current, {
            ...existingData,
            ...(hasSourceData && { 
              sources: latestSources,
              newsResults: latestNewsResults,
              imageResults: latestImageResults
            }),
            ...(latestTicker !== null && { ticker: latestTicker }),
            ...(latestFollowUpQuestions.length > 0 && { followUpQuestions: latestFollowUpQuestions })
          })
          return newMap
        })
      }
    }
  }, [status, messages.length, messages[messages.length - 1]?.parts?.length])

  // Check for environment variables on mount
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch('/api/fireplexity/check-env')
        const data = await response.json()
        
        if (data.hasFirecrawlKey) {
          setHasApiKey(true)
        } else {
          // Check localStorage for user's API key
          const storedKey = localStorage.getItem('firecrawl-api-key')
          if (storedKey) {
            setFirecrawlApiKey(storedKey)
            setHasApiKey(true)
          }
        }
      } catch (error) {
        // Error checking environment
      } finally {
        setIsCheckingEnv(false)
      }
    }
    
    checkApiKey()
  }, [])

  const handleApiKeySubmit = () => {
    if (firecrawlApiKey.trim()) {
      localStorage.setItem('firecrawl-api-key', firecrawlApiKey)
      setHasApiKey(true)
      setShowApiKeyModal(false)
      toast.success('API key saved successfully!')
      
      // If there's a pending query, submit it
      if (pendingQuery) {
        sendMessage({ text: pendingQuery })
        setPendingQuery('')
      }
    }
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    
    // Check if we have an API key
    if (!hasApiKey) {
      setPendingQuery(input)
      setShowApiKeyModal(true)
      return
    }
    
    setHasSearched(true)
    // Don't clear data here - wait for new data to arrive
    // This prevents layout jump
    sendMessage({ text: input })
    setInput('')
  }
  
  // Wrapped submit handler for chat interface
  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    
    // Check if we have an API key
    if (!hasApiKey) {
      setPendingQuery(input)
      setShowApiKeyModal(true)
      return
    }
    
    // Store current data in messageData before new query
    if (messages.length > 0 && sources.length > 0) {
      const assistantMessages = messages.filter(m => m.role === 'assistant')
      const lastAssistantIndex = assistantMessages.length - 1
      if (lastAssistantIndex >= 0) {
        const newMap = new Map(messageData)
        newMap.set(lastAssistantIndex, {
          sources: sources,
          newsResults: newsResults,
          imageResults: imageResults,
          followUpQuestions: followUpQuestions,
          ticker: currentTicker || undefined
        })
        setMessageData(newMap)
      }
    }
    
    // Don't clear data here - wait for new data to arrive
    // The useEffect will clear when it detects a new assistant message starting
    sendMessage({ text: input })
    setInput('')
  }

  const isChatActive = hasSearched || messages.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with logo - fixed width to prevent jumping */}
      <header className="px-4 sm:px-6 lg:px-8 py-1 mt-2">
        <div className="max-w-[1216px] mx-auto flex items-center justify-between">
          <Link
            href="/"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Image 
              src="https://tfbod41w6i.ufs.sh/f/ZJzgmIXu5Ge1sn6kSplc5oASTGquXHFMks4aO9rZ2YWwdjlP"
              alt="baseevidence por laudos.ai"
              width={360}
              height={96}
              className="h-24 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Hero section - matching other pages */}
      <div className={`px-4 sm:px-6 lg:px-8 pt-16 pb-8 ${isChatActive ? 'hidden' : 'block'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            <span className="text-orange-500 block">
              baseevidence
            </span>
            <span className="text-gray-900 dark:text-white block">
              por laudos.ai
            </span>
          </h1>
          <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Busca inteligente com IA, notícias, imagens e informações em tempo real.
          </p>
        </div>
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-full">
          {!isChatActive ? (
            <SearchComponent 
              handleSubmit={handleSearch}
              input={input}
              handleInputChange={(e) => setInput(e.target.value)}
              isLoading={status === 'streaming'}
            />
          ) : (
            <ChatInterface 
              messages={messages}
              sources={sources}
              newsResults={newsResults}
              imageResults={imageResults}
              followUpQuestions={followUpQuestions}
              searchStatus={searchStatus}
              isLoading={status === 'streaming'}
              input={input}
              handleInputChange={(e) => setInput(e.target.value)}
              handleSubmit={handleChatSubmit}
              messageData={messageData}
              currentTicker={currentTicker}
            />
          )}
        </div>
      </div>

      
      {/* API Key Modal */}
      <Dialog open={showApiKeyModal} onOpenChange={setShowApiKeyModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Firecrawl API Key Required</DialogTitle>
            <DialogDescription className="text-base">
              To use Fireplexity, you need a Firecrawl API key. Get one for free at{' '}
              <a 
                href="https://www.firecrawl.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 font-semibold underline"
              >
                firecrawl.dev
              </a>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Enter your Firecrawl API key"
              value={firecrawlApiKey}
              onChange={(e) => setFirecrawlApiKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleApiKeySubmit()
                }
              }}
              className="h-14 text-lg rounded-full border-2"
            />
            <Button onClick={handleApiKeySubmit} variant="orange" size="lg" className="w-full">
              Save API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  )
}