import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Globe2,
  Landmark,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { AXES, QUESTION_BANK, type Axis, type Question } from './questions'
import './styles.css'

type TestMode = 'quick' | 'standard' | 'extended'
type Screen = 'home' | 'test' | 'results'
type Answers = Record<string, number>

const MODE_DETAILS: Record<TestMode, { label: string; count: number; time: string; description: string }> = {
  quick: { label: 'Quick', count: 36, time: '5–7 min', description: 'A first look across all twelve dimensions.' },
  standard: { label: 'Standard', count: 60, time: '8–12 min', description: 'A balanced starting point. Five questions per axis.' },
  extended: { label: 'Extended', count: 240, time: '25–35 min', description: 'Explore every statement in the full question set.' },
}

const RESPONSE_OPTIONS = [
  { value: -2, label: 'Strongly disagree', short: 'Strongly\ndisagree' },
  { value: -1, label: 'Disagree', short: 'Disagree' },
  { value: 0, label: 'Unsure / neutral', short: 'Unsure /\nneutral' },
  { value: 1, label: 'Agree', short: 'Agree' },
  { value: 2, label: 'Strongly agree', short: 'Strongly\nagree' },
]

const FAQ_ITEMS = [
  {
    q: 'What is the 12 axes political test?',
    a: 'It is a self-reflection quiz that groups political questions into twelve dimensions instead of reducing every view to one left–right line. Your report describes your answers within this model; it does not define your identity.',
  },
  {
    q: 'How are the three test modes different?',
    a: 'Quick uses 36 statements, Standard uses 60, and Extended uses 240. Each version covers all twelve axes. Longer modes include more statements per dimension and can give a more detailed view of your responses.',
  },
  {
    q: 'How accurate is the result?',
    a: 'This is an exploratory questionnaire, not a scientifically validated diagnosis or a definitive measure of political identity. Results depend on the statements, their weighting, and how you interpret each question.',
  },
  {
    q: 'Are my answers saved or sent anywhere?',
    a: 'In this demo, answers and scores stay in the current browser page and are not sent to a server. Refreshing or closing the page clears your progress. There is no account or tracking profile for your answers.',
  },
  {
    q: 'What should I choose when I am unsure?',
    a: 'Choose “Unsure / neutral” if a statement feels balanced, unclear, or does not fit your circumstances. You can also go back and change an answer before finishing.',
  },
  {
    q: 'Why might a result feel unexpected?',
    a: 'A score summarizes a set of responses, not every belief you hold. Read the axis description and the statements that informed it, and treat the report as a prompt for reflection rather than a label.',
  },
  {
    q: 'Can I retake the test?',
    a: 'Yes. Choose any test length and start again. The local demo does not save previous sessions, so a new run starts with a clean answer sheet.',
  },
]

const EXAMPLE_SCORES = [64, 75, 62, 68, 72, 58, 58, 54, 65, 62, 71, 55]

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand-mark${small ? ' brand-mark--small' : ''}`} aria-hidden="true">
      <span className="brand-mark__cross" />
      <span className="brand-mark__center" />
    </span>
  )
}

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="12 Axes Political Test home">
      <BrandMark />
      <span className="brand__name">12 Axes<span>Political Test</span></span>
    </a>
  )
}

function AxisCardPreview() {
  const previewAxes = AXES.slice(0, 8)
  return (
    <div className="preview-stage" aria-label="Illustrative 12 axes result card">
      <div className="preview-back preview-back--mint"><span>YOUR 12 AXES</span><strong>A wider view</strong></div>
      <div className="preview-back preview-back--lilac"><span>12 DIMENSIONS</span><strong>More than left &amp; right</strong></div>
      <div className="preview-card">
        <div className="preview-card__top"><span className="mini-brand"><BrandMark small /> 12 AXES</span><span className="eyebrow light">YOUR REPORT, EXPLAINED</span></div>
        <p className="preview-card__label">CLOSEST IDEOLOGY · EXAMPLE</p>
        <h2>Pluralist<br />Democracy</h2>
        <div className="preview-card__result">
          <div className="portrait-tile" aria-hidden="true">
            <div className="portrait-halo" />
            <div className="portrait-head"><span className="portrait-hair" /><span className="portrait-eye portrait-eye--left" /><span className="portrait-eye portrait-eye--right" /><span className="portrait-nose" /><span className="portrait-mouth" /></div>
            <div className="portrait-shoulders" />
            <span className="portrait-caption">ILLUSTRATIVE PROFILE</span>
          </div>
          <div className="preview-bars">
            {previewAxes.map((axis, i) => (
              <div className="preview-bar" key={axis.id}>
                <div className="preview-bar__text"><span>{axis.name}</span><b>{EXAMPLE_SCORES[i] ?? 56}%</b></div>
                <div className="preview-bar__track"><i style={{ left: `${EXAMPLE_SCORES[i] ?? 56}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="preview-card__foot"><span><Sparkles size={12} /> EXAMPLE ONLY</span><span>12 DIMENSIONS</span></div>
      </div>
      <div className="preview-orbit preview-orbit--one" />
      <div className="preview-orbit preview-orbit--two" />
    </div>
  )
}

