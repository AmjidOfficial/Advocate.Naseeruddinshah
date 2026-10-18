/* ============================================================================
   CHAMBERS DATA LAYER — single source of truth
   ----------------------------------------------------------------------------
   Everything the site renders lives here. Step 1 renders ROSTER[0].
   Step 2 (multi-lawyer firm) adds entries to ROSTER and the directory page
   iterates — no page code changes required.
   ========================================================================== */

window.SITE = {

  /* ---------------------------------------------------------------- *
   *  CONTACT — verified against the chambers' visiting card          *
   * ---------------------------------------------------------------- */
  contact: {
    whatsapp: "+923339552292",                // chambers mobile — WhatsApp
    phone:    "+923339552292",                // primary call number (mobile)
    landline: "+92919211127",                 // office landline — 091 9211127
    email:    "naseeruddin143@yahoo.com",
    office:   "C-3 Rehman Plaza, Khyber Bazar, Peshawar",
    hours:    "Mon – Sat · Consultation by appointment"
  },

  status: {
    available: true,
    text: "Accepting Consultations"
  },

  socials: [
    { name: "Facebook",  url: "https://www.facebook.com/naseer.uddin.shah.asc/" },
    { name: "LinkedIn",  url: "https://pk.linkedin.com/in/naseer-uddin-shah-9787a41b5" },
    { name: "X / Twitter", url: "https://twitter.com/NaseerU23895223" }
  ],

  /* --------------------------------------------------------------- *
   *  ROSTER — Step 2 multi-lawyer expansion plugs in here.
   *  Render the lead from roster[0]; future associates append below.
   * --------------------------------------------------------------- */
  roster: [
    {
      slug: "naseer-uddin-shah",
      name: "Naseer Uddin Shah",
      role: "Lead Advocate · ASC",
      titles: [
        "Advocate Supreme Court of Pakistan",
        "Former Additional Advocate General, KP"
      ],
      active: true
    }
    /* Step 2 example:
    ,{
      slug: "associate-name",
      name: "…",
      role: "Associate Advocate · PHC",
      titles: ["…"],
      active: false
    }
    */
  ],

  /* --------------------------------------------------------------- */
  practice: [
    {
      key: "constitutional",
      title: "Constitutional & Writ Jurisdiction",
      blurb: "Fundamental rights and public-law remedies before the High Courts and the Supreme Court.",
      law: "ART. 199 · ART. 184(3) · CONSTITUTION",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5L12 3l9 5.5H3z"/><path d="M5 8.5V19M19 8.5V19M9 8.5V19M15 8.5V19"/><path d="M3 19h18"/></svg>`,
      points: [
        "Fundamental-rights petitions before the High Courts & Supreme Court",
        "Writs of mandamus, certiorari & prohibition against public bodies",
        "Federation–province and inter-departmental disputes",
        "Service & pension matters escalated to the constitutional courts"
      ]
    },
    {
      key: "criminal",
      title: "Criminal Law & Prosecution",
      blurb: "Defence and state prosecution across bails, trials, appeals and revisions.",
      law: "PPC 1860 · CRPC 1898 · QANUN-E-SHAHADAT",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7.5 2.8v5.4c0 4.9-3.2 7.9-7.5 9.8-4.3-1.9-7.5-4.9-7.5-9.8V5.8L12 3z"/><path d="M9 11.5l2 2 4-4.5"/></svg>`,
      points: [
        "Defence & bail — pre-arrest, post-arrest and post-conviction",
        "Sessions trials and appellate work before the High Court",
        "Prosecution-side counsel (former Special Public Prosecutor)",
        "White-collar, corruption and FIR-impugnment matters"
      ]
    },
    {
      key: "civil",
      title: "Civil & Property Litigation",
      blurb: "Title, possession, inheritance and contractual disputes tried to judgment.",
      law: "CPC 1908 · SPECIFIC RELIEF ACT 1877",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10.5L12 4l8 6.5V20h-5.5v-5.5h-5V20H4z"/></svg>`,
      points: [
        "Suits for declaration, possession & injunction",
        "Partition and inheritance of joint family property",
        "Specific performance of contracts & tenancy disputes",
        "Succession certificates & executorship matters"
      ]
    },
    {
      key: "administrative",
      title: "Administrative & Service Law",
      blurb: "The state-litigation craft honoured across four provincial legal offices.",
      law: "GOVT OF KP LITIGATION · SERVICE TRIBUNALS",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h8l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M15 3v4h4"/><path d="M9 12h6M9 15.5h6"/></svg>`,
      points: [
        "Writs against federal & provincial departments",
        "Recruitment, promotion & seniority disputes",
        "Departmental inquiries & disciplinary defence",
        "Pay, pension & retirement benefits"
      ]
    },
    {
      key: "revenue",
      title: "Revenue & Land Matters",
      blurb: "Khyber Pakhtunkhwa's land-revenue regime — from mutation to partition.",
      law: "LAND REVENUE ACT 1967 · RECORD-OF-RIGHTS",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M4 12h16M12 4v16"/></svg>`,
      points: [
        "Mutation & inheritance entries before revenue officers",
        "Partition proceedings & boundary disputes",
        "Eviction, tenancy & khasra disputes",
        "Land-acquisition compensation cases"
      ]
    },
    {
      key: "islamic",
      title: "Islamic Law & Family",
      blurb: "Family law and fiqh-informed counsel, grounded in formal Islamic-studies training.",
      law: "MUSLIM FAMILY LAWS ORD. 1961 · FIQH",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 12 4a6.5 6.5 0 0 0 8 10.5z"/><path d="M17.5 3.5l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6z"/></svg>`,
      points: [
        "Nikah, talaq & khula proceedings",
        "Dower, maintenance & guardianship",
        "Inheritance shares & waqf questions",
        "Fiqh-informed opinion — M.A. Islamic Studies, UoP"
      ]
    }
  ],

  /* --------------------------------------------------------------- */
  timeline: [
    {
      when: "2006",
      title: "Called to the Bar",
      desc: "LL.B with B.A., University of Peshawar — enrolled as Advocate, District & Sessions Courts, Peshawar.",
      cat: "call"
    },
    {
      when: "Early Practice",
      title: "Advocate, Peshawar High Court",
      desc: "Enrolment at the High Court, followed by appointment as State Counsel — the first state brief.",
      cat: "state"
    },
    {
      when: "State Service",
      title: "Assistant Advocate General, KP",
      desc: "Representing the Government of Khyber Pakhtunkhwa across service, revenue and writ litigation.",
      cat: "state"
    },
    {
      when: "Prosecution",
      title: "Special Public Prosecutor",
      desc: "Conducting criminal appeals and revisions on the state's behalf before the Peshawar High Court.",
      cat: "state"
    },
    {
      when: "Bar Leadership",
      title: "Vice President, Insaf Lawyers Forum — KP",
      desc: "Leading the provincial lawyers' forum; earlier Senior Vice President of the Peshawar district body.",
      cat: "bar"
    },
    {
      when: "May 2025",
      title: "Additional Advocate General, KP",
      desc: "Assumed charge as a senior law officer of the province — leading state representation before the superior judiciary.",
      cat: "state"
    },
    {
      when: "Present",
      title: "Advocate, Supreme Court of Pakistan",
      desc: "Practising at the apex court — member, Supreme Court Bar Association, with chambers at Peshawar.",
      cat: "call",
      current: true
    }
  ],

  /* --------------------------------------------------------------- */
  news: [
    {
      when: "May 2025",
      title: "Assumed charge as Additional Advocate General, KP",
      body: "\u201CAlhamdulillah assumed charge as Additional Advocate General, Khyber Pakhtunkhwa. Grateful for the honor and looking forward to serving with dedication and integrity.\u201D",
      src: "Official Facebook"
    },
    {
      when: "Today",
      title: "The Chambers, Peshawar",
      body: "Counsel, opinions and representation across the Supreme Court, Peshawar High Court and the district judiciary — consultation by appointment, in-chamber, by video or by telephone.",
      src: "Chambers"
    }
  ],

  /* --------------------------------------------------------------- */
  gallery: [
    {
      src: "assets/img/gallery/scbap-lounge.jpg",
      w: 1080, h: 1920, tall: true,
      caption: "Supreme Court Bar Association of Pakistan — Islamabad",
      alt: "Naseer Uddin Shah seated in the members' lounge of the Supreme Court Bar Association of Pakistan"
    },
    {
      src: "assets/img/gallery/kp-judicial-academy.jpg",
      w: 720, h: 480,
      caption: "KP Judicial Academy — training for Law Officers of the Advocate General's Office, 19 February 2022",
      alt: "Group photograph of the KP Judicial Academy one-day training for Law Officers of the Office of Advocate General, Khyber Pakhtunkhwa, 19 February 2022"
    },
    {
      src: "assets/img/gallery/chambers-office.jpg",
      w: 752, h: 1392, tall: true,
      caption: "Chambers — Khyber Bazar, Peshawar",
      alt: "Naseer Uddin Shah at his chamber desk between the Pakistan and Khyber Pakhtunkhwa flags"
    },
    {
      src: "assets/img/gallery/document-handover.jpg",
      w: 950, h: 1099,
      caption: "Document handover with colleagues",
      alt: "Naseer Uddin Shah handing a document to a fellow advocate in a wood-panelled bar room"
    },
    {
      src: "assets/img/gallery/standing-portrait.jpg",
      w: 1080, h: 1866, tall: true,
      caption: "The Advocate",
      alt: "Standing portrait of Naseer Uddin Shah in a dark blazer, hands clasped"
    },
    {
      src: "assets/img/gallery/certificate-ceremony.jpg",
      w: 1040, h: 780,
      caption: "Certificate-awarding ceremony",
      alt: "Naseer Uddin Shah receiving a certificate at an outdoor ceremony"
    }
  ],

  /* --------------------------------------------------------------- */
  faq: [
    {
      q: "Which courts does Naseer Uddin Shah appear in?",
      a: "He appears before the Supreme Court of Pakistan, the Peshawar High Court — principal seat and its benches — and the District & Sessions Courts, Peshawar, covering the full appellate ladder from trial to apex jurisdiction."
    },
    {
      q: "Where are consultations held?",
      a: "Consultations take place at the chambers in Peshawar. For clients elsewhere in Pakistan or abroad, secure video-conference and telephone consultations are arranged with the same confidentiality."
    },
    {
      q: "How do I book a consultation?",
      a: "Open the Consultation Desk on this page: choose the nature of your matter, the mode of consultation, and a preferred time — your request reaches the chambers instantly over WhatsApp. Urgent matters are prioritised."
    },
    {
      q: "What are the consultation fees?",
      a: "Fees are confirmed at the time of booking and vary with the nature and urgency of the matter. A first enquiry creates no obligation and is treated in strict confidence."
    },
    {
      q: "Which areas of law does the chambers handle?",
      a: "Constitutional and writ jurisdiction; criminal law and prosecution; civil and property litigation; administrative and service law; revenue and land matters; and Islamic law and family matters — with economics and Islamic-studies training informing commercial and fiqh questions."
    }
  ],

  /* --------------------------------------------------------------- */
  booking: {
    matters: [
      "Constitutional / Writ",
      "Criminal Defence or Appeal",
      "Civil / Property",
      "Service / Government",
      "Revenue / Land",
      "Family / Islamic Law",
      "Other / Not sure yet"
    ],
    modes: [
      { key: "chamber", title: "In-Chamber · Peshawar", sub: "Office chamber, by appointment" },
      { key: "video",   title: "Secure Video Conference", sub: "Meeting link shared on confirmation" },
      { key: "phone",   title: "Urgent Telephone Call", sub: "Subject to the court schedule" }
    ]
  },

  whatsappGreeting: "Assalam-o-Alaikum. I would like to consult Advocate Naseer Uddin Shah regarding a legal matter."
};
