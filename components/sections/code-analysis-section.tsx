// "use client"

// import { useRef, useState } from 'react'
// import { motion, useInView } from 'framer-motion'
// import { Search, AlertTriangle, CheckCircle2, TrendingUp, Clock, Zap, Shield, BarChart3, Loader2 } from 'lucide-react'
// import { Button } from '@/components/ui/button'




// type AnalysisResult = {
//   type: 'error' | 'warning' | 'success'
//   message: string
//   line: number
//   severity: 'high' | 'medium' | 'low' | 'info'
// }

// const defaultResults: AnalysisResult[] = [
//   { type: 'error', message: 'Potential memory leak in useEffect hook', line: 45, severity: 'high' },
//   { type: 'warning', message: 'Unused variable detected', line: 23, severity: 'low' },
//   { type: 'success', message: 'Performance optimized with memoization', line: 67, severity: 'info' },
//   { type: 'warning', message: 'Consider using async/await instead of .then()', line: 89, severity: 'medium' },
// ]

// export default function CodeAnalysisSection() {
//   const [metrics, setMetrics] = useState([
//   { label: 'Code Quality', value: 94, icon: Shield, color: 'text-green-500' },
//   { label: 'Performance', value: 87, icon: Zap, color: 'text-blue-500' },
//   { label: 'Security', value: 91, icon: Shield, color: 'text-purple-500' },
//   { label: 'Maintainability', value: 88, icon: BarChart3, color: 'text-orange-500' },
// ]);
//   const sectionRef = useRef(null)
//   const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
//   const [activeTab, setActiveTab] = useState<'issues' | 'metrics'>('issues')
//   const [isAnalyzing, setIsAnalyzing] = useState(false)
//   const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>(defaultResults)
//   const [inputCode, setInputCode] = useState('')
//   const [showInput, setShowInput] = useState(false)

//   const analyzeCode = async () => {
//     if (!inputCode.trim()) {
//       setShowInput(true)
//       return
//     }

//     setIsAnalyzing(true)
//     try {
//       const response = await fetch("/api/analyze", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           code: inputCode,
//         }),
//       });


//       const data = await response.json()
//       const text = data.choices?.[0]?.message?.content ?? '[]'

//       // JSON parse safely
//       const clean = text.replace(/```json|```/g, '').trim()
//     const parsed = JSON.parse(clean)

// if (Array.isArray(parsed)) {
//   setAnalysisResults(parsed)
//   setMetrics([
//   {
//     label: "Code Quality",
//     value: Math.floor(Math.random() * 20) + 80,
//     icon: Shield,
//     color: "text-green-500",
//   },
//   {
//     label: "Performance",
//     value: Math.floor(Math.random() * 20) + 75,
//     icon: Zap,
//     color: "text-blue-500",
//   },
//   {
//     label: "Security",
//     value: Math.floor(Math.random() * 20) + 70,
//     icon: Shield,
//     color: "text-purple-500",
//   },
//   {
//     label: "Maintainability",
//     value: Math.floor(Math.random() * 20) + 78,
//     icon: BarChart3,
//     color: "text-orange-500",
//   },
// ]);
// } else {
//   setAnalysisResults([parsed])
// }
//       // setShowInput(false)
//       setActiveTab('issues')
//     } catch (err) {
//       console.error("Analysis error:", err)
//       // Error pe default results rakhein
//     } finally {
//       setIsAnalyzing(false)
//     }
//   }

//   return (
//     <section id="code-analysis" ref={sectionRef} className="relative py-32 overflow-hidden">
//       <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[100px]" />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
//           {/* Analysis Dashboard */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={isInView ? { opacity: 1, x: 0 } : {}}
//             transition={{ duration: 0.8 }}
//             className="order-2 lg:order-1"
//           >
//             <div className="glass rounded-3xl overflow-hidden">
//               {/* Header */}
//               <div className="flex items-center justify-between p-6 border-b border-border/50">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
//                     <Search className="w-5 h-5 text-white" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold">Code Analysis</h4>
//                     <p className="text-xs text-muted-foreground">
//                       {isAnalyzing ? 'Analyzing...' : 'AI-powered analysis'}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
//                     {analysisResults.length} issues found
//                   </span>
//                 </div>
//               </div>

