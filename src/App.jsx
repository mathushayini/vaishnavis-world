import React, { useEffect, useRef, useState } from "react";
import {
  Heart, Camera, Mail, Gift, Music2, Play, Pause, Sparkles,
  Star, Cake, ChevronDown, X, LockKeyhole, PartyPopper, Feather, BookOpen,
  School, Crown, ArrowRight, Flower2
} from "lucide-react";

const reasons = [
  "You make ordinary school-day memories feel magical.",
  "You know how to make me laugh even on difficult days.",
  "You have been part of so many chapters of my life.",
  "You make friendship feel safe, warm and genuine.",
  "You listen to my little stories.",
  "You bring your own sparkle wherever you go.",
  "We can laugh about things nobody else understands.",
  "You are someone I can be completely myself around.",
  "You make memories that I will keep for years.",
  "You have a beautiful way of caring.",
  "You make even simple moments special.",
  "You are one of my favourite people to celebrate.",
  "Our school memories will always have a place in my heart.",
  "You deserve every good thing life has to offer.",
  "You remind me that true friendship is precious.",
  "You are strong in ways you may not always notice.",
  "You make happiness contagious.",
  "You have been there in your own special way.",
  "There is always another story to laugh about with you.",
  "You are wonderfully, uniquely YOU.",
  "I am grateful our paths crossed.",
  "I hope this new chapter brings you beautiful surprises.",
  "Because life is sweeter with you in it. ❣️"
];

const quiz = [
  { q: "Where did Mathu first notice Vaishu at school?", a: ["Saiva Neri class", "The canteen", "Sports day", "The library"], correct: 0 },
  { q: "Which homemade treat from Vaishu's Amma is still Mathu's favourite?", a: ["Chocolate cake", "Milk bread toast", "Pancakes", "Samosas"], correct: 1 },
  { q: "How many gifts did Vaishu give Mathu for her 23rd birthday?", a: ["12", "18", "23", "30"], correct: 2 },
  { q: "What warm snack did Mathu buy Vaishu during their walk?", a: ["Roasted peanuts", "Boiled fresh corn", "Sweet potato", "Cotton candy"], correct: 1 },
  { q: "What sweet nickname has Mathu called Vaishu for years?", a: ["Chellam", "Kutty", "Bujji", "Thangam"], correct: 2 }
];

const memoryQuestions = [
  {
    question: "Which two lovely places did we visit first on our last meet-up?",
    hint: "Think of the two sweet little spots we explored before the rest of our day began!",
    answers: ["creamy creations and creamy cafe", "creamy creations creamy cafe"]
  },
  {
    question: "On our walk, what warm, freshly made snack did I buy for you?",
    hint: "It was served steaming hot, with little kernels you can nibble one by one!",
    answers: ["boiled fresh corn"]
  },
  {
    question: "What was the name of the bookshop we visited together—the one with a name only we would remember?",
    hint: "Remember the shop name that sounds like a special place for books and business!",
    answers: ["aaseer vaniga nilaiyam"]
  },
  {
    question: "What adorable nickname have I called you from back then until now?",
    hint: "It's a tiny, affectionate name I still use for my favourite person!",
    answers: ["bujji"]
  },
  {
    question: "At the place where we had lunch on our last meet-up, what little thing did I give you?",
    hint: "A small traditional dot you can wear on your forehead—what is it called?",
    answers: ["pottu", "bindhi", "bindi", "pottu bindhi", "pottu bindi"]
  }
];

const normalizeAnswer = (value) => value.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]/g, "");