function SiteHeader({ onStart }: { onStart: (mode: TestMode) => void }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#axes">The 12 Axes</a>
          <a href="#methodology">Methodology</a>
          <button className="button button--nav" onClick={() => onStart('standard')}>Take the test <ArrowUpRight size={15} /></button>
        </nav>
        <a className="mobile-start" href="#test" onClick={() => onStart('standard')}>Take the test <ArrowUpRight size={14} /></a>
      </div>
    </header>
  )
}

function ModeCard({ mode, featured, onStart }: { mode: TestMode; featured?: boolean; onStart: (mode: TestMode) => void }) {
  const details = MODE_DETAILS[mode]
  return (
    <article className={`mode-card${featured ? ' mode-card--featured' : ''}`}>
      <div className="mode-card__head">
        <span className={`mode-icon mode-icon--${mode}`}>
          {mode === 'quick' ? <ArrowDownRight size={20} /> : mode === 'extended' ? <Compass size={20} /> : <Sparkles size={20} />}
        </span>
        {featured && <span className="recommended">Recommended</span>}
      </div>
      <h3>{details.label}</h3>
      <p className="mode-card__count">{details.count}<span> questions</span></p>
      <p className="mode-card__description">{details.description}</p>
      <div className="mode-card__foot"><span>{details.time}</span><span>All 12 axes</span></div>
      <button className={`button ${featured ? 'button--primary' : 'button--outline'} button--wide`} onClick={() => onStart(mode)}>
        Start {details.label.toLowerCase()} test <ArrowRight size={16} />
      </button>
    </article>
  )
}