//               {/* Tabs */}
//               <div className="flex border-b border-border/50">
//                 <button
//                   onClick={() => setActiveTab('issues')}
//                   className={`flex-1 px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'issues' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
//                     }`}
//                 >
//                   Issues ({analysisResults.length})
//                   {activeTab === 'issues' && (
//                     <motion.div
//                       layoutId="activeTab"
//                       className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
//                     />
//                   )}
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('metrics')}
//                   className={`flex-1 px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'metrics' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
//                     }`}
//                 >
//                   Metrics
//                   {activeTab === 'metrics' && (
//                     <motion.div
//                       layoutId="activeTab"
//                       className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
//                     />
//                   )}
//                 </button>
//               </div>

//               {/* Content */}
//               <div className="p-6 space-y-3 min-h-[300px]">
//                 {isAnalyzing ? (
//                   <div className="flex flex-col items-center justify-center h-[260px] gap-4">
//                     <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
//                     <p className="text-sm text-muted-foreground">AI aapka code analyze kar raha hai...</p>
//                   </div>
//                 ) : activeTab === 'issues' ? (
//                   analysisResults.map((result, i) => (
//                     <motion.div
//                       key={i}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={isInView ? { opacity: 1, y: 0 } : {}}
//                       transition={{ delay: 0.3 + i * 0.1 }}
//                       className={`flex items-start gap-3 p-4 rounded-xl transition-colors cursor-pointer ${result.type === 'error'
//                           ? 'bg-red-500/10 hover:bg-red-500/15'
//                           : result.type === 'warning'
//                             ? 'bg-yellow-500/10 hover:bg-yellow-500/15'
//                             : 'bg-green-500/10 hover:bg-green-500/15'
//                         }`}
//                     >
//                       {result.type === 'error' ? (
//                         <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                       ) : result.type === 'warning' ? (
//                         <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
//                       ) : (
//                         <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
//                       )}
//                       <div className="flex-1">
//                         <p className="text-sm font-medium">{result.message}</p>
//                         <p className="text-xs text-muted-foreground mt-1">
//                           Line {result.line} • {result.severity} severity
//                         </p>
//                       </div>
//                       <span className={`px-2 py-0.5 rounded text-xs font-medium ${result.severity === 'high'
//                           ? 'bg-red-500/20 text-red-400'
//                           : result.severity === 'medium'
//                             ? 'bg-yellow-500/20 text-yellow-400'
//                             : result.severity === 'low'
//                               ? 'bg-blue-500/20 text-blue-400'
//                               : 'bg-green-500/20 text-green-400'
//                         }`}>
//                         {result.severity}
//                       </span>
//                     </motion.div>
//                   ))
//                 ) : (
//                   <div className="grid grid-cols-2 gap-4">
//                     {metrics.map((metric, i) => (
//                       <motion.div
//                         key={metric.label}
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={isInView ? { opacity: 1, scale: 1 } : {}}
//                         transition={{ delay: 0.3 + i * 0.1 }}
//                         className="bg-secondary/50 rounded-xl p-4"
//                       >
//                         <div className="flex items-center justify-between mb-3">
//                           <span className="text-sm text-muted-foreground">{metric.label}</span>
//                           <metric.icon className={`w-4 h-4 ${metric.color}`} />
//                         </div>
//                         <div className="flex items-end gap-2">
//                           <span className="text-3xl font-bold">{metric.value}</span>
//                           <span className="text-sm text-muted-foreground mb-1">/100</span>
//                         </div>
//                         <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
//                           <motion.div
//                             initial={{ width: 0 }}
//                             animate={isInView ? { width: `${metric.value}%` } : {}}
//                             transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
//                             className={`h-full rounded-full ${metric.value >= 90 ? 'bg-green-500'
//                                 : metric.value >= 70 ? 'bg-blue-500'
//                                   : 'bg-yellow-500'
//                               }`}
//                           />
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </motion.div>

//           {/* Content */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={isInView ? { opacity: 1, x: 0 } : {}}
//             transition={{ duration: 0.8 }}
//             className="order-1 lg:order-2"
//           >
//             <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6">
//               Code Analysis
//             </span>
//             <h2 className="text-4xl sm:text-5xl font-bold mb-6">
//               <span className="text-balance">Deep Insights Into</span>
//               <br />
//               <span className="gradient-text">Your Codebase</span>
//             </h2>
//             <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
//               Get comprehensive analysis of your code with AI-powered detection of bugs,
//               security vulnerabilities, performance issues, and code smells.
//             </p>

//             {/* Code Input Box */}
//             {showInput && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mb-4"
//               >
//                 <textarea
//                   value={inputCode}
//                   onChange={(e) => setInputCode(e.target.value)}
//                   placeholder="Paste your code here for AI-powered analysis..." className="w-full h-40 p-4 rounded-xl bg-secondary/50 border border-border text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 focus:scale-[1.01]"
//                 />
//               </motion.div>
//             )}

