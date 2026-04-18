'use client';
import { useState } from "react";
export default function Home() {
  const [research_field, setResearchField] = useState("");
  const [literature_summary, setLiteratureSummary] = useState("");
  const [anomalies, setAnomalies] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const accentColor = "hsl(305, 60%, 60%)";
  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ research_field, literature_summary, anomalies }) });
      const data = await res.json();
      setOutput(data.result || data.error || "No response");
    } catch (e: any) { setOutput("Error: " + e.message); }
    setLoading(false);
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">AI Hypothesis Generator</h1>
          <p className="text-gray-400 mb-8">Generate novel, testable research hypotheses from literature and anomalies.</p>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Research Field</label>
              <select value={research_field} onChange={e => setResearchField(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-400">
                <option value="">Select field...</option>
                <option value="molecular_biology">Molecular Biology</option>
                <option value="neuroscience">Neuroscience</option>
                <option value="immunology">Immunology</option>
                <option value="cancer_biology">Cancer Biology</option>
                <option value="biochemistry">Biochemistry</option>
                <option value="genetics">Genetics / Genomics</option>
                <option value="microbiology">Microbiology</option>
                <option value="pharmacology">Pharmacology</option>
                <option value="environmental_science">Environmental Science</option>
                <option value="materials_science">Materials Science</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Literature Summary / Current Knowledge</label>
              <textarea value={literature_summary} onChange={e => setLiteratureSummary(e.target.value)} rows={5} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 resize-none" placeholder="Summarize the current state of knowledge in your field: established models, consensus views..." />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Anomalies / Unexplained Observations</label>
              <textarea value={anomalies} onChange={e => setAnomalies(e.target.value)} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 resize-none" placeholder="Describe anomalies, contradictory findings, or unexplained phenomena..." />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-50" style={{ backgroundColor: accentColor }}>
              {loading ? "Generating Hypotheses..." : "Generate Hypotheses"}
            </button>
          </form>
          {output && <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg"><pre className="whitespace-pre-wrap text-sm text-gray-200">{output}</pre></div>}
        </div>
      </div>
    </div>
  );
}