// "use client"

// import { useState, useRef, useEffect, KeyboardEvent } from 'react'
// import { motion, useInView, AnimatePresence } from 'framer-motion'
// import { Wand2, Copy, Check, Sparkles, AlertCircle } from 'lucide-react'
// import { Button } from '@/components/ui/button'

// const suggestions = [
//   "Create a React task list with animations",
//   "Build a responsive navbar with dropdown",
//   "Generate an API route with validation",
//   "Create a custom hook for form handling",
// ]

// export default function CodeGeneratorSection() {
//   const sectionRef = useRef(null)
//   const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

//   const [prompt, setPrompt]           = useState('')
//   const [code, setCode]               = useState('')
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [error, setError]             = useState('')
//   const [copied, setCopied]           = useState(false)
//   const [fileName, setFileName]       = useState('output.tsx')
//   const [currentSuggestion, setCurrentSuggestion] = useState(0)

//   // Rotate suggestions every 3s
//   useEffect(() => {
//     const id = setInterval(
//       () => setCurrentSuggestion(p => (p + 1) % suggestions.length),
//       3000
//     )
//     return () => clearInterval(id)
//   }, [])

//   // Typewriter effect — same as chatbot's typeMessage
//   const typeCode = async (fullCode: string) => {
//     setCode('')
//     let current = ''

//     for (let i = 0; i < fullCode.length; i++) {
//       current += fullCode[i]
//       setCode(current)
//       await new Promise(resolve => setTimeout(resolve, 8))
//     }
//   }

// const generateCode = async () => {
//   const userPrompt = prompt.trim() || suggestions[currentSuggestion];

//   if (!userPrompt || isGenerating) return;

//   setIsGenerating(true);
//   setCode("");
//   setError("");

//   const words = userPrompt
//     .replace(/[^a-zA-Z ]/g, "")
//     .split(" ")
//     .filter(Boolean);

//   const name = words
//     .slice(0, 2)
//     .map(
//       (w) => w.charAt(0).toUpperCase() + w.slice(1)
//     )
//     .join("");

//   setFileName(name ? `${name}.tsx` : "output.tsx");

//  try {
//  const response = await fetch("/api/generate-code", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     prompt: userPrompt,
//   }),
// });

// const data = await response.json();

// if (!response.ok) {
//   throw new Error(
//     data.error || "Something went wrong"
//   );
// }

// await typeCode(
//   data.code || "// No code generated"
// );
// } catch (error) {
//     console.error(error);

//     setError(
//       error instanceof Error
//         ? error.message
//         : "Something went wrong"
//     );
//   } finally {
//     setIsGenerating(false);
//   }
// };

//   const copyCode = () => {
//     if (!code) return
//     navigator.clipboard.writeText(code)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') generateCode()
//   }

//   const lines = (code || '//\n//').split('\n')

//   return (
//     <section id="generator" ref={sectionRef} className="relative py-32 overflow-hidden">
//       <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">

//           {/* ── LEFT ── */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={isInView ? { opacity: 1, x: 0 } : {}}
//             transition={{ duration: 0.8 }}
//           >
//             <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6">
//               Code Generator
//             </span>

//             <h2 className="text-4xl sm:text-5xl font-bold mb-6">
//               <span className="text-balance">From Idea to Code</span>
//               <br />
//               <span className="gradient-text">In Seconds</span>
//             </h2>

//             <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
//               Describe what you want to build in plain English and watch as
//               production-ready code materializes before your eyes. Complete with
//               best practices, TypeScript types, and modern patterns.
//             </p>

//             {/* Rotating suggestions */}
//             <div className="mb-6 p-4 rounded-xl bg-secondary/50 border border-border/50">
//               <p className="text-xs text-muted-foreground mb-2">Try prompts like:</p>
//               <AnimatePresence mode="wait">
//                 <motion.p
//                   key={currentSuggestion}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="text-sm font-medium text-primary"
//                 >
//                   &quot;{suggestions[currentSuggestion]}&quot;
//                 </motion.p>
//               </AnimatePresence>
//             </div>

//             {/* Input */}
//             <div className="flex gap-2 mb-4">
//               <input
//                 type="text"
//                 value={prompt}
//                 onChange={e => setPrompt(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Describe the code you want..."
//                 disabled={isGenerating}
//                 className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/60 border border-border/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//             </div>

