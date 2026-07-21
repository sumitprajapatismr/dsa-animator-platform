import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { generateBubbleSortSteps, generateQuickSortSteps } from '../utils/visualizerEngine';
import { playSoundTone } from '../utils/audio';
import { Play, Trophy, Sparkles, Send, Clock, Shield, Zap, Gift, RefreshCw, Flame } from 'lucide-react';

interface QuestionSpec {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  constraints: string[];
  examples: string[];
  hints: { logic: string; algo: string; complexity: string; dryRun: string };
  optimalComplexity: string;
}

const QUESTIONS_BANK: QuestionSpec[] = [
  {
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    examples: ['Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]'],
    hints: {
      logic: 'Find two indices such that their sum equals the target.',
      algo: 'Use a Hash Map to find complement in O(1) time.',
      complexity: 'Optimal is O(N) Time and O(N) Space.',
      dryRun: 'nums = [2,7], target = 9. Map stores {2:0}. Complement 7 found at map index 0.'
    },
    optimalComplexity: 'Time: O(N), Space: O(N)'
  },
  {
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topic: 'Stacks',
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only'],
    examples: ['Input: s = "()[]{}"\nOutput: true'],
    hints: {
      logic: 'Each close bracket must match the most recent open bracket.',
      algo: 'Push open brackets to stack, pop to match on close brackets.',
      complexity: 'Optimal is O(N) Time and O(N) Space.',
      dryRun: 's = "()". Push (, read ). Pop (, match true.'
    },
    optimalComplexity: 'Time: O(N), Space: O(N)'
  }
];

