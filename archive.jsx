/* global React, ReactDOM, COURSE_DATA */
const { useState, useEffect, useRef } = React;

// ---------- Utilities ----------

// Deterministic tiny hash → 0..1 for stable pseudo-random placements
const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
};

// Grainy gray photo placeholder — SVG with fractal noise
const GrainBox = ({ seed = "x", className = "", style = {}, tint = 0 }) => {
  const h = hash(seed);
  // vary the base gray so the grid doesn't look uniform
  const base = 170 + Math.floor(h * 50); // 170–220
  const dark = base - 30;
  return (
    <div className={"grain-box " + className} style={{ ...style, background: `linear-gradient(${Math.floor(h*360)}deg, rgb(${base},${base-4},${base-8}) 0%, rgb(${dark},${dark-4},${dark-10}) 100%)` }}>
      <svg className="grain-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <filter id={"n-"+seed.replace(/\W/g,"")}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" seed={Math.floor(h*100)}/>
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"/>
        </filter>
        <rect width="100%" height="100%" filter={`url(#n-${seed.replace(/\W/g,"")})`}/>
      </svg>
      {/* faint date stamp in corner, rotated */}
      <div className="grain-stamp">
        {String(Math.floor(h*28)+1).padStart(2,"0")}·{String(Math.floor(h*12)+1).padStart(2,"0")}·26
      </div>
    </div>
  );
};

// Circular photo for student — smaller grain + initials
const Portrait = ({ name }) => {
  const h = hash(name);
  const initials = name.split(" ").map(w=>w[0]).slice(0,2).join("");
  const base = 180 + Math.floor(h * 50);
  return (
    <div className="portrait" style={{ background: `rgb(${base},${base-5},${base-12})` }}>
      <svg className="grain-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <filter id={"np-"+name.replace(/\W/g,"")}>
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed={Math.floor(h*100)}/>
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0"/>
        </filter>
        <rect width="100%" height="100%" filter={`url(#np-${name.replace(/\W/g,"")})`}/>
      </svg>
      <span className="portrait-initials">{initials}</span>
    </div>
  );
};

// ---------- Nav ----------