function HomePage({ onStart }: { onStart: (mode: TestMode) => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const groupNames = [...new Set(AXES.map((axis) => axis.group))]
  const groupIcons = [<Landmark size={17} />, <Sparkles size={17} />, <ArrowDownRight size={17} />, <Globe2 size={17} />]
  return (
    <>
      <SiteHeader onStart={onStart} />
      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow"><span /> A WIDER VIEW OF YOUR POLITICS</div>
            <h1>12 Axes Political Test: <em>Explore Your Views Beyond Left and Right</em></h1>
            <p className="hero-description">Answer questions about power, society, the economy, and the world. Explore twelve dimensions of your views — and see how your answers shape each result.</p>
            <div className="hero-actions">
              <button className="button button--primary button--large" onClick={() => onStart('standard')}>Start the standard test <span className="button-note">60 questions</span> <ArrowUpRight size={17} /></button>
              <button className="button button--text" onClick={() => onStart('quick')}>Try the quick test · 36 questions <ArrowRight size={16} /></button>
            </div>
            <div className="trust-points"><span><Check size={14} /> Free</span><span><Check size={14} /> No account required</span><span><Check size={14} /> Instant results</span></div>
          </div>
          <div className="hero-art"><div className="art-kicker"><span className="status-dot" /> EXAMPLE RESULT</div><AxisCardPreview /></div>
          <a className="scroll-hint" href="#test" aria-label="Scroll to test options"><span /> SCROLL TO EXPLORE</a>
        </section>

        <section id="test" className="section section--modes">
          <div className="section-heading section-heading--center">
            <span className="eyebrow">CHOOSE YOUR STARTING POINT</span>
            <h2>Choose Your 12 Axes Political Test</h2>
            <p>Every version covers all twelve dimensions. Take a quick first look or go deeper.</p>
          </div>
          <div className="mode-grid">
            <ModeCard mode="quick" onStart={onStart} />
            <ModeCard mode="standard" featured onStart={onStart} />
            <ModeCard mode="extended" onStart={onStart} />
          </div>
          <p className="mode-disclaimer">Choose at your own pace. Your progress stays in this page until you finish or leave.</p>
        </section>

        <section className="section discover-section">
          <div className="discover-intro"><span className="eyebrow">WHAT YOU’LL DISCOVER</span><h2>A report that leaves room for nuance.</h2><p>Each answer adds context to a picture of your political views — not a box to put you in.</p></div>
          <div className="discover-steps">
            <article><span className="step-number">01</span><span className="step-icon"><Compass size={21} /></span><h3>Your twelve scores</h3><p>See where your answers fall across twelve distinct dimensions of political life.</p><span className="step-word">ANSWER</span></article>
            <article><span className="step-number">02</span><span className="step-icon"><Sparkles size={21} /></span><h3>Plain-language context</h3><p>Explore what each axis describes and what both ends of the scale can mean.</p><span className="step-word">REVIEW</span></article>
            <article><span className="step-number">03</span><span className="step-icon"><ArrowUpRight size={21} /></span><h3>Ideas to explore</h3><p>Use your report as a starting point for reading, discussion, and reflection.</p><span className="step-word">EXPLORE</span></article>
          </div>
        </section>

        <section id="axes" className="section axes-section">
          <div className="section-heading section-heading--split"><div><span className="eyebrow">THE FRAMEWORK</span><h2>What does the 12 Axes Political Test measure?</h2></div><p>Separate dimensions give different political questions their own space. Together they make a wider — and still imperfect — view.</p></div>
          <div className="axis-groups">
            {groupNames.map((group, index) => (
              <article className="axis-group" key={group}>
                <div className="axis-group__head"><span className="axis-group__icon">{groupIcons[index % groupIcons.length]}</span><div><span className="axis-group__index">0{index + 1} / 04</span><h3>{group}</h3></div></div>
                <div className="axis-group__list">
                  {AXES.filter((axis) => axis.group === group).map((axis) => <AxisPreviewRow key={axis.id} axis={axis} />)}
                </div>
              </article>
            ))}
          </div>
          <div className="compass-note"><div className="compass-note__icon"><Compass size={21} /></div><div><strong>How does this compare with a political compass?</strong><p>A familiar two-axis compass offers a broad overview. Twelve dimensions let different political questions have their own space. Neither diagram captures everything about a person.</p></div><a href="#methodology">Understand the framework <ArrowRight size={14} /></a></div>
        </section>

        <section id="methodology" className="section transparency-section">
          <div className="transparency-heading"><span className="eyebrow">OPEN ABOUT THE LIMITS</span><h2>Understand the score.<br /><em>Stay in control.</em></h2><p>Results can be interesting without being definitive. Here is what this test does — and does not — claim.</p></div>
          <div className="transparency-cards">
            <article><span className="transparency-icon"><Compass size={18} /></span><span className="eyebrow">SCORING &amp; LIMITATIONS</span><h3>A reflection, not a diagnosis.</h3><p>Answers contribute to each dimension using the direction of the statement and your selected response. Scores describe your responses within this model; they are not a scientifically validated classification of your political identity.</p><a href="#faq">Read the FAQ <ArrowRight size={14} /></a></article>
            <article><span className="transparency-icon"><ShieldCheck size={18} /></span><span className="eyebrow">YOUR ANSWERS &amp; PRIVACY</span><h3>Your answers stay in this page.</h3><p>This demo calculates results locally in your browser. No account is required, answers are not sent to a server, and progress clears when you refresh or leave.</p><a href="#faq">How this demo handles data <ArrowRight size={14} /></a></article>
          </div>
        </section>

        <section id="faq" className="section faq-section">
          <div className="faq-intro"><span className="eyebrow">A FEW THINGS TO KNOW</span><h2>12 Axes Political Test FAQ</h2><p>Clear answers about the quiz, your report, and its limits.</p><div className="faq-cta"><ShieldCheck size={18} /><span>Your responses remain in this browser demo.</span></div></div>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, index) => <article className={`faq-item${openFaq === index ? ' faq-item--open' : ''}`} key={item.q}>
              <h3><button aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)}>{item.q}<ChevronDown size={18} /></button></h3>
              {openFaq === index && <p>{item.a}</p>}
            </article>)}
          </div>
        </section>

        <section className="closing-cta"><div className="closing-cta__orb" /><span className="eyebrow">MAKE ROOM FOR NUANCE</span><h2>Ready to take the<br /><em>12 Axes Political Test?</em></h2><p>Start with 60 questions across twelve dimensions.</p><button className="button button--light button--large" onClick={() => onStart('standard')}>Start the standard test <ArrowUpRight size={17} /></button><span className="closing-note">Free · No account · Your answers stay on this page</span></section>
      </main>
      <SiteFooter />
    </>
  )
}

function AxisPreviewRow({ axis }: { axis: Axis }) {
  return <div className="axis-preview-row"><div className="axis-preview-row__meta"><span>{axis.name}</span><span>{axis.lowLabel}<i> ↔ </i>{axis.highLabel}</span></div><p>{axis.description}</p></div>
}

