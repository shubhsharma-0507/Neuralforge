// "use client";

// import { useRef, useState } from "react";
// import { motion, useInView } from "framer-motion";
// import {
//   Bug,
//   Zap,
//   ArrowRight,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   Play,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function DebuggerSection() {
//   const sectionRef = useRef(null);
//   const isInView = useInView(sectionRef, {
//     once: true,
//     margin: "-100px",
//   });

//   const [inputCode, setInputCode] = useState(`function fetchUserData(userId) {
//   const response = fetch('/api/users/' + userId);
//   const data = response.json();
//   return data.user.name;
// }`);

//   const [fixedCode, setFixedCode] = useState("");
//   const [issues, setIssues] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const startDebugging = async () => {
//     if (!inputCode.trim() || loading) return;

//     setLoading(true);
//     setFixedCode("");
//     setIssues([]);

//     try {
//       const response = await fetch("/api/debug-code", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           code: inputCode,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.error || "Something went wrong"
//         );
//       }

//       setFixedCode(data.fixedCode || "");
//       setIssues(data.issues || []);
//     } catch (error) {
//       console.error(error);

//       setIssues([
//         {
//           type: "error",
//           title: "Request Failed",
//           description:
//             error instanceof Error
//               ? error.message
//               : "Something went wrong",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section
//       id="debugger"
//       ref={sectionRef}
//       className="relative py-32 overflow-hidden"
//     >
//       <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-green-500/5 blur-[100px]" />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={
//               isInView
//                 ? { opacity: 1, x: 0 }
//                 : {}
//             }
//             transition={{ duration: 0.8 }}
//             className="order-2 lg:order-1"
//           >
//             <div className="glass rounded-3xl overflow-hidden">
//               <div className="flex items-center justify-between p-4 border-b border-border/50">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
//                     <Bug className="w-5 h-5 text-white" />
//                   </div>

//                   <div>
//                     <h4 className="font-semibold">
//                       AI Debugger
//                     </h4>

//                     <p className="text-xs text-muted-foreground">
//                       {loading
//                         ? "Analyzing..."
//                         : "Ready to debug"}
//                     </p>
//                   </div>
//                 </div>

//                 <Button
//                   onClick={startDebugging}
//                   disabled={loading}
//                   size="sm"
//                   className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
//                 >
//                   <Play className="w-4 h-4 mr-1" />
//                   {loading
//                     ? "Debugging..."
//                     : "Run Debug"}
//                 </Button>
//               </div>

//               <div className="grid md:grid-cols-2 divide-x divide-border/50">
//                 <div className="p-4">
//                   <div className="flex items-center gap-2 mb-3">
//                     <XCircle className="w-4 h-4 text-red-500" />
//                     <span className="text-sm font-medium text-red-400">
//                       Your Code
//                     </span>
//                   </div>

//                   <textarea
//                     value={inputCode}
//                     onChange={(e) =>
//                       setInputCode(e.target.value)
//                     }
//                     className="w-full h-72 p-4 bg-red-500/5 rounded-xl border border-red-500/20 text-xs font-mono resize-none outline-none"
//                   />
//                 </div>

//                 <div className="p-4">
//                   <div className="flex items-center gap-2 mb-3">
//                     <CheckCircle2 className="w-4 h-4 text-green-500" />
//                     <span className="text-sm font-medium text-green-400">
//                       Fixed Code
//                     </span>
//                   </div>

//                   <pre className="h-72 p-4 bg-green-500/5 rounded-xl border border-green-500/20 text-xs font-mono overflow-auto">
//                     {fixedCode ||
//                       "// Fixed code will appear here"}
//                   </pre>
//                 </div>
//               </div>

//               <div className="p-4 border-t border-border/50">
//                 <div className="space-y-2">
//                   {issues.length === 0 &&
//                     !loading && (
//                       <p className="text-sm text-muted-foreground">
//                         No analysis yet.
//                       </p>
//                     )}

//                   {issues.map(
//                     (issue: any, index: number) => (
//                       <div
//                         key={index}
//                         className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
//                       >
//                         {issue.type ===
//                         "error" ? (
//                           <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                         ) : issue.type ===
//                           "warning" ? (
//                           <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
//                         ) : (
//                           <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
//                         )}

//                         <div>
//                           <p className="text-sm font-medium">
//                             {issue.title}
//                           </p>