//             <div className="flex flex-wrap gap-4">
//               <Button
//                 onClick={generateCode}
//                 disabled={isGenerating}
//                 className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 disabled:opacity-60"
//               >
//                 <Wand2 className="w-4 h-4 mr-2" />
//                 {isGenerating ? 'Generating...' : 'Generate Code'}
//               </Button>

//               <Button
//                 variant="outline"
//                 disabled={isGenerating}
//                 onClick={() => setPrompt(suggestions[currentSuggestion])}
//               >
//                 Use Suggestion
//               </Button>
//             </div>

//             {error && (
//               <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
//                 <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
//                 <span>{error}</span>
//               </div>
//             )}
//           </motion.div>

//           {/* ── RIGHT: Code Editor ── */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={isInView ? { opacity: 1, x: 0 } : {}}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="relative"
//           >
//             <div className="glass rounded-3xl overflow-hidden border-glow">

//               {/* Title bar */}
//               <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/50">
//                 <div className="flex items-center gap-3">
//                   <div className="flex gap-1.5">
//                     <span className="w-3 h-3 rounded-full bg-red-500" />
//                     <span className="w-3 h-3 rounded-full bg-yellow-500" />
//                     <span className="w-3 h-3 rounded-full bg-green-500" />
//                   </div>
//                   <span className="text-sm text-muted-foreground">{fileName}</span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   {isGenerating && (
//                     <span className="flex items-center gap-2 text-xs text-primary">
//                       <Sparkles className="w-3 h-3 animate-pulse" />
//                       Generating...
//                     </span>
//                   )}
//                   {code && !isGenerating && (
//                     <button
//                       onClick={copyCode}
//                       title="Copy code"
//                       className="p-2 rounded-lg hover:bg-secondary transition-colors"
//                     >
//                       {copied
//                         ? <Check className="w-4 h-4 text-green-500" />
//                         : <Copy className="w-4 h-4 text-muted-foreground" />}
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Code area */}
//               <div className="relative">
//                 <pre className="p-6 pl-14 overflow-x-auto max-h-[500px] text-sm font-mono leading-relaxed">
//                   <code className="text-foreground/90">
//                     {code
//                       ? code
//                       : (
//                         <span className="text-muted-foreground italic">
//                           {"// Your generated code will appear here...\n// Type a prompt and click Generate Code."}
//                         </span>
//                       )
//                     }
//                     {isGenerating && (
//                       <span className="animate-pulse ml-0.5">▋</span>
//                     )}
//                   </code>
//                 </pre>

//                 {/* Line numbers */}
//                 <div className="absolute left-0 top-0 p-6 w-10 text-right text-muted-foreground/40 text-sm font-mono leading-relaxed pointer-events-none select-none">
//                   {lines.map((_, i) => (
//                     <div key={i}>{i + 1}</div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 blur-2xl pointer-events-none" />
//           </motion.div>

//         </div>
//       </div>
//     </section>
//   )
// }


"use client"
// components/sections/code-generator-section.tsx

import { useRef, useState, useEffect, KeyboardEvent } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Sparkles, Copy, Check, Wand2, AlertCircle, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoginRequiredModal } from '@/components/ui/login-required-modal'
import { useAuthGuard } from '@/hooks/useAuthGuard'

const prompts = [
  "Create a React task list with animations",
  "Build a responsive navbar with dropdown",
  "Generate an API route with validation",
  "Create a custom hook for form handling",
]