function SiteFooter() {
  return <footer className="site-footer"><div className="footer-main"><Brand /><p>A wider view of your politics.<br />A starting point for exploring, not a label.</p><div className="footer-links"><a href="#axes">The 12 Axes</a><a href="#methodology">Methodology</a><a href="#faq">FAQ</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} 12 axes political test</span><span>Illustrative model · Not a scientific classification</span><a href="https://12axespoliticaltest.org/">12axespoliticaltest.org <ArrowUpRight size={12} /></a></div></footer>
}

function getModeQuestions(mode: TestMode): Question[] {
  return QUESTION_BANK.slice(0, MODE_DETAILS[mode].count)
}

function QuestionScreen({ mode, answers, setAnswers, onExit, onFinish }: {
  mode: TestMode
  answers: Answers
  setAnswers: (answers: Answers) => void
  onExit: () => void
  onFinish: () => void
}) {
  const questions = useMemo(() => getModeQuestions(mode), [mode])
  const [index, setIndex] = useState(0)
  const question = questions[index]
  const axis = AXES.find((item) => item.id === question.axisId)!
  const response = answers[question.id]
  const progress = ((index + 1) / questions.length) * 100
  const groupQuestions = questions.filter((item) => item.axisId === axis.id)
  const axisProgress = groupQuestions.filter((item) => answers[item.id] !== undefined).length

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [index])

  const answerQuestion = (value: number) => setAnswers({ ...answers, [question.id]: value })
  const goNext = () => {
    if (response === undefined) return
    if (index === questions.length - 1) onFinish()
    else setIndex(index + 1)
  }

  return (
    <main className="quiz-page">
      <div className="quiz-topbar"><button className="quiz-brand" onClick={onExit} aria-label="Exit the test"><BrandMark small /><span>12 Axes<span>Political Test</span></span></button><span className="quiz-mode">{MODE_DETAILS[mode].label} <i>·</i> {questions.length} questions</span><button className="icon-button" onClick={onExit} aria-label="Close test"><X size={20} /></button></div>
      <div className="quiz-progress"><div className="quiz-progress__line"><span style={{ width: `${progress}%` }} /></div><div className="quiz-progress__meta"><span>QUESTION {String(index + 1).padStart(2, '0')} <i>/</i> {questions.length}</span><span>{axisProgress} of {groupQuestions.length} in this axis</span></div></div>
      <div className="quiz-body">
        <div className="quiz-context"><span className="context-icon"><Compass size={17} /></span><span>{axis.group}</span><span className="context-dot">·</span><span>{axis.name}</span></div>
        <div className="question-card"><span className="question-overline">STATEMENT {String(index + 1).padStart(2, '0')}</span><h1>{question.text}</h1><p className="question-instruction">How much do you agree or disagree?</p>
          <div className="response-grid" role="group" aria-label="Choose how much you agree with this statement">
            {RESPONSE_OPTIONS.map((option) => <button key={option.value} className={`response-option${response === option.value ? ' response-option--selected' : ''}`} aria-pressed={response === option.value} onClick={() => answerQuestion(option.value)}>
              <span className="response-option__dot"><i /></span><span className="response-option__label">{option.label}</span>
            </button>)}
          </div>
          <div className="scale-ends"><span>Strongly disagree</span><span>Strongly agree</span></div>
          {response === undefined && <p className="answer-reminder" aria-live="polite">Select a response to continue. “Unsure / neutral” is always okay.</p>}
        </div>
        <div className="quiz-navigation"><button className="button button--back" onClick={() => index === 0 ? onExit() : setIndex(index - 1)}><ChevronLeft size={17} /> {index === 0 ? 'Exit test' : 'Previous'}</button><span className="saved-note"><ShieldCheck size={14} /> Answers stay in this page</span><button className="button button--primary button--next" disabled={response === undefined} onClick={goNext}>{index === questions.length - 1 ? 'View my results' : 'Next question'} {index === questions.length - 1 ? <Sparkles size={16} /> : <ChevronRight size={17} />}</button></div>
        <div className="quiz-dots" aria-label={`Question ${index + 1} of ${questions.length}`}><span style={{ width: `${progress}%` }} /></div>
      </div>
    </main>
  )
}