const RaceMode: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coding' | 'algo'>('coding');

  // ==========================================
  // TAB 1: CODING RACE STATES
  // ==========================================
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);
  const [gameMode, setGameMode] = useState('Easy Sprint (10 min)');
  const [code, setCode] = useState('function solve(arr) {\n  // Write code\n}');
  const [hasTimeFreeze, setHasTimeFreeze] = useState(true);
  const [isTimeFrozen, setIsTimeFrozen] = useState(false);
  const [timeFreezeLeft, setTimeFreezeLeft] = useState(0);
  const [heatLevel, setHeatLevel] = useState<'Cold' | 'Warm' | 'Hot' | 'Legend'>('Cold');
  const [wrongSubmissions, setWrongSubmissions] = useState(0);
  const [userProgress, setUserProgress] = useState(0);
  const [rivalProgress, setRivalProgress] = useState(0);
  const [rivalType, setRivalType] = useState<'Beginner' | 'Intermediate' | 'Expert' | 'FAANG Engineer'>('Intermediate');
  const [isRacing, setIsRacing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [statusMsg, setStatusMsg] = useState('Prepare for the race! Spin the topic wheel or click start.');
  const [hintType, setHintType] = useState<'logic' | 'algo' | 'complexity' | 'dryRun' | null>(null);
  const [topicSpinning, setTopicSpinning] = useState(false);
  const [isSpinningWheel, setIsSpinningWheel] = useState(false);
  const [wheelReward, setWheelReward] = useState<string | null>(null);
  const [boxOpened, setBoxOpened] = useState(false);

  const codingRaceTimerRef = useRef<any>(null);
  const codingClockTimerRef = useRef<any>(null);

  // ==========================================
  // TAB 2: ALGORITHM RACE STATES
  // ==========================================
  const [algoA, setAlgoA] = useState('bubble');
  const [algoB, setAlgoB] = useState('quick');
  const [algoRaceArraySize, setAlgoRaceArraySize] = useState(12);
  const [algoRaceArray, setAlgoRaceArray] = useState<number[]>([]);
  const [stepsA, setStepsA] = useState<any[]>([]);
  const [stepsB, setStepsB] = useState<any[]>([]);
  const [idxA, setIdxA] = useState(0);
  const [idxB, setIdxB] = useState(0);
  const [isAlgoRacing, setIsAlgoRacing] = useState(false);
  const [predictedWinner, setPredictedWinner] = useState<'A' | 'B' | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState<string | null>(null);

  const algoRaceTimerRef = useRef<any>(null);

  const activeQuestion = QUESTIONS_BANK[selectedQuestionIdx];

  // Coding Race Helpers
  const handleStartCodingRace = () => {
    setIsRacing(true);
    setUserProgress(0);
    setRivalProgress(0);
    setTimeLeft(gameMode.includes('10 min') ? 600 : gameMode.includes('20 min') ? 1200 : 1800);
    setHasTimeFreeze(true);
    setIsTimeFrozen(false);
    setWrongSubmissions(0);
    setHeatLevel('Cold');
    setHintType(null);
    setBoxOpened(false);
    setWheelReward(null);
    setStatusMsg('The race is live! AI Coder rival is writing code...');
    playSoundTone('click');

    const incrementMax = rivalType === 'Beginner' ? 3 : rivalType === 'Intermediate' ? 5 : rivalType === 'Expert' ? 7 : 10;

    codingRaceTimerRef.current = setInterval(() => {
      setRivalProgress(p => {
        const next = p + Math.floor(Math.random() * incrementMax) + 1;
        return next >= 100 ? 100 : next;
      });
    }, 1200);

    codingClockTimerRef.current = setInterval(() => {
      setTimeFreezeLeft(f => {
        if (f > 1) return f - 1;
        if (f === 1) {
          setIsTimeFrozen(false);
          return 0;
        }
        setTimeLeft(t => {
          if (t <= 1) {
            handleStopCodingRace(false, 'Time expired!');
            return 0;
          }
          return t - 1;
        });
        return 0;
      });
    }, 1000);
  };

  const handleStopCodingRace = (success: boolean, message: string) => {
    setIsRacing(false);
    if (codingRaceTimerRef.current) clearInterval(codingRaceTimerRef.current);
    if (codingClockTimerRef.current) clearInterval(codingClockTimerRef.current);
    setStatusMsg(message);
    playSoundTone(success ? 'success' : 'click');
  };

  const submitCodingCode = () => {
    if (!isRacing) return;
    setUserProgress(100);
    const win = rivalProgress < 100;
    const rank = win ? 1 : 2;
    const xpEarned = rank === 1 ? 200 : 80;
    const coinsEarned = rank === 1 ? 50 : 20;

    setXp(x => x + xpEarned);
    setCoins(c => c + coinsEarned);
    handleStopCodingRace(true, `🏁 Race Finished! Rank: #${rank}. Gained +${xpEarned} XP & +${coinsEarned} Coins!`);
  };

  const triggerTimeFreeze = () => {
    if (!isRacing || !hasTimeFreeze) return;
    setHasTimeFreeze(false);
    setIsTimeFrozen(true);
    setTimeFreezeLeft(20);
    playSoundTone('success');
  };

  // Algorithm Race Helpers
  const generateNewAlgoRaceArray = () => {
    setIsAlgoRacing(false);
    if (algoRaceTimerRef.current) clearInterval(algoRaceTimerRef.current);
    setIdxA(0);
    setIdxB(0);
    setPredictionFeedback(null);

    const arr = Array.from({ length: algoRaceArraySize }, () => Math.floor(Math.random() * 70) + 15);
    setAlgoRaceArray(arr);
    setStepsA(algoA === 'bubble' ? generateBubbleSortSteps(arr) : generateQuickSortSteps(arr));
    setStepsB(algoB === 'bubble' ? generateBubbleSortSteps(arr) : generateQuickSortSteps(arr));
  };

  useEffect(() => {
    generateNewAlgoRaceArray();
  }, [algoRaceArraySize, algoA, algoB]);

  const handleStartAlgoRace = () => {
    if (stepsA.length === 0 || stepsB.length === 0) return;
    setIsAlgoRacing(true);
    playSoundTone('click');

    algoRaceTimerRef.current = setInterval(() => {
      let aDone = false;
      let bDone = false;

      setIdxA((prev) => {
        if (prev >= stepsA.length - 1) {
          aDone = true;
          return prev;
        }
        return prev + 1;
      });

      setIdxB((prev) => {
        if (prev >= stepsB.length - 1) {
          bDone = true;
          return prev;
        }
        return prev + 1;
      });

      if (aDone && bDone) {
        setIsAlgoRacing(false);
        clearInterval(algoRaceTimerRef.current);

        // Detect winner
        const winner = stepsA.length < stepsB.length ? 'A' : 'B';
        const actualWin = stepsA.length === stepsB.length ? 'tie' : winner;

        if (predictedWinner) {
          if (predictedWinner === actualWin) {
            setPredictionFeedback('🏆 Correct Prediction! Bonus +50 XP Awarded.');
            setXp(x => x + 50);
            playSoundTone('success');
          } else {
            setPredictionFeedback('✗ Incorrect Prediction. Quicksort generally wins due to O(N log N) partitions.');
            playSoundTone('click');
          }
        }
      }
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex border-b border-brand-border/40">
        <button
          onClick={() => { setActiveTab('coding'); playSoundTone('click'); }}
          className={`px-5 py-3 text-xs font-bold uppercase border-b-2 transition-all ${activeTab === 'coding' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
        >
          Coding Race
        </button>
        <button
          onClick={() => { setActiveTab('algo'); playSoundTone('click'); }}
          className={`px-5 py-3 text-xs font-bold uppercase border-b-2 transition-all ${activeTab === 'algo' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-400'}`}
        >
          Algorithm Race
        </button>
      </div>

      {activeTab === 'coding' ? (
        // ==========================================
        // TAB 1: CODING RACE VIEW
        // ==========================================
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-brand-card border border-brand-border">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Rival Coder</label>
                <select
                  value={rivalType}
                  onChange={(e) => setRivalType(e.target.value as any)}
                  className="px-3 py-1.5 rounded bg-[#111A2C] border border-brand-border text-xs text-white"
                >
                  <option value="Beginner">AI Beginner</option>
                  <option value="Intermediate">AI Intermediate</option>
                  <option value="Expert">AI Expert</option>
                  <option value="FAANG Engineer">AI FAANG Engineer</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              {!isRacing ? (
                <button
                  onClick={handleStartCodingRace}
                  className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-xs font-bold text-white rounded-lg shadow-glow flex items-center gap-1.5"
                >
                  <Play className="w-4 h-4" /> Start Battle
                </button>
              ) : (
                <button
                  onClick={() => handleStopCodingRace(false, 'Race aborted.')}
                  className="px-4 py-2.5 bg-red-950/20 border border-red-900/60 text-xs font-bold text-red-400 rounded-lg"
                >
                  Abort Race
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col p-6 rounded-2xl bg-brand-card border border-brand-border h-[460px] justify-between">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Coding Arena
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                  <Clock className={`w-4 h-4 ${isTimeFrozen ? 'text-cyan-400 animate-pulse' : 'text-indigo-400'}`} />
                  {isTimeFrozen ? `Frozen: ${timeFreezeLeft}s` : `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`}
                </div>
              </div>

              <div className="flex-1 rounded-xl overflow-hidden border border-brand-border/40 mb-4 h-72">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={code}
                  onChange={(v) => setCode(v || '')}
                  options={{ minimap: { enabled: false }, fontSize: 12 }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={triggerTimeFreeze}
                  disabled={!isRacing || !hasTimeFreeze}
                  className="px-4 py-2 bg-cyan-950/20 border border-cyan-800/60 text-cyan-400 rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Zap className="w-4 h-4" /> Time Freeze (20s)
                </button>
                <button
                  onClick={submitCodingCode}
                  disabled={!isRacing}
                  className="flex-1 py-2 bg-indigo-650 hover:bg-indigo-600 disabled:opacity-40 text-xs font-bold text-white rounded-lg shadow-glow flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Submit Solution
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" /> Rival Coding Progress
                </h3>
                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-white">You</span>
                      <span className="font-mono text-gray-500">{userProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${userProgress}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-gray-300">Rival ({rivalType})</span>
                      <span className="font-mono text-gray-500">{rivalProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full transition-all duration-300" style={{ width: `${rivalProgress}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Flame className="w-4 h-4" /> Brain Heat Meter
                  </h3>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brand-dark border border-brand-border text-gray-500">
                    {heatLevel}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${heatLevel === 'Cold' ? 'bg-indigo-500 w-1/4' : heatLevel === 'Warm' ? 'bg-yellow-500 w-2/4' : heatLevel === 'Hot' ? 'bg-orange-500 w-3/4' : 'bg-red-500 w-full'}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ==========================================
        // TAB 2: ALGORITHM RACE VIEW (NEW)
        // ==========================================
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-brand-card border border-brand-border">
            <div className="flex flex-wrap gap-4 items-center text-xs">
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Algorithm A</label>
                <select
                  value={algoA}
                  onChange={(e) => setAlgoA(e.target.value)}
                  className="px-3 py-1.5 rounded bg-[#111A2C] border border-brand-border text-xs text-white"
                >
                  <option value="bubble">Bubble Sort</option>
                  <option value="quick">Quick Sort</option>
                </select>
              </div>

              <div className="text-indigo-400 font-bold">VS</div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Algorithm B</label>
                <select
                  value={algoB}
                  onChange={(e) => setAlgoB(e.target.value)}
                  className="px-3 py-1.5 rounded bg-[#111A2C] border border-brand-border text-xs text-white"
                >
                  <option value="bubble">Bubble Sort</option>
                  <option value="quick">Quick Sort</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1 font-mono">Dataset Size: {algoRaceArraySize}</label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={algoRaceArraySize}
                  onChange={(e) => setAlgoRaceArraySize(Number(e.target.value))}
                  className="accent-indigo-650 h-1 bg-gray-800 rounded"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleStartAlgoRace}
                disabled={isAlgoRacing}
                className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-xs font-bold text-white rounded-lg shadow-glow flex items-center gap-1.5"
              >
                <Play className="w-4 h-4" /> Start Algo Race
              </button>
              <button
                onClick={generateNewAlgoRaceArray}
                className="px-4 py-2.5 bg-[#111A2C] border border-brand-border text-xs font-semibold rounded-lg hover:text-white"
              >
                Reset Dataset
              </button>
            </div>
          </div>

          {/* Prediction Selection */}
          <div className="p-4 rounded-xl bg-brand-dark/20 border border-brand-border/40 text-xs flex justify-between items-center">
            <span className="font-semibold text-gray-400">Predict the Winner for Bonus +50 XP:</span>
            <div className="flex gap-2">
              <button
                onClick={() => { setPredictedWinner('A'); playSoundTone('click'); }}
                className={`px-3 py-1.5 rounded text-[10px] font-bold border ${predictedWinner === 'A' ? 'bg-indigo-650 text-white' : 'bg-[#111A2C] border-brand-border text-gray-400'}`}
              >
                Predict A
              </button>
              <button
                onClick={() => { setPredictedWinner('B'); playSoundTone('click'); }}
                className={`px-3 py-1.5 rounded text-[10px] font-bold border ${predictedWinner === 'B' ? 'bg-indigo-650 text-white' : 'bg-[#111A2C] border-brand-border text-gray-400'}`}
              >
                Predict B
              </button>
            </div>
          </div>

          {/* Winner and feedback banner */}
          {predictionFeedback && (
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/60 text-xs font-bold text-center text-indigo-400">
              {predictionFeedback}
            </div>
          )}

          {/* Split Screen Race Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Algo A Panel */}
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-border flex flex-col h-[520px] justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">{algoA === 'bubble' ? 'Bubble' : 'Quick'} Sort (A)</h3>
                <div className="flex items-end gap-1.5 justify-center pb-6 h-48 border-b border-brand-border/20">
                  {(stepsA[idxA] || { array: algoRaceArray }).array.map((val: number, i: number) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full rounded-t bg-indigo-600/40 border border-indigo-500/20"
                        style={{ height: `${val * 2}px` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats A */}
              {(() => {
                const getStats = (steps: any[], idx: number, isRecursive: boolean) => {
                  if (!steps || steps.length === 0) return { comps: 0, swapsCount: 0, execTime: '0.00', memory: '1.0', currentStepNum: 0 };
                  let comps = 0;
                  let swapsCount = 0;
                  for (let i = 0; i <= idx; i++) {
                    const exp = steps[i]?.explanation?.toLowerCase() || '';
                    if (exp.includes('compare')) comps++;
                    if (exp.includes('swap')) swapsCount++;
                  }
                  return {
                    comps,
                    swapsCount,
                    execTime: (idx * 0.02).toFixed(2),
                    memory: (1.0 + (idx * 0.01)).toFixed(1),
                    currentStepNum: idx + 1
                  };
                };
                const s = getStats(stepsA, idxA, algoA === 'quick');
                return (
                  <div className="p-4 rounded-xl bg-brand-dark/40 border border-brand-border/30 text-xs font-mono space-y-1.5 text-gray-400 my-4">
                    <div className="flex justify-between"><span>Comparisons:</span><span className="text-white font-bold">{s.comps}</span></div>
                    <div className="flex justify-between"><span>Swaps:</span><span className="text-white font-bold">{s.swapsCount}</span></div>
                    <div className="flex justify-between"><span>Execution:</span><span className="text-white font-bold">{s.execTime} s</span></div>
                    <div className="flex justify-between"><span>Memory:</span><span className="text-white font-bold">{s.memory} MB</span></div>
                    <div className="flex justify-between"><span>Current Step:</span><span className="text-white font-bold">{s.currentStepNum}</span></div>
                  </div>
                );
              })()}

              <div className="text-[10px] text-gray-500 font-mono border-t border-brand-border/40 pt-2 flex justify-between">
                <span>Steps executed: {idxA + 1}/{stepsA.length}</span>
                <span>Complexity: {algoA === 'bubble' ? 'O(N^2)' : 'O(N log N)'}</span>
              </div>
            </div>

            {/* Algo B Panel */}
            <div className="p-6 rounded-2xl bg-brand-card border border-brand-border flex flex-col h-[520px] justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-4">{algoB === 'bubble' ? 'Bubble' : 'Quick'} Sort (B)</h3>
                <div className="flex-1 flex items-end gap-1.5 justify-center pb-6 h-48 border-b border-brand-border/20">
                  {(stepsB[idxB] || { array: algoRaceArray }).array.map((val: number, i: number) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full rounded-t bg-purple-600/40 border border-purple-500/20"
                        style={{ height: `${val * 2}px` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats B */}
              {(() => {
                const getStats = (steps: any[], idx: number, isRecursive: boolean) => {
                  if (!steps || steps.length === 0) return { comps: 0, swapsCount: 0, execTime: '0.00', memory: '1.0', currentStepNum: 0 };
                  let comps = 0;
                  let swapsCount = 0;
                  for (let i = 0; i <= idx; i++) {
                    const exp = steps[i]?.explanation?.toLowerCase() || '';
                    if (exp.includes('compare')) comps++;
                    if (exp.includes('swap')) swapsCount++;
                  }
                  return {
                    comps,
                    swapsCount,
                    execTime: (idx * 0.02).toFixed(2),
                    memory: (1.0 + (idx * 0.01)).toFixed(1),
                    currentStepNum: idx + 1
                  };
                };
                const s = getStats(stepsB, idxB, algoB === 'quick');
                return (
                  <div className="p-4 rounded-xl bg-brand-dark/40 border border-brand-border/30 text-xs font-mono space-y-1.5 text-gray-400 my-4">
                    <div className="flex justify-between"><span>Comparisons:</span><span className="text-white font-bold">{s.comps}</span></div>
                    <div className="flex justify-between"><span>Swaps:</span><span className="text-white font-bold">{s.swapsCount}</span></div>
                    <div className="flex justify-between"><span>Execution:</span><span className="text-white font-bold">{s.execTime} s</span></div>
                    <div className="flex justify-between"><span>Memory:</span><span className="text-white font-bold">{s.memory} MB</span></div>
                    <div className="flex justify-between"><span>Current Step:</span><span className="text-white font-bold">{s.currentStepNum}</span></div>
                  </div>
                );
              })()}

              <div className="text-[10px] text-gray-500 font-mono border-t border-brand-border/40 pt-2 flex justify-between">
                <span>Steps executed: {idxB + 1}/{stepsB.length}</span>
                <span>Complexity: {algoB === 'bubble' ? 'O(N^2)' : 'O(N log N)'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceMode;