function App() {
  const [musicOn, setMusicOn] = useState(false);
  const [entered, setEntered] = useState(() => sessionStorage.getItem("vaishuBirthdayEntered") === "true");
  const [memoryStep, setMemoryStep] = useState(() => Number(sessionStorage.getItem("vaishuBirthdayMemoryStep") || 0));
  const [memoryAnswer, setMemoryAnswer] = useState("");
  const [memoryError, setMemoryError] = useState("");
  const [celebrationId, setCelebrationId] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [birthdayCardOpen, setBirthdayCardOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [videoMissing, setVideoMissing] = useState(false);
  const [giftVideoMissing, setGiftVideoMissing] = useState(false);
  const [voiceMessageError, setVoiceMessageError] = useState("");
  const [letterOpen, setLetterOpen] = useState(false);
  const [letterStage, setLetterStage] = useState("envelope");
  const [giftOpen, setGiftOpen] = useState(false);
  const [revealed, setRevealed] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState(() => JSON.parse(sessionStorage.getItem("vaishuBirthdayQuizAnswers") || "{}"));
  const [quizDone, setQuizDone] = useState(() => sessionStorage.getItem("vaishuBirthdayQuizDone") === "true");
  const [explorationProgress, setExplorationProgress] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) audio.play().catch(() => setMusicOn(false));
    else audio.pause();
  }, [musicOn]);

  useEffect(() => {
    sessionStorage.setItem("vaishuBirthdayEntered", String(entered));
    sessionStorage.setItem("vaishuBirthdayMemoryStep", String(memoryStep));
    sessionStorage.setItem("vaishuBirthdayQuizAnswers", JSON.stringify(quizAnswers));
    sessionStorage.setItem("vaishuBirthdayQuizDone", String(quizDone));
  }, [entered, memoryStep, quizAnswers, quizDone]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
      setExplorationProgress(Math.min(100, Math.max(0, progress)));
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [entered]);

  const revealReason = (i) => {
    setRevealed((old) => old.includes(i) ? old : [...old, i]);
  };
  const score = quiz.reduce((n, item, i) => n + (quizAnswers[i] === item.correct ? 1 : 0), 0);
  const openLetterExperience = () => { setLetterStage("envelope"); setLetterOpen(true); };

  return (
    <main className="birthday-app">
      <style>{`
        .birthday-app{overflow:clip} .memory-full{display:block;max-width:100%;max-height:70vh;object-fit:contain;margin:auto;border-radius:14px} .photo-card img{cursor:zoom-in} .video-fallback{background:#fff0f6;border-radius:18px;min-height:220px;display:grid;place-content:center;justify-items:center;color:#bc5b89;padding:25px;text-align:center} .video-fallback p{font:italic 20px Georgia,serif} .confetti-line{font-size:26px;letter-spacing:13px;color:#d86a98;animation:float 3s infinite} 

        .letter-card{position:relative;overflow:hidden}.letter-card:before{content:"";position:absolute;width:190px;height:190px;border-radius:50%;background:#ffe1ed;right:-80px;top:-90px;opacity:.7}
        .letter-icon{position:relative;display:grid;place-items:center;width:72px;height:72px;border-radius:24px;background:linear-gradient(145deg,#ffe0ec,#fff3f8);color:#c34f83;box-shadow:0 12px 30px #c34f8320;margin:0 auto 18px}
        .letter-card .section-kicker,.letter-card h2,.letter-card p,.letter-card button{position:relative}.letter-card h2{color:#a83f70}
        .modal{max-height:88vh;overflow-y:auto}.envelope-screen{text-align:center;padding:22px 12px 12px}.envelope-art{width:150px;height:112px;margin:8px auto 24px;position:relative;display:grid;place-items:center;filter:drop-shadow(0 14px 15px #b84d7b25)}
        .envelope-body{position:absolute;inset:18px 0 0;background:linear-gradient(145deg,#ffc5dc,#f49abd);border-radius:12px 12px 18px 18px}.envelope-flap{position:absolute;top:18px;left:0;width:100%;height:72px;background:#ffe0ec;clip-path:polygon(0 0,100% 0,50% 76%);transform-origin:top}
        .envelope-seal{z-index:2;position:relative;margin-top:30px;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#fff7fa;color:#c34f83;box-shadow:0 3px 12px #9c426622}
        .envelope-screen h3{color:#a83f70;font-family:Georgia,serif;font-size:1.65rem;margin:8px 0}.envelope-screen p{line-height:1.8;max-width:470px;margin:10px auto 20px;color:#76566a}
        .envelope-hint{display:inline-flex;align-items:center;gap:7px;color:#c34f83;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;margin-bottom:18px}
        .letter-content{text-align:left;line-height:1.9;color:#68495b;padding:4px 2px 12px}.letter-content p{margin:0 0 16px}.letter-content .letter-opening{font-family:Georgia,serif;font-size:1.3rem;color:#b54879;font-weight:700}
        .letter-divider{display:flex;align-items:center;gap:12px;color:#d17a9f;margin:20px 0}.letter-divider:before,.letter-divider:after{content:"";height:1px;background:#f2c7d9;flex:1}
        .gift-reveal{text-align:center;padding:10px 8px 18px}.gift-reveal .big-heart{font-size:4.4rem;animation:giftFloat 2.4s ease-in-out infinite}.gift-reveal h3{color:#a83f70;font-family:Georgia,serif;font-size:1.65rem}.gift-reveal p{line-height:1.85;color:#76566a}
        .gift-reveal .gift-note{background:#fff0f6;border:1px solid #f6c8dc;border-radius:18px;padding:16px;margin:18px 0;color:#9c4a70}.gift-reveal .signature{color:#b54879;font-weight:700}
        @keyframes giftFloat{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-9px) rotate(4deg)}}
        @media(max-width:600px){.modal{width:calc(100% - 24px);max-height:90vh}.letter-content{font-size:.96rem}}
      `}</style>
      {!entered && <div className="welcome-screen" role="dialog" aria-label="Birthday surprise memory check">
        {celebrationId > 0 && <div className="falling-stars" key={celebrationId} aria-hidden="true">
          {Array.from({ length: 28 }, (_, index) => <span key={index} style={{
            left: `${(index * 41) % 100}%`,
            animationDelay: `${(index % 7) * 0.08}s`,
            animationDuration: `${1.2 + (index % 5) * 0.12}s`,
            fontSize: `${12 + (index % 4) * 5}px`
          }}>{["✦", "✧", "✩", "⋆"][index % 4]}</span>)}
        </div>}
        <div className="welcome-spark spark-a">✧</div><div className="welcome-spark spark-b">♡</div><div className="welcome-spark spark-c">✦</div>
        <div className="welcome-card">
          <span className="welcome-seal"><LockKeyhole size={28} /></span>
          <span className="section-kicker"><Sparkles size={14}/> A SECRET BIRTHDAY SURPRISE <Sparkles size={14}/></span>
          <p className="welcome-overline">A little memory check for</p>
          <h2>Vaishnavi <span>♡</span></h2>
          <p className="welcome-number">Only my favourite memory-keeper gets in!</p>
          <div className="welcome-line" />
          <p className="memory-welcome-copy">Five little questions about <em>our</em> memories stand between you and your birthday surprise. Ready, bestie?</p>
          <div className="memory-progress" aria-label={`Question ${memoryStep + 1} of ${memoryQuestions.length}`}>
            {memoryQuestions.map((item, index) => <span key={item.question} className={index <= memoryStep ? "active" : ""} />)}
          </div>
          <form className="memory-form" onSubmit={(event) => {
            event.preventDefault();
            const acceptedAnswers = memoryQuestions[memoryStep].answers.map(normalizeAnswer);
            if (acceptedAnswers.includes(normalizeAnswer(memoryAnswer))) {
              setCelebrationId((id) => id + 1);
              if (memoryStep === memoryQuestions.length - 1) {
                setIsUnlocking(true);
                sessionStorage.setItem("vaishuBirthdayEntered", "true");
                window.setTimeout(() => setEntered(true), 1700);
              } else {
                setMemoryStep((step) => {
                  const nextStep = step + 1;
                  sessionStorage.setItem("vaishuBirthdayMemoryStep", String(nextStep));
                  return nextStep;
                });
                setMemoryAnswer("");
              }
              setMemoryError("");
            } else {
              setMemoryError("Not quite, bestie! Take another guess—our little memories are waiting ✨");
            }
          }}>
            <p className="memory-step-label">MEMORY {String(memoryStep + 1).padStart(2, "0")} OF {String(memoryQuestions.length).padStart(2, "0")}</p>
            <h3>{memoryQuestions[memoryStep].question}</h3>
            <p className="memory-hint"><Sparkles size={15}/><span><strong>Little hint:</strong> {memoryQuestions[memoryStep].hint}</span></p>
            <label className="memory-answer-label" htmlFor="memory-answer">Your answer</label>
            <input id="memory-answer" autoComplete="off" value={memoryAnswer} disabled={isUnlocking} onChange={(event) => { setMemoryAnswer(event.target.value); setMemoryError(""); }} placeholder="Type your answer here..." />
            {memoryError && <p className="memory-error" role="alert">{memoryError}</p>}
            <button className="primary-btn welcome-enter" type="submit" disabled={!memoryAnswer.trim() || isUnlocking}>
              {isUnlocking ? "Your surprise is opening..." : memoryStep === memoryQuestions.length - 1 ? "Unlock my birthday surprise" : "That's my answer"} <ArrowRight size={18}/>
            </button>
          </form>
          <small>Made with love, just for you · Mathu ♡</small>
        </div>
      </div>}
      {entered && <>
      <div className="exploration-progress" role="progressbar" aria-label="Birthday world explored" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(explorationProgress)}>
        <span style={{ width: `${explorationProgress}%` }} />
      </div>
      <div className="angel-glitter" aria-hidden="true">
        {Array.from({ length: 22 }, (_, index) => <span key={index} style={{
          left: `${(index * 37 + 8) % 100}%`,
          top: `${(index * 53 + 7) % 100}%`,
          animationDelay: `${(index % 9) * -0.7}s`,
          animationDuration: `${3.2 + (index % 5) * 0.6}s`
        }}>{["✧", "✦", "♡", "⋆"][index % 4]}</span>)}
      </div>
      <audio ref={audioRef} src="/media/birthday-song.mpeg" loop />
      <nav className="nav">
        <a className="brand" href="#home"><Heart size={17} fill="currentColor" /> Vaishnavi's World</a>
        <button className="music-btn" onClick={() => setMusicOn(!musicOn)} aria-label="Toggle background music">
          <span className="cassette-mini" aria-hidden="true"><i/><i/></span>
          {musicOn ? <Pause size={16}/> : <Music2 size={16}/>}
          <span>{musicOn ? "Pause our song" : "Play our song"}</span>
        </button>
      </nav>

      <section className="hero" id="home">
        <div className="floating f1">♡</div><div className="floating f2">✦</div>
        <div className="floating f3">♡</div><div className="floating f4">✧</div>
        <div className="hero-inner">
          <div className="eyebrow"><Sparkles size={15}/> MADE WITH LOVE, JUST FOR YOU <Sparkles size={15}/></div>
          <p className="small-date">NOVEMBER 12, 2026</p>
          <div className="hero-animation-frame">
            <span className="hero-animation-spark hero-animation-spark-one" aria-hidden="true">✦</span>
            <span className="hero-animation-spark hero-animation-spark-two" aria-hidden="true">♡</span>
            <video
              className="hero-animation"
              src="/media/homepage-animation.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label="A little birthday animation for Vaishnavi"
            />
            <span className="hero-animation-caption"><Sparkles size={13}/> A little birthday magic <Sparkles size={13}/></span>
          </div>
          <h1>Happy Birthday,<br/><span>Vaishnavi ❣️</span></h1>
          <p className="chapter">Chapter 23 begins now...</p>
          <p className="hero-copy">23 years of you. A lifetime of memories to celebrate.<br/>And a little website made by your school-time best friend.</p>
          <button className={`birthday-card-trigger ${birthdayCardOpen ? "is-open" : ""}`} onClick={() => setBirthdayCardOpen((open) => !open)} aria-expanded={birthdayCardOpen}>
            <span className="birthday-card-art" aria-hidden="true"><Cake size={32}/><span>✦ ♡ ✦</span></span>
            <span>{birthdayCardOpen ? "Close your birthday card" : "Tap to open your birthday card"}</span>
            <ArrowRight size={16}/>
          </button>
          {birthdayCardOpen && <div className="birthday-card-message" role="status">
            <span className="birthday-card-confetti" aria-hidden="true">✦ · ♡ · ✧ · ✦</span>
            <h2>Happy Birthday, my Vaishu! 🎂</h2>
            <p>May your 23rd chapter be filled with laughter, lovely surprises, and all the happiness your heart can hold. So lucky to call you my best friend! 💗</p>
            <span className="signature">Forever cheering for you · Mathu</span>
          </div>}
          <div className="voice-message-card">
            <span className="voice-message-icon"><Music2 size={21}/></span>
            <div className="voice-message-copy">
              <strong>A little voice note, just for you 🎙️</strong>
              <span>Press play whenever you want to hear me say happy birthday.</span>
            </div>
            {!voiceMessageError && <audio
              className="voice-message-player"
              controls
              preload="metadata"
              src="/media/vaishu-voice-message.mp3"
              onLoadedMetadata={(event) => {
                if (event.currentTarget.duration > 300) {
                  event.currentTarget.pause();
                  setVoiceMessageError("This voice note is longer than 5 minutes. Please use a shorter recording.");
                }
              }}
              onError={() => setVoiceMessageError("Add your voice recording (up to 5 minutes) as vaishu-voice-message.mp3 in public/media.")}
            />}
            {voiceMessageError && <p className="voice-message-help" role="status">{voiceMessageError}</p>}
          </div>
          <a className="primary-btn" href="#memories">Open your birthday surprise <Heart size={17} fill="currentColor"/></a>
          <div className="scroll-note"><ChevronDown size={16}/> SCROLL TO EXPLORE</div>
        </div>
        <div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div>
      </section>

      <section className="intro section">
        <span className="section-kicker">A LITTLE NOTE BEFORE YOU EXPLORE</span>
        <h2>Some people make life <em>more beautiful.</em></h2>
        <p>And then there are people who become part of your favourite memories. This little corner of the internet is dedicated to one of them — you, Vaishu. 💗</p>
      </section>

      <section className="story-strip section" aria-label="Our friendship timeline">
        <span className="section-kicker">SOME STORIES ARE WRITTEN IN YEARS</span>
        <h2>And ours started with a little hello <span>♡</span></h2>
        <div className="timeline">
          {[
            ["GRADE 6", "The beginning", "A quiet wish to become your friend"],
            ["GRADE 9–11", "The golden days", "Classes, canteen laughs & milk bread toast"],
            ["A/L DAYS", "Different paths", "A friendship that always found its way"],
            ["2026", "Still us", "Another reunion, the same special bond"]
          ].map(([year,heading,detail],i) => <div className="timeline-item" key={year}><span className="timeline-dot">{i+1}</span><span className="timeline-year">{year}</span><h3>{heading}</h3><p>{detail}</p></div>)}
        </div>
      </section>
      <section className="section memories" id="memories">
        <div className="section-heading"><span className="section-kicker">CHAPTER 01 · THE GOOD OLD DAYS</span><h2>Our little memory lane 📸</h2><p>A collection of the little moments that became our big memories.</p></div>
        <div className="scrapbook-note"><Sparkles size={16}/><span>OUR FRIENDSHIP, PRESSED BETWEEN THE PAGES</span><Heart size={16} fill="currentColor"/></div>
        <div className="photo-grid">
          {["memory-1.jpeg","memory-2.png","memory-3.png","memory-4.png"].map((file,i) =>
            <div className={`photo-card photo-${i+1}`} key={file}>
              <img src={`/media/${file}`} alt={`Friendship memory ${i+1}`} onClick={() => setSelectedPhoto(`/media/${file}`)} onError={(e) => {e.currentTarget.style.display="none";}}/>
              <div className="photo-placeholder"><Camera size={25}/><span>Add memory {i+1}</span></div>
              <span className="tape"></span>
              <p>{["The unforgettable days","Our silly moments","Forever memories","More adventures"][i]}</p>
            </div>
          )}
        </div>
      </section>

      <section className="section reasons">
        <div className="section-heading"><span className="section-kicker">CHAPTER 02 · 23 LITTLE REMINDERS</span><h2>23 reasons you're special 💗</h2><p>Tap each heart to open a little reminder.</p></div>
        <div className="reason-grid">
          {reasons.map((reason,i) => <button className={`reason-card ${revealed.includes(i) ? "revealed":""}`} key={i} onClick={() => revealReason(i)}>
            <span className="reason-sparkle reason-sparkle-one" aria-hidden="true">✦</span>
            <span className="reason-sparkle reason-sparkle-two" aria-hidden="true">✧</span>
            {revealed.includes(i) ? <><span className="reason-number">{String(i+1).padStart(2,"0")}</span><p>{reason}</p></> : <><Heart size={25} fill="currentColor"/><span>{String(i+1).padStart(2,"0")}</span><small>Tap to reveal</small></>}
          </button>)}
        </div>
        <p className="progress">{revealed.length} of 23 little reminders opened 💕</p>
      </section>

      <section className="letter-section section">
        <div className="letter-card">
          <div className="letter-icon"><Mail size={29}/></div>
          <span className="section-kicker">CHAPTER 03 · A LITTLE SECRET</span>
          <h2>A letter I kept in my heart 💌</h2>
          <p>Some memories deserve more than a message. I saved a little story just for you.</p>
          <button className="primary-btn" onClick={openLetterExperience}>Open your secret envelope <Mail size={17}/></button>
        </div>
      </section>

      <section className="section video-section">
        <div className="video-card">
          <div className="video-art"><Play size={38} fill="currentColor"/></div>
          <span className="section-kicker">CHAPTER 04 · A MESSAGE JUST FOR YOU</span>
          <h2>A little video hug 🎥</h2>
          <p>A little birthday wish, in my own voice, just for you.</p>
          <button className="outline-btn" onClick={() => setVideoOpen(true)}>Watch my message</button>
        </div>
      </section>

      <section className="gift-section section">
        <div className="gift-card">
          <div className="gift-sparkle"><Star/><Sparkles/></div>
          <span className="gift-seal">A LITTLE SOMETHING · JUST FOR YOU</span>
          <div className="gift-emoji">🎁</div>
          <span className="section-kicker">CHAPTER 05 · A LITTLE GIFT</span>
          <h2>One last surprise...</h2>
          <p>Something wrapped with a little extra love.</p>
          <button className="primary-btn" onClick={() => setGiftOpen(true)}>Unwrap your gift <Gift size={18}/></button>
        </div>
      </section>

      <section className="section quiz-section" id="final-challenge">
        <div className="section-heading"><span className="section-kicker">CHAPTER 06 · THE FINAL BESTIE CHALLENGE</span><h2>How well do you remember us? 🎀</h2><p>Five little questions from our memories. Get all five right to unlock one last announcement!</p></div>
        <div className="quiz-card">
          {quiz.map((item,i) => <div className="quiz-question" key={item.q}>
            <h3>{i+1}. {item.q}</h3>
            <div className="quiz-options">{item.a.map((option,j) => <button key={option} className={quizAnswers[i]===j ? "selected":""} aria-pressed={quizAnswers[i]===j} onClick={() => {setQuizAnswers({...quizAnswers,[i]:j});setQuizDone(false);}}>{option}</button>)}</div>
          </div>)}
          <button className="primary-btn" disabled={Object.keys(quizAnswers).length !== quiz.length} onClick={() => setQuizDone(true)}>Check my answers ✨</button>
          {quizDone && (score === quiz.length ? (
            <div className="quiz-result quiz-win" role="status">
              <span className="quiz-win-sparkles" aria-hidden="true">✦ ✧ ✦</span>
              <h3>Yayyy, Vaishu! You won! 🥳❤️</h3>
              <p>Unnaala mudiyatha question eh illa pola! Namma seekiram meet panna porom di! 🫂 And unakkaga oru special gift waiting... adhu enna nu ippo solla maatten. Wait pannitu iru!</p>
              <p className="signature">Love you endlessly, my bestie!<br/>— Un Mathu ❣️</p>
            </div>
          ) : (
            <div className="quiz-result" role="status">
              <p>You got {score} out of {quiz.length}. So close, bestie! 💕</p>
              <button className="outline-btn" onClick={() => {setQuizAnswers({});setQuizDone(false);}}>Try the challenge again ✨</button>
            </div>
          ))}
        </div>
      </section>

      <footer><Heart size={16} fill="currentColor"/> Made with love, from your school-time best friend. <span>Happy 23rd, Vaishnavi ❣️</span></footer>

      {letterOpen && <Modal onClose={() => setLetterOpen(false)} title={letterStage === "envelope" ? "A little secret for you 💌" : "From Grade 6 to forever ❣️"}>
        {letterStage === "envelope" ? (
          <div className="envelope-screen">
            <div className="envelope-art"><div className="envelope-body"></div><div className="envelope-flap"></div><div className="envelope-seal"><Heart size={19} fill="currentColor"/></div></div>
            <span className="envelope-hint"><LockKeyhole size={14}/> PRIVATE LETTER · ONLY FOR VAISHU</span>
            <h3>Hey Vaishu... 💗</h3>
            <p>Unakku oru chinna secret irukku di! Namma story la sila memories photos la irukku, sila memories mind la irukku... aana sollama vechurukkura sila feelings en heart la irukku.</p>
            <p>Innaiku adha unakku sollanum nu thonuchu. Ready ah? Open panni paaru...</p>
            <button className="primary-btn" onClick={() => setLetterStage("letter")}>Open my letter <Feather size={17}/></button>
          </div>
        ) : (
          <div className="letter-content">
            <p className="letter-opening">Dear Vaishu  ... ❤️</p>
            <p>Unakku innaiku 23rd birthday di! First of all, happiest birthday to my favourite person. Unakku theriyuma, namma friendship oda story enakku evlo special nu?</p>
            <p>Namma story Grade 10 la start aagala di... actually Grade 6 laye oru chinna aasai oda start aachu.</p>
            <p>J/Holy Family Convent la Grade 6 new admission ah naanum, neeum vandhom. Appo namma different classes — naan 6D, nee 6A/B. Saiva Neri class ku Nithakaran sir edukkurappo unna paappen. Appove nee oru nalla ponnu, nalla padikkira ponnu, un kooda friend aaganum, pesanum nu nenappen. Aana enakku vandhu pesa mattum thairiyame illa! 😂</p>
            <p>Yaarukku theriyum di... appo silent ah paatha andha ponnu oru naal en bestest friend aava nu!</p>
            <p>Appuram Grade 9 la namma rendu perum 9A same class. Anga konjam konjama start aana friendship, Grade 10 la vera level ku poiduchu. Namma rendu perum eppovume onna iruppom. Onna padippom, pesuvom, sirippom, chinna chinna vishayathukku kooda happy aaguvom. Andha days la enakku evlo happiness irundhuchu nu ippo thaan puriyuthu.</p>
            <p>Un amma seira milk bread toast nyabagam irukka? 😂 Adhu enakku innum favourite!</p>
            <div className="letter-divider"><Heart size={14} fill="currentColor"/><Sparkles size={14}/><Heart size={14} fill="currentColor"/></div>
            <p>Grade 11 la school vitta udane extra classes, canteen la snacks vaangi saaptutu pesurathu, mokka jokes, random conversations... andha evening moments ellame en mind la innum fresh ah irukku.</p>
            <p>Tamil miss Mahabharatham story solla sonnapo namma rendu perum evlo excited ah detailed ah sonnom! Vijay TV la paatha stories ah class la explain pannina andha moments vera level. History unit test la enakku therinja kathai ellam answer ah ezhuthitu vandhuduven. History sir unna paathu un friend nalla kathai ezhuthuva nu sonnapo evlo funny ah irundhuchu! 😂</p>
            <p>Andha Thaththai Viduthuthu lesson, Tamil literature discussions, un Drama and Theatre class, en Carnatic Music class... box subjects different ah irundhaalum, un class ku vandhu onna pesi sirichathu kooda marakka mudiyatha memory.</p>
            <p>Pavitha kooda nee funny ah kovichukirathu, Niraja kitta irundhu gossip kekkurathu... ayyo, namma school days la evlo chinna chinna stories!</p>
            <p>Appo namakku onnum theriyala di. Indha ordinary days oru naal namma life oda most precious memories aagum nu. School la daily paakkurathu, onna irukkurathu ellame eppovume ippadiye irukkum nu nenachom.</p>
            <div className="letter-divider"><Heart size={14} fill="currentColor"/><School size={15}/><Heart size={14} fill="currentColor"/></div>
            <p>2019 O/L batch... school life oda oru beautiful chapter mudinjiduchu.</p>
            <p>A/L la nee Commerce, naan Bio nu different streams. Nee prefect ah duty la nikkumpothu register irukkura place kitta vandhu pesura andha little moments kooda enakku special. Nee Commerce la 3A eduthu Island Rank 8 vanginathu enakku romba proud di! Un hard work ku kidaicha success adhu. Innum neraya achieve pannanum!</p>
            <p>Appuram school life mudinjudhu. Daily paakkurathu illa, daily pesurathum illa. University, studies, responsibilities nu rendu peroda life um busy aayiduchu. Aana namma friendship mattum anga mudiyala. Adhe paasam, adhe bond, adhe special place en heart la irukku.</p>
            <div className="letter-divider"><Heart size={14} fill="currentColor"/><Gift size={15}/><Heart size={14} fill="currentColor"/></div>
            <p>En 23rd birthday ku nee enakku 23 gifts kuduthathu enakku romba emotional ah irukku di... 🥺❤️  ovvondrayum nee yosichu select panni, un university savings la irundhu enakkaga vaangi kuduthirukka.</p>
            <p>Adhu costly ah irundhuchu ngurathukaga illa di enakku avlo special. En birthday ah ivlo beautiful ah make panna nee spend panna time, effort, love and thoughtfulness... adha nenacha innum emotional aagiduven. Andha gifts ellam enakku just gifts illa; nee enna evlo care panra nu feel panna vecha memories.</p>
            <p>Ippo namma adikadi meet panna mudiyala. Unakku university la leave kidaikkurathum easy illa. Aana time kidaikkumpothu meet pannuvom. Recent ah almost 1½ years ku apram unna meet pannapo enakku irundha happiness ah explain panna vaarthaigale illa di. Unna paathathum old school days ellam oru second la mind ku vandhuduchu.</p>
            <p>Sometimes romba feel pannuven. Andha school days ku thirumbi pogamudinja evlo nalla irukkum nu. Andha classroom, canteen, extra classes, namma sirippu... everything. I miss those days more than I can explain.</p>
            <p>But you know what? School days thirumbi varaathu. Aana andha days la kidaicha friendship innum en kooda irukku. Adhu thaan enakku romba precious.</p>
            <div className="letter-divider"><Heart size={14} fill="currentColor"/><Flower2 size={15}/><Heart size={14} fill="currentColor"/></div>
            <p>Vaishu, unakku enna alavukku naan important nu enakku theriyala. Un mind la namma friendship ku enna place nu naan guess panna virumbala. Aana en heart la nee irukkura place mattum enakku romba clear.</p>
            <p>Enakku nee en bestest friend di. Not just a school friend. Not just someone I have memories with. Nee en life oda oru beautiful part.</p>
            <p>Unakku 23rd year neraya happiness, success, peace, love and unforgettable experiences kondu varanum. Nee aasai padra ella dreams um fulfil aaganum. Un smile eppovume ippadiye irukkanum.</p>
            <p>Innum neraya years kazhiyattum, namma life evlo busy aagattum, chance kidaikkumpothellam meet panni, old memories ah pesi, pudhu memories create pannuvom.</p>
            <p><strong>Grade 6 la pesa aasai patta ponnu... Grade 10 la close friend aana ponnu... school mudinjum en heart la same place la irukkura ponnu... nee thaan di! 🥹</strong></p>
            <p>I don't know how to explain how much I love you and how grateful I am to have you in my life. I love you endlessly, Vaishu. More than these words can ever tell. ❣️</p>
            <p className="signature">With all my love,<br/><strong> Mathu ❤️</strong></p>
          </div>
        )}
      </Modal>}

      {giftOpen && <Modal onClose={() => setGiftOpen(false)} title="A little gift for you 🎀">
        <div className="gift-reveal"><div className="confetti-line" aria-hidden="true">✦ ♡ ✧ ❀ ✦ ♡ ✧</div><div className="big-heart">💝</div><h3>Unakku oru special gift, Vaishu!</h3><p>Hehe... gift box open pannitta! 😂❤️</p><p>Un 23rd birthday ku enna gift kudukkurathu nu romba yosichen di. Nee en 23rd birthday ku 23 gifts kudutha. Ovvorondrayum un love and effort oda select pannirundha.</p><div className="gift-note"><strong>Indha time unakkaga naan create pannirukkura gift...</strong><br/>Oru little digital world — namma memories, namma school days, en manasula irukkura feelings ellame unakkaga save pannirukken. 🥹💗</div><h3 className="gift-video-heading">A little video made just for you 🎥</h3>{giftVideoMissing ? <div className="video-fallback"><Heart size={30}/><p>Your edited birthday video will appear here when Mathu adds it. ♡</p></div> : <video className="video-player gift-video" controls playsInline preload="metadata" src="/media/vaishu-edited-video.mp4" onError={() => setGiftVideoMissing(true)}>Your browser does not support video playback.</video>}<p>One day namma old aanaalum, indha website open panni paathu rendu perum sirikkanum di! 😂</p><p><strong>You gave me 23 gifts. But you have given me countless beautiful memories.</strong></p><p className="signature">Happy 23rd birthday, my Vaishu! ❣️<br/>Forever your Mathu ❤️</p><PartyPopper size={30}/></div>
      </Modal>}

      {selectedPhoto && <Modal onClose={() => setSelectedPhoto(null)} title="A moment worth keeping ♡"><img className="memory-full" src={selectedPhoto} alt="A shared memory" /></Modal>}
      {videoOpen && <Modal onClose={() => setVideoOpen(false)} title="A video message for Vaishu">
        {videoMissing ? <div className="video-fallback"><Heart size={35}/><p>A special message is being saved for you. ♡</p></div> : <video className="video-player" controls playsInline src="/media/video-message.mp4" onError={() => setVideoMissing(true)}>Your browser does not support video playback.</video>}
      </Modal>}
      </>}
    </main>
  );
}

function Modal({ children, onClose, title }) {
  return <div className="modal-backdrop" onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <button className="close-btn" onClick={onClose} aria-label="Close"><X/></button>
      <div className="modal-top"><Heart fill="currentColor"/><span>{title}</span><Heart fill="currentColor"/></div>
      {children}
    </div>
  </div>;
}

export default App;