//                           <p className="text-xs text-muted-foreground">
//                             {issue.description}
//                           </p>
//                         </div>
//                       </div>
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={
//               isInView
//                 ? { opacity: 1, x: 0 }
//                 : {}
//             }
//             transition={{ duration: 0.8 }}
//             className="order-1 lg:order-2"
//           >
//             <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20 mb-6">
//               AI Debugger
//             </span>

//             <h2 className="text-4xl sm:text-5xl font-bold mb-6">
//               <span>Squash Bugs</span>
//               <br />
//               <span className="gradient-text">
//                 Like Magic
//               </span>
//             </h2>

//             <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
//               Paste your code and let AI analyze
//               bugs, security vulnerabilities,
//               async issues, null safety problems,
//               and provide a fixed version.
//             </p>

//             <div className="space-y-4 mb-8">
//               {[
//                 "Automatic bug detection",
//                 "Security scanning",
//                 "Async/Await fixes",
//                 "Root cause analysis",
//               ].map((feature, i) => (
//                 <div
//                   key={i}
//                   className="flex items-center gap-3"
//                 >
//                   <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
//                     <Zap className="w-3 h-3 text-white" />
//                   </div>

//                   <span className="text-muted-foreground">
//                     {feature}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <Button
//               onClick={startDebugging}
//               className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0"
//             >
//               <Bug className="w-4 h-4 mr-2" />
//               Debug Your Code
//               <ArrowRight className="w-4 h-4 ml-2" />
//             </Button>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Bug, Zap, ArrowRight, CheckCircle2, XCircle, AlertCircle, Play, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoginRequiredModal } from '@/components/ui/login-required-modal'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function DebuggerSection() {
  const sectionRef = useRef(null)
  const isInView   = useInView(sectionRef, { once: true, margin: "-100px" })

  // ── Auth guard ──────────────────────────────────────────────────
  const { isLoggedIn, showModal, closeModal, guardedAction } = useAuthGuard()

  const [inputCode, setInputCode] = useState(`function fetchUserData(userId) {
  const response = fetch('/api/users/' + userId);
  const data = response.json();
  return data.user.name;
}`)
  const [fixedCode, setFixedCode] = useState("")
  const [issues,    setIssues]    = useState<any[]>([])
  const [loading,   setLoading]   = useState(false)

  const doDebug = async () => {
    if (!inputCode.trim() || loading) return

    setLoading(true)
    setFixedCode("")
    setIssues([])

    try {
      const response = await fetch("/api/debug-code", {
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

      if (!response.ok) throw new Error(data.error || "Something went wrong")

      setFixedCode(data.fixedCode || "")
      setIssues(data.issues || [])
    } catch (error) {
      console.error(error)
      setIssues([{
        type: "error",
        title: "Request Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      }])
    } finally {
      setLoading(false)
    }
  }

  // Guarded debug
  const startDebugging = () => guardedAction(doDebug)

  return (
    <>
      {/* Login Modal */}
      <LoginRequiredModal
        isOpen={showModal}
        onClose={closeModal}
        feature="AI Debugger"
      />

      <section id="debugger" ref={sectionRef} className="relative py-32 overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-green-500/5 blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT: Debugger UI */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="glass rounded-3xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Bug className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">AI Debugger</h4>
                      <p className="text-xs text-muted-foreground">
                        {loading ? "Analyzing..." : "Ready to debug"}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={startDebugging}
                    disabled={loading}
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  >
                    {isLoggedIn ? <Play className="w-4 h-4 mr-1" /> : <Lock className="w-4 h-4 mr-1" />}
                    {loading ? "Debugging..." : "Run Debug"}
                  </Button>
                </div>

                {/* Code panels */}
                <div className="grid md:grid-cols-2 divide-x divide-border/50">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-400">Your Code</span>
                    </div>
                    <textarea
                      value={inputCode}
                      onChange={e => setInputCode(e.target.value)}
                      className="w-full h-72 p-4 bg-red-500/5 rounded-xl border border-red-500/20 text-xs font-mono resize-none outline-none"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-400">Fixed Code</span>
                    </div>
                    <pre className="h-72 p-4 bg-green-500/5 rounded-xl border border-green-500/20 text-xs font-mono overflow-auto">
                      {fixedCode || "// Fixed code will appear here"}
                    </pre>
                  </div>
                </div>

                {/* Issues */}
                <div className="p-4 border-t border-border/50">
                  <div className="space-y-2">
                    {issues.length === 0 && !loading && (
                      <p className="text-sm text-muted-foreground">No analysis yet.</p>
                    )}
                    {issues.map((issue: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                        {issue.type === 'error'   ? <XCircle      className="w-5 h-5 text-red-500 flex-shrink-0" /> :
                         issue.type === 'warning' ? <AlertCircle  className="w-5 h-5 text-yellow-500 flex-shrink-0" /> :
                                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                        <div>
                          <p className="text-sm font-medium">{issue.title}</p>
                          <p className="text-xs text-muted-foreground">{issue.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20 mb-6">
                AI Debugger
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                <span>Squash Bugs</span>
                <br />
                <span className="gradient-text">Like Magic</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Paste your code and let AI analyze bugs, security vulnerabilities,
                async issues, null safety problems, and provide a fixed version.
              </p>

              <div className="space-y-4 mb-8">
                {["Automatic bug detection", "Security scanning", "Async/Await fixes", "Root cause analysis"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={startDebugging}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0"
              >
                {isLoggedIn ? <Bug className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                Debug Your Code
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {!isLoggedIn && (
                <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Login required to use AI Debugger
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}