export default function CodeGeneratorSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView   = useInView(sectionRef, { once: true, margin: "-100px" })

  const { isLoggedIn, showModal, closeModal, guardedAction } = useAuthGuard()

  const [copied,        setCopied]        = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [displayedCode, setDisplayedCode] = useState('')
  const [isGenerating,  setIsGenerating]  = useState(false)
  const [userPrompt,    setUserPrompt]    = useState('')
  const [error,         setError]         = useState('')
  const [fileName,      setFileName]      = useState('output.tsx')

  useEffect(() => {
    const id = setInterval(
      () => setCurrentPrompt(p => (p + 1) % prompts.length),
      3000,
    )
    return () => clearInterval(id)
  }, [])

  const typeCode = (fullCode: string) => {
    setDisplayedCode('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayedCode(fullCode.slice(0, i))
      if (i >= fullCode.length) clearInterval(id)
    }, 8)
  }

  const doGenerate = async () => {
    const prompt = userPrompt.trim() || prompts[currentPrompt]
    if (!prompt || isGenerating) return

    setIsGenerating(true)
    setDisplayedCode('')
    setError('')

    const words = prompt.replace(/[^a-zA-Z ]/g, '').split(' ').filter(Boolean)
    const name  = words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
    setFileName(name ? `${name}.tsx` : 'output.tsx')

    try {
      const res = await fetch('/api/generate-code', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ prompt }),
      })

      const data = await res.json()

      // If unauthorized — show login modal
      if (res.status === 401) {
        closeModal()
        setTimeout(() => guardedAction(() => {}), 100)
        return
      }

      if (!res.ok) throw new Error(data.error || `Server error: ${res.status}`)

      typeCode(data.code || '// No code returned')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.'
      setError(msg)
    } finally {
      setIsGenerating(false)
    }
  }

  // Guarded generate — shows modal if not logged in
  const generateCode = () => guardedAction(doGenerate)

  const copyCode = () => {
    if (!displayedCode) return
    navigator.clipboard.writeText(displayedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') generateCode()
  }

  const lines = (displayedCode || '//\n//').split('\n')

  return (
    <>
      {/* Login Modal */}
      <LoginRequiredModal
        isOpen={showModal}
        onClose={closeModal}
        feature="Code Generator"
      />

      <section id="generator" ref={sectionRef} className="relative py-32 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6">
                Code Generator
              </span>

              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                <span className="text-balance">From Idea to Code</span>
                <br />
                <span className="gradient-text">In Seconds</span>
              </h2>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
                Describe what you want to build in plain English and watch as
                production-ready code materializes before your eyes.
              </p>

              {/* Rotating suggestions */}
              <div className="mb-6 p-4 rounded-xl bg-secondary/50 border border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Try prompts like:</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentPrompt}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm font-medium text-primary"
                  >
                    &quot;{prompts[currentPrompt]}&quot;
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={userPrompt}
                  onChange={e => setUserPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isLoggedIn ? "Describe the code you want..." : "Login to generate code..."}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/60 border border-border/60 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={generateCode}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 disabled:opacity-60"
                >
                  {isLoggedIn
                    ? <Wand2 className="w-4 h-4 mr-2" />
                    : <Lock  className="w-4 h-4 mr-2" />
                  }
                  {isGenerating ? 'Generating...' : 'Generate Code'}
                </Button>

                <Button
                  variant="outline"
                  disabled={isGenerating}
                  onClick={() => setUserPrompt(prompts[currentPrompt])}
                >
                  Use Suggestion
                </Button>
              </div>

              {/* Not logged in hint */}
              {!isLoggedIn && (
                <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Login required to generate code
                </p>
              )}

              {error && (
                <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </motion.div>

            {/* RIGHT: Code Editor */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="glass rounded-3xl overflow-hidden border-glow">
                {/* Title bar */}
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/50">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">{fileName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isGenerating && (
                      <span className="flex items-center gap-2 text-xs text-primary">
                        <Sparkles className="w-3 h-3 animate-pulse" />
                        Generating...
                      </span>
                    )}
                    {displayedCode && !isGenerating && (
                      <button
                        onClick={copyCode}
                        title="Copy code"
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        {copied
                          ? <Check className="w-4 h-4 text-green-500" />
                          : <Copy  className="w-4 h-4 text-muted-foreground" />
                        }
                      </button>
                    )}
                  </div>
                </div>

                {/* Code body */}
                <div className="relative">
                  <pre className="p-6 pl-14 overflow-x-auto max-h-[500px] text-sm font-mono leading-relaxed">
                    <code className="text-foreground/90">
                      {displayedCode
                        ? displayedCode
                        : (
                          <span className="text-muted-foreground italic">
                            {"// Your generated code will appear here...\n// Type a prompt and click Generate Code."}
                          </span>
                        )
                      }
                      {isGenerating && <span className="animate-pulse ml-0.5">▋</span>}
                    </code>
                  </pre>

                  {/* Line numbers */}
                  <div className="absolute left-0 top-0 p-6 w-10 text-right text-muted-foreground/40 text-sm font-mono leading-relaxed pointer-events-none select-none">
                    {lines.map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 blur-2xl pointer-events-none" />
            </motion.div>

          </div>
        </div>
      </section>
    </>
  )
}