function ResultRow({ axis, score }: { axis: Axis; score: number }) {
  const side = score < 43 ? axis.lowLabel : score > 57 ? axis.highLabel : 'Near the middle'
  return <article className="result-axis">
    <div className="result-axis__head"><div><span className="result-axis__group">{axis.group}</span><h3>{axis.name}</h3></div><div className="result-axis__score"><strong>{score}%</strong><span>{side}</span></div></div>
    <div className="result-axis__ends"><span>{axis.lowLabel}</span><span>{axis.highLabel}</span></div>
    <div className="result-track" role="img" aria-label={`${axis.name}: ${score} percent toward ${axis.highLabel}`}><span className="result-track__center" /><i style={{ left: `${score}%` }} /></div>
    <p>{axis.description}</p>
  </article>
}

function ResultsScreen({ answers, onRetake, onBack }: { answers: Answers; onRetake: (mode: TestMode) => void; onBack: () => void }) {
  const [copied, setCopied] = useState(false)
  const axisScores = AXES.map((axis) => {
    const axisQuestions = QUESTION_BANK.filter((question) => question.axisId === axis.id && answers[question.id] !== undefined)
    const normalized = axisQuestions.map((question) => ((answers[question.id] * question.polarity + 2) / 4) * 100)
    return { axis, score: Math.round(normalized.reduce((sum, value) => sum + value, 0) / normalized.length), answered: axisQuestions.length }
  })
  const dateText = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date())
  const summaryText = `My 12 Axes Political Test summary (${dateText})\n${axisScores.map(({ axis, score }) => `${axis.name}: ${score}%`).join('\n')}\nIllustrative self-reflection only — not a scientific classification.`
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: 'My 12 Axes Political Test results', text: summaryText })
      else { await navigator.clipboard.writeText(summaryText); setCopied(true); window.setTimeout(() => setCopied(false), 2200) }
    } catch { /* Share sheets can be dismissed without an action. */ }
  }
  const allAnswered = axisScores.every((item) => item.answered > 0)
  return (
    <main className="results-page">
      <div className="results-topbar"><button className="quiz-brand" onClick={onBack}><BrandMark small /><span>12 Axes<span>Political Test</span></span></button><button className="button button--outline button--small" onClick={() => onRetake('standard')}><RotateCcw size={14} /> Retake test</button></div>
      <div className="results-hero"><span className="eyebrow"><Sparkles size={14} /> YOUR ANSWERS, YOUR REPORT</span><h1>A wider view of <em>your politics.</em></h1><p>Your answers create a set of scores within this model. They are one way to reflect on your views — not a final definition of who you are.</p><div className="results-meta"><span><Check size={14} /> 12 dimensions covered</span><span>{dateText}</span><span><ShieldCheck size={14} /> Calculated in this browser</span></div></div>
      <section className="results-content" aria-label="Your twelve axis results">
        {!allAnswered && <p className="results-warning">At least one dimension has no scored answer. Retake the test for a complete report.</p>}
        <div className="results-grid">{axisScores.map(({ axis, score }) => <ResultRow key={axis.id} axis={axis} score={score} />)}</div>
        <div className="results-actions"><button className="button button--primary" onClick={share}><Share2 size={16} /> {copied ? 'Copied to clipboard' : 'Share summary'}</button><button className="button button--outline" onClick={() => onRetake('standard')}><RotateCcw size={16} /> Retake the test</button></div>
        <div className="results-limit"><ShieldCheck size={18} /><p><strong>A note about these scores.</strong> This report reflects answers and scoring rules in this demo. It has not been scientifically validated, and it does not store or send individual responses. Similarity or direction is not an endorsement or an identity label.</p></div>
      </section>
      <footer className="results-footer"><a href="https://12axespoliticaltest.org/">12 axes political test</a><span>Explore all 12 dimensions · Answers stay in this page</span></footer>
    </main>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [mode, setMode] = useState<TestMode>('standard')
  const [answers, setAnswers] = useState<Answers>({})
  const startTest = (selectedMode: TestMode) => {
    setMode(selectedMode)
    setAnswers({})
    setScreen('test')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const backHome = () => {
    setScreen('home')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  useEffect(() => {
    document.title = screen === 'results' ? 'Your Results — 12 Axes Political Test' : screen === 'test' ? `${MODE_DETAILS[mode].label} Test — 12 Axes Political Test` : '12 Axes Political Test — Explore Your Views Beyond Left and Right'
  }, [screen, mode])
  if (screen === 'test') return <QuestionScreen mode={mode} answers={answers} setAnswers={setAnswers} onExit={backHome} onFinish={() => { setScreen('results'); window.scrollTo({ top: 0, behavior: 'instant' }) }} />
  if (screen === 'results') return <ResultsScreen answers={answers} onBack={backHome} onRetake={startTest} />
  return <HomePage onStart={startTest} />
}