const Nav = ({ active }) => {
  const items = [
    { id: "about", num: "I", label: "About" },
    { id: "projects", num: "II", label: "Projects" },
    { id: "gallery", num: "III", label: "Gallery" },
    { id: "appendix", num: "IV", label: "Appendix" },
  ];
  return (
    <nav className="site-nav">
      <div className="site-nav-inner">
        <a href="#top" className="site-nav-mark">
          <span className="mark-stamp">ENGRD</span>
          <span className="mark-num">328W</span>
        </a>
        <ul className="site-nav-list">
          {items.map(it => (
            <li key={it.id}>
              <a href={"#"+it.id} className={active===it.id ? "active" : ""}>
                <span className="nav-num">{it.num}</span>
                <span className="nav-label">{it.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="site-nav-meta">
          <span>Spring 2026</span>
          <span className="dot">·</span>
          <span>Emory</span>
        </div>
      </div>
    </nav>
  );
};

// ---------- Hero / masthead ----------

const Masthead = () => (
  <header id="top" className="masthead">
    <div className="mast-topline">
      <span>Vol. 1, No. 1</span>
      <span className="mast-rule" />
      <span>A Student Archive</span>
      <span className="mast-rule" />
      <span>Emory University</span>
    </div>
    <h1 className="mast-title">
      <span className="mast-title-line">Archiving</span>
      <span className="mast-title-line mast-title-serif">Atlanta</span>
    </h1>
    <div className="mast-subtitle">
      <span>Race,</span>
      <span className="amp">&amp;</span>
      <span>Gender,</span>
      <span className="amp">&amp;</span>
      <span>Media Making</span>
    </div>
    <div className="mast-byline">
      <div>
        <div className="mast-byline-label">Curated by</div>
        <div className="mast-byline-value">The students of ENGRD 328W</div>
      </div>
      <div>
        <div className="mast-byline-label">With</div>
        <div className="mast-byline-value">Prof. Suchi Dutta</div>
      </div>
      <div>
        <div className="mast-byline-label">Filed</div>
        <div className="mast-byline-value">April 2026 · Atlanta, GA</div>
      </div>
    </div>
    <div className="mast-stamp" aria-hidden="true">
      <div className="stamp-ring">
        <div className="stamp-inner">
          <span>CATALOGED</span>
          <strong>26</strong>
          <span>ATL · EMORY</span>
        </div>
      </div>
    </div>
  </header>
);

// ---------- About ----------

const About = () => {
  const s = COURSE_DATA.students;
  return (
    <section id="about" className="sec sec-about">
      <SectionHead num="I" kicker="The Contributors" title="About the archive" />

      <div className="about-grid">
        <div className="about-intro">
          <p className="drop-cap">{COURSE_DATA.intro}</p>
          <div className="about-note">
            <span className="note-clip">¶</span>
            <em>A note on method.</em> Every photograph, essay, and citation here was made or gathered by a student. Gray frames are placeholders — the final archive will populate on publication.
          </div>
        </div>

        <aside className="about-meta">
          <dl>
            <div><dt>Course</dt><dd>ENGRD 328W</dd></div>
            <div><dt>Term</dt><dd>Spring 2026</dd></div>
            <div><dt>Meets</dt><dd>T/Th 11:30 – 12:45</dd></div>
            <div><dt>Room</dt><dd>Candler Library 124</dd></div>
            <div><dt>Contributors</dt><dd>{s.length}</dd></div>
            <div><dt>Artifacts</dt><dd>{COURSE_DATA.papers.length + COURSE_DATA.gallery.length}</dd></div>
          </dl>
        </aside>
      </div>

      <div className="roster-head">
        <h3 className="roster-title">The Roster</h3>
        <span className="roster-rule" />
        <span className="roster-count">{s.length} contributors</span>
      </div>

      <ul className="roster">
        {s.map((st, i) => (
          <li key={st.name} className="roster-card" style={{"--tilt": ((hash(st.name)-0.5)*1.2).toFixed(2)+"deg"}}>
            <div className="roster-idx">{String(i+1).padStart(2,"0")}</div>
            <Portrait name={st.name} />
            <div className="roster-name">{st.name}</div>
            <div className="roster-role">{st.role}</div>
            <div className="roster-bio">{st.bio}</div>
          </li>
        ))}
      </ul>
    </section>
  );
};

// ---------- Section Head (shared) ----------

const SectionHead = ({ num, kicker, title, rightNote }) => (
  <div className="sec-head">
    <div className="sec-head-left">
      <span className="sec-num">§ {num}</span>
      <span className="sec-kicker">{kicker}</span>
    </div>
    <h2 className="sec-title">{title}</h2>
    {rightNote && <div className="sec-head-right">{rightNote}</div>}
  </div>
);

// ---------- Projects ----------

const Projects = ({ onOpen }) => {
  const [filter, setFilter] = useState("All");
  const papers = COURSE_DATA.papers;
  const tags = ["All", ...Array.from(new Set(papers.map(p=>p.tag)))];
  const shown = filter==="All" ? papers : papers.filter(p=>p.tag===filter);

  return (
    <section id="projects" className="sec sec-projects">
      <SectionHead
        num="II"
        kicker="The Papers"
        title="Final Projects"
        rightNote={<span>{papers.length} essays · {tags.length-1} genres</span>}
      />

      <div className="tag-row">
        {tags.map(t => (
          <button
            key={t}
            className={"tag " + (filter===t?"tag-on":"")}
            onClick={()=>setFilter(t)}
          >
            {t}
            {filter===t && <span className="tag-dot" />}
          </button>
        ))}
      </div>

      <ol className="papers">
        {shown.map((p, i) => {
          const realIdx = papers.indexOf(p);
          return (
            <li key={p.title} className="paper" onClick={()=>onOpen(p)}>
              <div className="paper-idx">№ {String(realIdx+1).padStart(2,"0")}</div>
              <div className="paper-tag">{p.tag}</div>
              <h3 className="paper-title">{p.title}</h3>
              <div className="paper-author">by {p.author}</div>
              <p className="paper-excerpt">{p.excerpt}</p>
              <div className="paper-read">
                Read abstract <span className="paper-arrow">→</span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

const PaperModal = ({ paper, onClose }) => {
  useEffect(() => {
    if (!paper) return;
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [paper]);

  if (!paper) return null;
  return (
    <div className="modal-scrim" onClick={onClose}>
      <article className="modal" onClick={e=>e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          Close <span>×</span>
        </button>
        <div className="modal-tag">{paper.tag}</div>
        <h3 className="modal-title">{paper.title}</h3>
        <div className="modal-author">by {paper.author}</div>
        <div className="modal-rule" />
        <div className="modal-abstract-label">Abstract</div>
        <p className="modal-abstract">{paper.abstract}</p>
        <div className="modal-foot">
          <span>ENGRD 328W · Spring 2026</span>
          <span>Final draft · filed 04·08·26</span>
        </div>
      </article>
    </div>
  );
};

// ---------- Gallery ----------

const Gallery = () => {
  const items = COURSE_DATA.gallery;
  return (
    <section id="gallery" className="sec sec-gallery">
      <SectionHead
        num="III"
        kicker="The Photographs"
        title="A Gallery of Atlanta"
        rightNote={<span>{items.length} frames · shot on foot</span>}
      />

      <div className="gal-lead">
        <em>
          Each image is a placeholder. Captions name the location and the student who made the photograph. The final grid will drop in on publication.
        </em>
      </div>

      <div className="masonry">
        {items.map((g, i) => (
          <figure key={i} className={"m-item " + (g.span==="wide"?"m-wide": g.span==="tall"?"m-tall":"")}>
            <GrainBox seed={g.loc + g.by + i} />
            <figcaption>
              <span className="m-num">{String(i+1).padStart(3,"0")}</span>
              <span className="m-loc">{g.loc}</span>
              <span className="m-by">photograph by <em>{g.by}</em></span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

// ---------- Appendix ----------

const Appendix = () => {
  const c = COURSE_DATA.citations;
  return (
    <section id="appendix" className="sec sec-appendix">
      <SectionHead
        num="IV"
        kicker="The References"
        title="Appendix &amp; Cited Works"
        rightNote={<span>Chicago style · {c.length} entries</span>}
      />

      <div className="app-meta">
        <div><span className="app-meta-k">Compiled</span><span className="app-meta-v">Apr. 2026</span></div>
        <div><span className="app-meta-k">Indexed by</span><span className="app-meta-v">P. Menon, H. Takeda</span></div>
        <div><span className="app-meta-k">Format</span><span className="app-meta-v">Chicago 17th ed.</span></div>
        <div><span className="app-meta-k">Location</span><span className="app-meta-v">Woodruff Library, 3E</span></div>
      </div>

      <ol className="cites">
        {c.map((entry, i) => (
          <li key={i} className="cite">
            <span className="cite-num">[{String(i+1).padStart(2,"0")}]</span>
            <div className="cite-body">
              <span dangerouslySetInnerHTML={{__html: entry.cite}} />
              {entry.note && <span className="cite-note"> — {entry.note}</span>}
            </div>
          </li>
        ))}
      </ol>

      <div className="colophon">
        <div className="colophon-rule" />
        <div className="colophon-body">
          <div>
            <strong>Colophon.</strong> Set in the typefaces chosen by the cohort. Running heads in the project accent. Bodies
            set ragged-right. Printed on ivory stock; screened in pixels. All placeholder content herein is the work of a
            language model, to be replaced with student work at publication.
          </div>
          <div className="colophon-end">※ end of record ※</div>
        </div>
      </div>
    </section>
  );
};

// ---------- Reading progress dot ----------

const ProgressDot = ({ active, setActive }) => {
  useEffect(() => {
    const ids = ["about","projects","gallery","appendix"];
    const onScroll = () => {
      const y = window.scrollY + 180;
      let cur = "about";
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      });
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h>0 ? window.scrollY/h : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="progress-dot" title="Reading progress">
      <svg viewBox="0 0 40 40" width="40" height="40">
        <circle cx="20" cy="20" r="17" fill="none" stroke="var(--rule)" strokeWidth="1.5"/>
        <circle cx="20" cy="20" r="17" fill="none" stroke="var(--accent)" strokeWidth="1.5"
          strokeDasharray={2*Math.PI*17}
          strokeDashoffset={2*Math.PI*17*(1-pct)}
          transform="rotate(-90 20 20)"
          style={{transition:"stroke-dashoffset .2s"}}
        />
        <text x="20" y="23" textAnchor="middle" fontSize="10" fontFamily="var(--serif)" fill="var(--ink)">
          {active==="about"?"I":active==="projects"?"II":active==="gallery"?"III":"IV"}
        </text>
      </svg>
    </div>
  );
};

// ---------- Tweaks ----------

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#8a2b1f",
  "serif": "Cormorant Garamond",
  "dark": false
}/*EDITMODE-END*/;

const SERIF_OPTIONS = ["Cormorant Garamond", "Playfair Display", "EB Garamond"];
const ACCENT_OPTIONS = [
  { label: "Oxblood", value: "#8a2b1f" },
  { label: "Ink", value: "#1a1a1a" },
  { label: "Rust", value: "#b04a24" },
  { label: "Moss", value: "#4a5d3a" },
  { label: "Navy", value: "#1d3557" },
];

const TweaksWrapper = () => {
  const [values, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", values.accent);
    document.documentElement.style.setProperty("--serif", `"${values.serif}", Georgia, serif`);
    document.documentElement.classList.toggle("dark", !!values.dark);
  }, [values]);

  return (
    <window.TweaksPanel title="Tweaks">
      <window.TweakSection label="Accent color" />
      <div className="tw-accent-row" style={{padding:"2px 0 6px"}}>
        {ACCENT_OPTIONS.map(o => (
          <button
            key={o.value}
            onClick={()=>setTweak("accent", o.value)}
            className={"tw-accent-sw " + (values.accent===o.value?"on":"")}
            style={{background:o.value}}
            title={o.label}
          />
        ))}
      </div>
      <window.TweakSection label="Serif headline" />
      <window.TweakRadio
        label="Family"
        value={values.serif}
        onChange={v=>setTweak("serif", v)}
        options={SERIF_OPTIONS}
      />
      <window.TweakSection label="Theme" />
      <window.TweakToggle label="Dark mode" value={values.dark} onChange={v=>setTweak("dark", v)}/>
    </window.TweaksPanel>
  );
};

// ---------- App ----------

const App = () => {
  const [active, setActive] = useState("about");
  const [openPaper, setOpenPaper] = useState(null);

  return (
    <>
      <Nav active={active} />
      <ProgressDot active={active} setActive={setActive} />
      <main className="wrap">
        <Masthead />
        <About />
        <Projects onOpen={setOpenPaper} />
        <Gallery />
        <Appendix />
        <footer className="site-foot">
          <div>ENGRD 328W · <em>Archiving Atlanta</em> · Spring 2026</div>
          <div>Prof. S. Dutta · Emory University · Candler Library 124</div>
          <div className="foot-mark">— fin —</div>
        </footer>
      </main>
      <PaperModal paper={openPaper} onClose={()=>setOpenPaper(null)} />
      <TweaksWrapper />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