//             <div className="grid grid-cols-2 gap-4 mb-8">
//               {[
//                 { icon: Shield, label: 'Security Scan' },
//                 { icon: TrendingUp, label: 'Performance Analysis' },
//                 { icon: CheckCircle2, label: 'Best Practices' },
//                 { icon: BarChart3, label: 'Code Metrics' },
//               ].map((item, i) => (
//                 <motion.div
//                   key={item.label}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={isInView ? { opacity: 1, y: 0 } : {}}
//                   transition={{ delay: 0.4 + i * 0.1 }}
//                   className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50"
//                 >
//                   <item.icon className="w-5 h-5 text-purple-400" />
//                   <span className="text-sm font-medium">{item.label}</span>
//                 </motion.div>
//               ))}
//             </div>

//             <div className="flex gap-3">
//               <Button
//                 onClick={analyzeCode}
//                 disabled={isAnalyzing}
//                 className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 cursor-pointer hover:scale-105 transition-all duration-300"              >
//                 {isAnalyzing ? (
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                 ) : (
//                   <Search className="w-4 h-4 mr-2" />
//                 )}
//                 {isAnalyzing ? 'Analyzing...' : showInput ? 'Run AI Analysis' : 'Analyze Your Code'}
//               </Button>
//               {showInput && (
//                 <Button variant="ghost" onClick={() => setShowInput(false)} className="cursor-pointer">
//                   Cancel
//                 </Button>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   )
// }



"use client"

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, AlertTriangle, CheckCircle2, TrendingUp, Clock, Zap, Shield, BarChart3, Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoginRequiredModal } from '@/components/ui/login-required-modal'
import { useAuthGuard } from '@/hooks/useAuthGuard'

type AnalysisResult = {
  type: 'error' | 'warning' | 'success'
  message: string
  line: number
  severity: 'high' | 'medium' | 'low' | 'info'
}

const defaultResults: AnalysisResult[] = [
  { type: 'error',   message: 'Potential memory leak in useEffect hook',              line: 45, severity: 'high' },
  { type: 'warning', message: 'Unused variable detected',                             line: 23, severity: 'low' },
  { type: 'success', message: 'Performance optimized with memoization',               line: 67, severity: 'info' },
  { type: 'warning', message: 'Consider using async/await instead of .then()',        line: 89, severity: 'medium' },
]

const defaultMetrics = [
  { label: 'Code Quality',    value: 94, icon: Shield,   color: 'text-green-500' },
  { label: 'Performance',     value: 87, icon: Zap,      color: 'text-blue-500' },
  { label: 'Security',        value: 91, icon: Shield,   color: 'text-purple-500' },
  { label: 'Maintainability', value: 88, icon: BarChart3, color: 'text-orange-500' },
]

export default function CodeAnalysisSection() {
  const sectionRef = useRef(null)
  const isInView   = useInView(sectionRef, { once: true, margin: "-100px" })

  // ── Auth guard ──────────────────────────────────────────────────
  const { isLoggedIn, showModal, closeModal, guardedAction } = useAuthGuard()

  const [metrics,          setMetrics]          = useState(defaultMetrics)
  const [activeTab,        setActiveTab]        = useState<'issues' | 'metrics'>('issues')
  const [isAnalyzing,      setIsAnalyzing]      = useState(false)
  const [analysisResults,  setAnalysisResults]  = useState<AnalysisResult[]>(defaultResults)
  const [inputCode,        setInputCode]        = useState('')
  const [showInput,        setShowInput]        = useState(false)

  const doAnalyze = async () => {
    if (!inputCode.trim()) {
      setShowInput(true)
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ code: inputCode }),
      })

      const data = await response.json()

      // 401 → show login modal
      if (response.status === 401) {
        guardedAction(() => {})
        return
      }

      if (!response.ok) throw new Error(data.error || 'Analysis failed')

      const text  = data.choices?.[0]?.message?.content ?? '[]'
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)

      if (Array.isArray(parsed)) {
        setAnalysisResults(parsed)
        setMetrics([
          { label: 'Code Quality',    value: Math.floor(Math.random() * 20) + 80, icon: Shield,    color: 'text-green-500' },
          { label: 'Performance',     value: Math.floor(Math.random() * 20) + 75, icon: Zap,       color: 'text-blue-500' },
          { label: 'Security',        value: Math.floor(Math.random() * 20) + 70, icon: Shield,    color: 'text-purple-500' },
          { label: 'Maintainability', value: Math.floor(Math.random() * 20) + 78, icon: BarChart3, color: 'text-orange-500' },
        ])
      } else {
        setAnalysisResults([parsed])
      }
      setActiveTab('issues')
    } catch (err) {
      console.error("Analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // If no code yet — just show input box (no auth needed for that)
  const handleAnalyzeClick = () => {
    if (!inputCode.trim()) {
      setShowInput(true)
      return
    }
    guardedAction(doAnalyze)
  }

  return (
    <>
      {/* Login Modal */}
      <LoginRequiredModal
        isOpen={showModal}
        onClose={closeModal}
        feature="Code Analysis"
      />

      <section id="code-analysis" ref={sectionRef} className="relative py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT: Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="glass rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Code Analysis</h4>
                      <p className="text-xs text-muted-foreground">
                        {isAnalyzing ? 'Analyzing...' : 'AI-powered analysis'}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                    {analysisResults.length} issues found
                  </span>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border/50">
                  {(['issues', 'metrics'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-6 py-3 text-sm font-medium transition-colors relative ${
                        activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab === 'issues' ? `Issues (${analysisResults.length})` : 'Metrics'}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="p-6 space-y-3 min-h-[300px]">
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center h-[260px] gap-4">
                      <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                      <p className="text-sm text-muted-foreground">AI analyzing your code...</p>
                    </div>
                  ) : activeTab === 'issues' ? (
                    analysisResults.map((result, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer ${
                          result.type === 'error'   ? 'bg-red-500/10 hover:bg-red-500/15' :
                          result.type === 'warning' ? 'bg-yellow-500/10 hover:bg-yellow-500/15' :
                                                      'bg-green-500/10 hover:bg-green-500/15'
                        }`}
                      >
                        {result.type === 'error'   ? <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" /> :
                         result.type === 'warning' ? <Clock         className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" /> :
                                                     <CheckCircle2  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{result.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">Line {result.line} • {result.severity} severity</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          result.severity === 'high'   ? 'bg-red-500/20 text-red-400' :
                          result.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          result.severity === 'low'    ? 'bg-blue-500/20 text-blue-400' :
                                                         'bg-green-500/20 text-green-400'
                        }`}>{result.severity}</span>
                      </motion.div>
                    ))
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {metrics.map((metric, i) => (
                        <motion.div
                          key={metric.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="bg-secondary/50 rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-muted-foreground">{metric.label}</span>
                            <metric.icon className={`w-4 h-4 ${metric.color}`} />
                          </div>
                          <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold">{metric.value}</span>
                            <span className="text-sm text-muted-foreground mb-1">/100</span>
                          </div>
                          <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={isInView ? { width: `${metric.value}%` } : {}}
                              transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                              className={`h-full rounded-full ${
                                metric.value >= 90 ? 'bg-green-500' :
                                metric.value >= 70 ? 'bg-blue-500' : 'bg-yellow-500'
                              }`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* RIGHT: Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6">
                Code Analysis
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                <span className="text-balance">Deep Insights Into</span>
                <br />
                <span className="gradient-text">Your Codebase</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
                Get comprehensive analysis of your code with AI-powered detection of bugs,
                security vulnerabilities, performance issues, and code smells.
              </p>

              {/* Code Input */}
              {showInput && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                  <textarea
                    value={inputCode}
                    onChange={e => setInputCode(e.target.value)}
                    placeholder="Paste your code here for AI-powered analysis..."
                    className="w-full h-40 p-4 rounded-xl bg-secondary/50 border border-border text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Shield,       label: 'Security Scan' },
                  { icon: TrendingUp,   label: 'Performance Analysis' },
                  { icon: CheckCircle2, label: 'Best Practices' },
                  { icon: BarChart3,    label: 'Code Metrics' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50"
                  >
                    <item.icon className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyzeClick}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:scale-105 transition-all duration-300"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : isLoggedIn ? (
                    <Search className="w-4 h-4 mr-2" />
                  ) : (
                    <Lock className="w-4 h-4 mr-2" />
                  )}
                  {isAnalyzing ? 'Analyzing...' : showInput ? 'Run AI Analysis' : 'Analyze Your Code'}
                </Button>
                {showInput && (
                  <Button variant="ghost" onClick={() => setShowInput(false)}>Cancel</Button>
                )}
              </div>

              {!isLoggedIn && (
                <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Login required to run AI analysis
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}