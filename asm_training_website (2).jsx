import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
//  SAFE STORAGE HELPER
//  Uses window.storage (Claude artifact API) if available,
//  falls back to localStorage, then in-memory.
// ─────────────────────────────────────────────
const memoryStore = {};
const safeStorage = {
  async get(key) {
    try {
      if (window.storage) return await window.storage.get(key);
    } catch (_) {}
    try {
      const v = localStorage.getItem(key);
      return v ? { key, value: v } : null;
    } catch (_) {}
    return memoryStore[key] ? { key, value: memoryStore[key] } : null;
  },
  async set(key, value) {
    try {
      if (window.storage) return await window.storage.set(key, value);
    } catch (_) {}
    try {
      localStorage.setItem(key, value);
      return { key, value };
    } catch (_) {}
    memoryStore[key] = value;
    return { key, value };
  },
};

// ─────────────────────────────────────────────
//  COURSE DATA  (simple English, emoji-rich)
// ─────────────────────────────────────────────
const DAYS = [
  {
    id: 1,
    title: "Day 1",
    subtitle: "Know Your Job",
    emoji: "🎯",
    color: "#E8520A",
    bg: "#FFF4EE",
    lessons: [
      {
        id: "1-1",
        title: "Who is an ASM?",
        icon: "🧑‍💼",
        content: [
          {
            type: "intro",
            text: "ASM means Area Sales Manager. You work in the field every day and help people buy or rent a home.",
          },
          {
            type: "heading",
            text: "What you do every day:",
          },
          {
            type: "list",
            items: [
              "🏠 Show properties to buyers and tenants",
              "📸 Take good photos of the property",
              "🔑 Collect and return house keys safely",
              "📞 Call buyers and sellers regularly",
              "📝 Do follow-ups — keep calling until the deal is done",
              "🤝 Talk between owner and buyer — help them agree on price",
            ],
          },
          {
            type: "heading",
            text: "How your work is measured:",
          },
          {
            type: "cards",
            items: [
              { icon: "✅", label: "Closures", desc: "How many deals you close" },
              { icon: "📍", label: "Visits", desc: "How many properties you show" },
              { icon: "💰", label: "Revenue", desc: "Money earned by NoBroker" },
            ],
          },
          {
            type: "alert",
            icon: "⚠️",
            text: "Your phone location is tracked. This makes sure you are really in the field every day.",
          },
        ],
      },
      {
        id: "1-2",
        title: "How to Look Professional",
        icon: "👔",
        content: [
          {
            type: "intro",
            text: "C.L.E.A.N is how you should look and behave every single day. First impression matters a lot!",
          },
          {
            type: "framework",
            title: "C.L.E.A.N Framework",
            items: [
              {
                letter: "C",
                word: "Clothing",
                color: "#E8520A",
                dos: ["Wear formal shirt — ironed, full sleeves, tucked in", "Wear formal pants with a belt", "Wear formal shoes with socks above ankle", "Carry company bag and ID card"],
                donts: ["No T-shirts, no hoodies, no jeans", "No sports shoes or crocs", "No short socks, no missing belt"],
              },
              {
                letter: "L",
                word: "Looks",
                color: "#2563EB",
                dos: ["Keep hair neatly combed and trimmed", "Keep beard clean — trimmed or shaved", "Brush teeth, take shower, smell good, trim nails"],
                donts: ["No overgrown beard", "No dirty or untidy appearance"],
              },
              {
                letter: "E",
                word: "Etiquettes",
                color: "#16A34A",
                dos: ["Walk BESIDE the buyer — not ahead, not behind", "Smile, shake hands, maintain eye contact", "Stand straight — show confidence"],
                donts: ["Don't keep hands in pockets", "Don't play with keys", "Don't look bored or distracted"],
              },
              {
                letter: "A",
                word: "Awareness",
                color: "#9333EA",
                dos: ["Listen carefully to the buyer", "Talk at the buyer's speed — not too fast", "Let the buyer ask questions freely"],
                donts: ["Don't rush the visit", "Don't stay silent", "Don't ignore what buyer says"],
              },
              {
                letter: "N",
                word: "No Distractions",
                color: "#DC2626",
                dos: ["Stay fully focused on the buyer during the visit"],
                donts: ["No phone use during visit", "No chewing gum", "No rude or harsh tone", "No frowning when buyer asks questions"],
              },
            ],
          },
        ],
      },
      {
        id: "1-3",
        title: "Know About Properties",
        icon: "🏢",
        content: [
          {
            type: "intro",
            text: "You must know all about properties. Buyers will ask you many questions — you should have the answers!",
          },
          {
            type: "heading",
            text: "Types of Furnishing:",
          },
          {
            type: "cards",
            items: [
              { icon: "🛋️", label: "Fully Furnished", desc: "Has ALL furniture and appliances. Ready to live in. Costs more." },
              { icon: "🪑", label: "Semi-Furnished", desc: "Has basic items like wardrobe and kitchen. Buyer adds their own furniture." },
              { icon: "🏠", label: "Unfurnished", desc: "Empty house. No furniture at all. Lowest rent. Buyer brings everything." },
            ],
          },
          {
            type: "heading",
            text: "Understanding Property Size:",
          },
          {
            type: "area-diagram",
            items: [
              { name: "Super Built-up Area", size: "Biggest", color: "#FEE2E2", border: "#DC2626", desc: "Used for selling. Includes everything — lifts, stairs, lobby." },
              { name: "Built-up Area", size: "Medium", color: "#FEF3C7", border: "#D97706", desc: "Flat + walls + balcony. No common areas." },
              { name: "Carpet Area", size: "Smallest", color: "#DCFCE7", border: "#16A34A", desc: "Actual floor space inside the flat. Where you walk." },
            ],
          },
          {
            type: "formula",
            title: "💡 Simple Formula",
            text: "Super Built-up = 1000 sqft\n→ Built-up = 900 sqft (−10%)\n→ Carpet Area = 720 sqft (−20%)",
          },
          {
            type: "heading",
            text: "House Facing Direction:",
          },
          {
            type: "list",
            items: [
              "🌅 East Facing — Morning sunlight. Good for warm climates.",
              "🌤️ North Facing — Soft light all day. Very popular.",
              "🌇 West Facing — Evening sunlight. Warm interiors.",
              "☀️ South Facing — Sunlight all day. Good in cold areas.",
            ],
          },
          {
            type: "formula",
            title: "💰 Property Value Formula",
            text: "Property Value = Price per Sq.ft × Total Sq.ft\n\nExample: ₹5,000 × 1,200 sqft = ₹60,00,000\n(That is 60 Lakhs!)",
          },
        ],
      },
      {
        id: "1-4",
        title: "Know the Society",
        icon: "🏘️",
        content: [
          {
            type: "intro",
            text: "A society is a group of buildings where many families live together. You must know every society you work in very well.",
          },
          {
            type: "heading",
            text: "Things to know about a society:",
          },
          {
            type: "list",
            items: [
              "🏗️ How many towers and floors are there",
              "🛗 How many lifts are in each tower",
              "🏊 What amenities — pool, gym, clubhouse, park",
              "🚗 Parking rules — bike and car",
              "💧 Water supply — daily or by tanker",
              "⚡ Power backup — generator available or not",
              "🔒 Security — 24/7 or part-time",
            ],
          },
          {
            type: "heading",
            text: "Floor Charges (High-Rise):",
          },
          {
            type: "cards",
            items: [
              { icon: "🏠", label: "Ground to 5th Floor", desc: "No extra charge. Most affordable." },
              { icon: "🏢", label: "6th to 25th Floor", desc: "High-rise charge applies. Example: ₹250 per sqft extra." },
              { icon: "🔭", label: "Top Floors", desc: "Highest price — best views. But heat and seepage risk." },
            ],
          },
          {
            type: "alert",
            icon: "📌",
            text: "Always carry printed floor plans and master plans for your assigned societies. Show them to buyers during visits.",
          },
          {
            type: "heading",
            text: "NoBroker Cities:",
          },
          {
            type: "cities",
            items: ["🏙️ Bangalore", "🌆 Mumbai", "🌇 Pune", "🌃 Chennai", "🏙️ Hyderabad", "🌉 Delhi NCR"],
          },
        ],
      },
    ],
    quiz: {
      passMark: 3,
      questions: [
        {
          q: "What does ASM stand for?",
          options: ["Area Sales Manager", "Assistant Sales Member", "Area Service Manager", "Active Sales Monitor"],
          answer: 0,
        },
        {
          q: "Which type of property has NO furniture at all?",
          options: ["Semi-Furnished", "Fully Furnished", "Unfurnished", "Partly Furnished"],
          answer: 2,
        },
        {
          q: "Carpet Area is the ___ area measurement.",
          options: ["Biggest", "Smallest", "Same as Built-up", "Same as Super Built-up"],
          answer: 1,
        },
        {
          q: "Which house direction gets the MORNING sunlight?",
          options: ["West", "North", "South", "East"],
          answer: 3,
        },
        {
          q: "In the C.L.E.A.N framework, 'N' stands for:",
          options: ["Neat Appearance", "No Distractions", "Nice Behavior", "New Attitude"],
          answer: 1,
        },
        {
          q: "Property Value = Price per Sq.ft × ___",
          options: ["Number of rooms", "Floor number", "Total Sq.ft area", "Number of buyers"],
          answer: 2,
        },
      ],
    },
  },
  {
    id: 2,
    title: "Day 2",
    subtitle: "NoBroker Plans",
    emoji: "📋",
    color: "#2563EB",
    bg: "#EFF6FF",
    lessons: [
      {
        id: "2-1",
        title: "Seller Plans — What We Offer",
        icon: "💼",
        content: [
          {
            type: "intro",
            text: "NoBroker offers paid plans to sellers (property owners). You must know each plan well so you can explain them to sellers.",
          },
          {
            type: "heading",
            text: "4 Main Seller Plans:",
          },
          {
            type: "plan-cards",
            items: [
              {
                name: "Relax",
                price: "₹7,499 + 18% GST",
                color: "#DBEAFE",
                border: "#2563EB",
                features: ["Top slot listing", "Relationship Manager (RM)", "Property promotion", "Phone number privacy"],
                refund: "❌ No refund",
              },
              {
                name: "Super Relax",
                price: "₹13,499 + 18% GST",
                color: "#EDE9FE",
                border: "#7C3AED",
                features: ["Everything in Relax", "ASM assigned", "Photo shoot of property"],
                refund: "❌ No refund",
              },
              {
                name: "Money Back",
                price: "₹7,499 + 18% GST",
                color: "#DCFCE7",
                border: "#16A34A",
                features: ["Top slot listing", "RM assigned", "If no buyer found — money refunded!"],
                refund: "✅ Refundable",
              },
              {
                name: "Super Money Back",
                price: "₹13,499 + 18% GST",
                color: "#FEF9C3",
                border: "#CA8A04",
                features: ["Everything in Money Back", "ASM assigned", "Photo shoot", "Best plan for sellers!"],
                refund: "✅ Refundable",
              },
            ],
          },
          {
            type: "alert",
            icon: "💡",
            text: "Key difference: Relax & Super Relax = No refund. Money Back & Super Money Back = Refund if no buyer found.",
          },
        ],
      },
      {
        id: "2-2",
        title: "Buyer Monetization",
        icon: "💰",
        content: [
          {
            type: "intro",
            text: "When a buyer chooses a property, NoBroker charges a service fee. This is called Buyer Monetization. Do NOT skip this — it is important revenue!",
          },
          {
            type: "heading",
            text: "What the buyer gets (end-to-end service):",
          },
          {
            type: "list",
            items: [
              "📄 MOU (agreement) signing help",
              "🏛️ SRO office and registration help",
              "🏦 Loan process support",
              "⚖️ Legal document verification",
              "📋 Property documents transfer after registration",
            ],
          },
          {
            type: "heading",
            text: "How to explain to buyer:",
          },
          {
            type: "quote",
            text: "\"Once you finalise the property, we assign a dedicated RM who takes care of everything — legal checks, loan process, registration, and paperwork. You can buy stress-free.\"",
          },
          {
            type: "heading",
            text: "Token Charges (Postpaid Plan):",
          },
          {
            type: "table",
            headers: ["Property Value", "Token Amount", "Company Revenue"],
            rows: [
              ["Up to ₹1.5 Cr", "₹2,00,000", "₹1,18,000"],
              ["₹1.5 Cr to ₹2 Cr", "₹3,00,000", "₹1,77,000"],
              ["₹2 Cr to ₹2.5 Cr", "₹4,00,000", "₹2,36,000"],
            ],
          },
        ],
      },
      {
        id: "2-3",
        title: "Important Property Documents",
        icon: "📑",
        content: [
          {
            type: "intro",
            text: "When selling or buying a property, certain documents are MUST. If documents are missing, the deal cannot happen. Learn these well!",
          },
          {
            type: "doc-cards",
            items: [
              {
                icon: "📜",
                name: "Sale Deed",
                desc: "Proof that the seller owns the property. MOST important document.",
                mandatory: true,
              },
              {
                icon: "🏗️",
                name: "Occupancy Certificate (OC)",
                desc: "Proves the building is safe to live in. Given by local authority.",
                mandatory: true,
              },
              {
                icon: "✅",
                name: "Completion Certificate (CC)",
                desc: "Proves the building is built correctly as per approved plan.",
                mandatory: true,
              },
              {
                icon: "🔍",
                name: "Encumbrance Certificate (EC)",
                desc: "Proves the property has NO loans or disputes. Clean history for 12 years.",
                mandatory: true,
              },
              {
                icon: "🧾",
                name: "Tax Paid Receipts",
                desc: "Proof that property taxes are paid. No pending dues.",
                mandatory: true,
              },
              {
                icon: "📋",
                name: "Khata Certificate (Bangalore)",
                desc: "Khata E = approved. Khata B = not approved (be careful!).",
                mandatory: false,
              },
            ],
          },
          {
            type: "alert",
            icon: "⚠️",
            text: "ALWAYS check documents before the deal. Missing or wrong documents = no refund for buyer = big problem for NoBroker!",
          },
        ],
      },
      {
        id: "2-4",
        title: "Incentives — How You Earn More",
        icon: "🏆",
        content: [
          {
            type: "intro",
            text: "Your salary is fixed. But you can earn MORE based on your performance. Work hard → earn more!",
          },
          {
            type: "heading",
            text: "OJT (New Joinees) Incentive:",
          },
          {
            type: "table",
            headers: ["Number of Closures", "Amount per Closure"],
            rows: [
              ["1 closure", "₹15,000"],
              ["2 closures", "₹20,000"],
              ["3+ closures", "₹25,000"],
            ],
          },
          {
            type: "heading",
            text: "Tenured Staff Incentive:",
          },
          {
            type: "table",
            headers: ["Revenue Generated", "Your Incentive %"],
            rows: [
              ["₹0 – ₹1 Lakh", "0%"],
              ["₹1 – ₹2 Lakhs", "10%"],
              ["₹2 – ₹4 Lakhs", "15%"],
              ["Above ₹4 Lakhs", "20%"],
            ],
          },
          {
            type: "alert",
            icon: "🌟",
            text: "More closures = More incentive! The incentive is based on TOTAL revenue, not one plan only.",
          },
        ],
      },
    ],
    quiz: {
      passMark: 3,
      questions: [
        {
          q: "Which seller plan gives money back if no buyer is found?",
          options: ["Relax Plan", "Super Relax Plan", "Money Back Plan", "Basic Plan"],
          answer: 2,
        },
        {
          q: "What is the most important document for a property sale?",
          options: ["Tax Paid Receipt", "Sale Deed", "Khata Certificate", "Electricity Bill"],
          answer: 1,
        },
        {
          q: "The Relax plan costs:",
          options: ["₹5,000 + GST", "₹7,499 + 18% GST", "₹13,499 + 18% GST", "₹10,000 + GST"],
          answer: 1,
        },
        {
          q: "Khata E in Bangalore means:",
          options: ["Property is not approved", "Property has all approvals", "Property is under construction", "Property is rented"],
          answer: 1,
        },
        {
          q: "For a new joiner, how much do you earn per closure if you close 3 deals?",
          options: ["₹10,000", "₹15,000", "₹20,000", "₹25,000"],
          answer: 3,
        },
        {
          q: "What does EC (Encumbrance Certificate) prove?",
          options: ["Building is complete", "Property has no loans or disputes", "Taxes are paid", "Flat is furnished"],
          answer: 1,
        },
      ],
    },
  },
  {
    id: 3,
    title: "Day 3",
    subtitle: "How to Do a Visit",
    emoji: "🚗",
    color: "#16A34A",
    bg: "#F0FDF4",
    lessons: [
      {
        id: "3-1",
        title: "Before the Visit",
        icon: "📋",
        content: [
          {
            type: "intro",
            text: "A good visit starts the day BEFORE. Prepare everything so the visit is smooth and professional.",
          },
          {
            type: "heading",
            text: "The day before — call the buyer:",
          },
          {
            type: "list",
            items: [
              "📞 Call the buyer to confirm the visit",
              "📅 Confirm: date, time, and location",
              "🗺️ Share clear landmark and entry point",
              "🚗 Tell parking rules (bike/car) for that society",
              "👨‍👩‍👧 Ask: who is coming? (individual/couple/family)",
            ],
          },
          {
            type: "heading",
            text: "On the day of visit — before 11 AM:",
          },
          {
            type: "list",
            items: [
              "📞 Call the buyer to reconfirm",
              "🔑 Call the key holder — confirm keys are ready",
              "🏘️ Check if the society needs a gate pass",
              "📊 Know: Price per sqft, top 3 features, top 3 amenities",
              "🗺️ Reach the property 5 minutes early",
            ],
          },
          {
            type: "heading",
            text: "When buyer does NOT pick up the phone:",
          },
          {
            type: "steps",
            items: [
              { num: "1", text: "Call the buyer at scheduled time" },
              { num: "2", text: "Wait 20–40 minutes before calling again" },
              { num: "3", text: "Try at least 3 times total" },
              { num: "4", text: "Update the FRM App — mark status!" },
            ],
          },
          {
            type: "alert",
            icon: "⚠️",
            text: "ALWAYS update the app — even if no visit happened. Missing updates = bad performance record!",
          },
        ],
      },
      {
        id: "3-2",
        title: "During the Visit — D.U.R.I.N.G",
        icon: "🏠",
        content: [
          {
            type: "intro",
            text: "Use the D.U.R.I.N.G framework during every property visit. Follow each step in order.",
          },
          {
            type: "framework",
            title: "D.U.R.I.N.G Framework",
            items: [
              {
                letter: "D",
                word: "Direct the Visit",
                color: "#E8520A",
                dos: [
                  "Meet buyer at the society ENTRY GATE",
                  "Greet everyone — shake hands, smile",
                  "Give your visiting card",
                ],
                donts: [],
              },
              {
                letter: "U",
                word: "Understand the Buyer",
                color: "#2563EB",
                dos: [
                  "Ask: Who is in your family?",
                  "Ask: Where do you work? (for commute distance)",
                  "Ask: What is your budget?",
                  "Ask: When do you want to move in?",
                ],
                donts: [],
              },
              {
                letter: "R",
                word: "Route the Society",
                color: "#16A34A",
                dos: [
                  "Walk buyer around the society first",
                  "Show: towers, lifts, parking, gym, pool, clubhouse",
                  "Tell: nearby metro, schools, hospitals",
                ],
                donts: [],
              },
              {
                letter: "I",
                word: "Inside the Property",
                color: "#9333EA",
                dos: [
                  "Open door — welcome buyer inside",
                  "Show TOP 3 features of this flat",
                  "Talk about what MATTERS to THIS buyer (children → play area, elderly → bathroom access)",
                  "Show sunlight, ventilation, balcony view",
                ],
                donts: [],
              },
              {
                letter: "N",
                word: "Note Feedback",
                color: "#DC2626",
                dos: [
                  "Ask: Do you like this property?",
                  "Listen carefully — note likes and dislikes",
                  "Use A4 paper to draw room layout if needed",
                ],
                donts: [],
              },
              {
                letter: "G",
                word: "Guide Between Properties",
                color: "#CA8A04",
                dos: [
                  "If buyer likes it → start price negotiation",
                  "If buyer wants to think → schedule revisit",
                  "If buyer dislikes → show next available property (max 3)",
                ],
                donts: [],
              },
            ],
          },
          {
            type: "alert",
            icon: "🛗",
            text: "Lift Manners: Let buyer enter lift first. Don't use phone in lift. Don't jingle keys. Stay professional always.",
          },
        ],
      },
      {
        id: "3-3",
        title: "Handle Buyer Objections",
        icon: "💬",
        content: [
          {
            type: "intro",
            text: "Buyers will always have complaints or worries. Don't be afraid! Here is what to say.",
          },
          {
            type: "objections",
            items: [
              {
                icon: "💸",
                problem: "\"Price is too high!\"",
                say: "\"This property is in a prime area with good amenities. Price matches market. I can talk to the seller about your budget. What is your best price?\"",
              },
              {
                icon: "📐",
                problem: "\"The flat is too small!\"",
                say: "\"The design is very efficient. Every room feels comfortable. Lower maintenance cost too. Great value for the size.\"",
              },
              {
                icon: "🕰️",
                problem: "\"The property is too old!\"",
                say: "\"The construction quality is very good. Price is 15–20% less than a new property. One-time investment with good features.\"",
              },
              {
                icon: "🔧",
                problem: "\"There is leakage / poor maintenance!\"",
                say: "\"These are small issues. We can discuss with seller to fix them. The location is prime and it is fully furnished — great deal overall.\"",
              },
              {
                icon: "🛣️",
                problem: "\"Road condition is bad!\"",
                say: "\"This is temporary due to rains. Government will fix it soon. But look — excellent transport nearby, great value for this price.\"",
              },
              {
                icon: "💧",
                problem: "\"Water supply is not regular!\"",
                say: "\"The property has a storage tank and tanker service. Society is working to improve this. Maintenance charge will cover water needs.\"",
              },
            ],
          },
          {
            type: "alert",
            icon: "🌟",
            text: "GOLDEN RULE: Always find a solution. Never say 'I don't know' or 'Nothing I can do'. Every problem has an answer!",
          },
        ],
      },
      {
        id: "3-4",
        title: "After the Visit — S.T.O.P",
        icon: "🎯",
        content: [
          {
            type: "intro",
            text: "After showing the property, sit with the buyer. Use the S.T.O.P framework to push for a decision.",
          },
          {
            type: "framework",
            title: "S.T.O.P Framework",
            items: [
              {
                letter: "S",
                word: "Sit and Settle",
                color: "#E8520A",
                dos: ["Find a comfortable area to sit", "Move from 'walking mode' to 'talking mode'"],
                donts: [],
              },
              {
                letter: "T",
                word: "Take Feedback",
                color: "#2563EB",
                dos: ["Ask what they liked and disliked", "Use paper to draw the layout if needed", "Listen carefully without interrupting"],
                donts: [],
              },
              {
                letter: "O",
                word: "Observe Buyer Signals",
                color: "#16A34A",
                dos: ["Repeat the best amenities of the society", "Remind them of the community lifestyle", "Watch their body language — are they interested?"],
                donts: [],
              },
              {
                letter: "P",
                word: "Plan Next Steps",
                color: "#9333EA",
                dos: [
                  "If INTERESTED → start price negotiation NOW",
                  "If NEEDS FAMILY APPROVAL → schedule video call + revisit",
                  "If DISLIKES PROPERTY → show next property in same society",
                  "If DISLIKES SOCIETY → show next society",
                ],
                donts: [],
              },
            ],
          },
          {
            type: "heading",
            text: "Cross-Pitch — Don't Let Buyer Leave Empty-Handed!",
          },
          {
            type: "steps",
            items: [
              { num: "1", text: "Open NoBroker app → use 'Cross Pitch' or 'Similar Property'" },
              { num: "2", text: "Book next visit slot BEFORE buyer leaves" },
              { num: "3", text: "If no options in app → walk buyer to nearby property on the spot" },
              { num: "4", text: "ALWAYS close through NoBroker platform — not outside!" },
            ],
          },
          {
            type: "quote",
            text: "\"Never let a client leave without a NEXT STEP.\"\nAlways confirm: next visit date, next call time, or token booking.",
          },
        ],
      },
    ],
    quiz: {
      passMark: 3,
      questions: [
        {
          q: "In the D.U.R.I.N.G framework, what does 'D' stand for?",
          options: ["Describe the flat", "Direct the Visit", "Document everything", "Drive to property"],
          answer: 1,
        },
        {
          q: "How many times should you call a buyer who doesn't answer?",
          options: ["Only once", "Twice", "At least 3 times", "5 times"],
          answer: 2,
        },
        {
          q: "In the S.T.O.P framework, 'S' means:",
          options: ["Stay outside", "Sit and Settle", "Say goodbye", "Show next property"],
          answer: 1,
        },
        {
          q: "If the buyer does NOT like the property, you should:",
          options: ["Let them leave", "Argue about the property", "Cross-pitch a similar property", "Call your manager"],
          answer: 2,
        },
        {
          q: "You should call the buyer on the day of visit before:",
          options: ["8:00 AM", "11:00 AM", "2:00 PM", "After lunch"],
          answer: 1,
        },
        {
          q: "What is the GOLDEN RULE after every visit?",
          options: [
            "Fill the report form",
            "Call the manager",
            "Never let the client leave without a next step",
            "Take a photo of the property",
          ],
          answer: 2,
        },
      ],
    },
  },
  {
    id: 4,
    title: "Day 4",
    subtitle: "Use the FRM App",
    emoji: "📱",
    color: "#7C3AED",
    bg: "#FAF5FF",
    lessons: [
      {
        id: "4-1",
        title: "FRM App — The Basics",
        icon: "📱",
        content: [
          {
            type: "intro",
            text: "The FRM (Field Relationship Manager) App is your most important work tool. Use it every single day.",
          },
          {
            type: "heading",
            text: "What the app does for you:",
          },
          {
            type: "list",
            items: [
              "👥 Shows all your customers (buyers and sellers)",
              "📅 Shows all your scheduled meetings",
              "📞 Lets you call customers directly from the app",
              "🗺️ Shows exact property location",
              "📸 Lets you upload property photos and videos",
              "📋 Shows property details — price, size, amenities",
              "📊 Tracks your visit history and performance",
            ],
          },
          {
            type: "heading",
            text: "How to log in:",
          },
          {
            type: "steps",
            items: [
              { num: "1", text: "Open the FRM App on your phone" },
              { num: "2", text: "Click 'Login with Google'" },
              { num: "3", text: "Use your NoBroker company email ID only" },
              { num: "4", text: "You are now logged in!" },
            ],
          },
          {
            type: "heading",
            text: "Meeting Slots:",
          },
          {
            type: "cards",
            items: [
              { icon: "📅", label: "Weekdays", desc: "Morning: 9 AM–12 PM\nAfternoon: 12 PM–3 PM\nEvening: 3 PM–7 PM" },
              { icon: "📅", label: "Weekends", desc: "More slots available\nHigher buyer activity\nBest time for visits" },
            ],
          },
        ],
      },
      {
        id: "4-2",
        title: "My Customers & My Meetings",
        icon: "👥",
        content: [
          {
            type: "intro",
            text: "In the app, 'My Customers' shows all your assigned sellers. 'My Meetings' shows all your buyer/tenant visits.",
          },
          {
            type: "heading",
            text: "In 'My Customers' you can see:",
          },
          {
            type: "list",
            items: [
              "🏠 Property name and location",
              "📍 Exact location on map",
              "👤 Seller/owner name and contact",
              "🔑 Key holder name — who has the key",
              "📋 Plan name and NoBroker code",
              "📝 Flat number and property details",
              "💰 Max negotiable price",
              "📊 How many buyers visited till now",
            ],
          },
          {
            type: "heading",
            text: "In 'My Meetings' you can check:",
          },
          {
            type: "cards",
            items: [
              { icon: "📅", label: "Today", desc: "Meetings scheduled for today" },
              { icon: "🔜", label: "Tomorrow", desc: "Tomorrow's meeting count" },
              { icon: "📆", label: "Future", desc: "All upcoming meetings" },
              { icon: "🔁", label: "Not Visited", desc: "Buyers who didn't come — reschedule these!" },
            ],
          },
          {
            type: "heading",
            text: "After a visit — Take Action (within 30 minutes!):",
          },
          {
            type: "list",
            items: [
              "✅ Property Shown — buyer came and saw the flat",
              "❌ Property Not Visited — buyer did not come",
              "🔄 Under Negotiation — buyer is interested, discussing price",
              "❌ Rejected — buyer saw but didn't like",
            ],
          },
          {
            type: "alert",
            icon: "⏰",
            text: "Take Action WITHIN 30 minutes of the scheduled time. Late update = problem in your checklist!",
          },
        ],
      },
      {
        id: "4-3",
        title: "Follow TAT & Notifications",
        icon: "🔔",
        content: [
          {
            type: "intro",
            text: "TAT means Turnaround Time — how fast you respond and complete tasks. Good TAT = good performance!",
          },
          {
            type: "heading",
            text: "Types of Notifications in the App:",
          },
          {
            type: "doc-cards",
            items: [
              { icon: "📞", name: "Missed Call Notification", desc: "A buyer called you. Call them back immediately!", mandatory: true },
              { icon: "🔔", name: "Follow-up Reminder", desc: "Time to call a buyer or seller you promised to call.", mandatory: true },
              { icon: "🏠", name: "Visit Reminder", desc: "Upcoming property visit — confirm with buyer!", mandatory: true },
              { icon: "📸", name: "Photoshoot Reminder", desc: "You need to take photos of a property.", mandatory: true },
              { icon: "🔑", name: "Pending Key Collection", desc: "You haven't collected keys yet. Do it now.", mandatory: true },
              { icon: "🔑", name: "Key Return Delay", desc: "You have keys but haven't returned them. Return today!", mandatory: true },
            ],
          },
          {
            type: "alert",
            icon: "🚨",
            text: "Clear ALL notifications before you log out every day. Uncleared notifications = automatic logout from the app!",
          },
          {
            type: "heading",
            text: "Visit Reminder Auto-Message (Sent 2 hours before visit):",
          },
          {
            type: "steps",
            items: [
              { num: "✅", text: "Buyer clicks 'YES I WILL COME' → Visit confirmed → Call them 1 hour before" },
              { num: "🔄", text: "Buyer clicks 'Reschedule' → ASM must reschedule the slot" },
              { num: "❌", text: "Buyer clicks 'Cancel' → Slot is freed — find another buyer" },
            ],
          },
        ],
      },
      {
        id: "4-4",
        title: "Zero Tolerance Policy (ZTP)",
        icon: "⛔",
        content: [
          {
            type: "intro",
            text: "ZTP means some actions will IMMEDIATELY lead to job termination. No warnings, no second chance.",
          },
          {
            type: "heading",
            text: "NEVER do these things:",
          },
          {
            type: "ztp",
            items: [
              { icon: "💸", rule: "No Brokerage from Customers", desc: "Never take money from buyers or sellers for yourself." },
              { icon: "🏢", rule: "Promote NoBroker Only", desc: "Never promote other companies' products or services." },
              { icon: "🤝", rule: "No Help to Brokers", desc: "Never help outside brokers in any way." },
              { icon: "📱", rule: "No Personal UPI Sharing", desc: "Never share your personal UPI or QR code with customers." },
              { icon: "🗣️", rule: "No Rude Behavior", desc: "Never be rude or abusive to anyone — customer or colleague." },
              { icon: "🏠", rule: "No Property Damage", desc: "If a key is lost, immediately report to Unit Head. Stay calm." },
              { icon: "🍺", rule: "No Alcohol at Work", desc: "Never drink alcohol during work hours." },
              { icon: "💰", rule: "No Personal Money Deals", desc: "Never make financial deals with customers." },
            ],
          },
          {
            type: "heading",
            text: "Negotiation — Power Rules:",
          },
          {
            type: "list",
            items: [
              "💪 Never reduce the price first — buyer should offer first",
              "🎯 Create urgency — 'Other buyers are also looking at this property'",
              "✅ Always exchange commitment — 'If price works, are you ready today?'",
              "🔒 Soft lock first: 'If price works, can we proceed today?'",
              "🔒 Hard lock: 'I will push for this price only if you are ready to book today'",
            ],
          },
          {
            type: "alert",
            icon: "🌟",
            text: "Remember: ASM is not just a tour guide. You are the DECISION ENABLER. You close the deal on the field — not in the office!",
          },
        ],
      },
    ],
    quiz: {
      passMark: 3,
      questions: [
        {
          q: "What does TAT stand for?",
          options: ["Total Area Tracked", "Turnaround Time", "Team Action Timer", "Total Active Tasks"],
          answer: 1,
        },
        {
          q: "You must take 'Take Action' in the app within:",
          options: ["2 hours", "1 hour", "30 minutes", "End of day"],
          answer: 2,
        },
        {
          q: "According to ZTP, what happens if you take brokerage from a customer?",
          options: ["You get a warning", "You are suspended for 1 week", "You may lose your job", "Nothing happens"],
          answer: 2,
        },
        {
          q: "How do you log in to the FRM App?",
          options: ["Use personal email", "Use NoBroker company email", "Use phone number", "No login needed"],
          answer: 1,
        },
        {
          q: "What should you do if a notification is not cleared?",
          options: ["Ignore it", "Clear it by calling the customer", "Delete the app", "Wait for tomorrow"],
          answer: 1,
        },
        {
          q: "In negotiation, which is the correct approach?",
          options: [
            "Reduce price immediately to close fast",
            "Let buyer leave and call later",
            "Create urgency and exchange commitment before reducing price",
            "Always agree to buyer's first offer",
          ],
          answer: 2,
        },
      ],
    },
  },
];

// ─────────────────────────────────────────────
//  HELPER COMPONENTS
// ─────────────────────────────────────────────

function ProgressBar({ percent, color }) {
  return (
    <div style={{ background: "#E5E7EB", borderRadius: 99, height: 8, overflow: "hidden" }}>
      <div
        style={{
          width: `${percent}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width 0.6s ease",
        }}
      />
    </div>
  );
}

function LessonContent({ content, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {content.map((block, i) => {
        if (block.type === "intro") {
          return (
            <div key={i} style={{ background: "#F9FAFB", borderLeft: `4px solid ${color}`, padding: "16px 20px", borderRadius: "0 12px 12px 0", fontSize: 17, lineHeight: 1.7, color: "#374151" }}>
              {block.text}
            </div>
          );
        }
        if (block.type === "heading") {
          return (
            <h3 key={i} style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827", letterSpacing: 0.2 }}>
              {block.text}
            </h3>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={i} style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {block.items.map((item, j) => (
                <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 15, color: "#374151", lineHeight: 1.6 }}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "cards") {
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {block.items.map((c, j) => (
                <div key={j} style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "16px 14px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 30, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5, whiteSpace: "pre-line" }}>{c.desc}</div>
                </div>
              ))}
            </div>
          );
        }
        if (block.type === "alert") {
          return (
            <div key={i} style={{ background: "#FFFBEB", border: "1.5px solid #FCD34D", borderRadius: 12, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22, minWidth: 28 }}>{block.icon}</span>
              <span style={{ fontSize: 14, color: "#78350F", lineHeight: 1.65 }}>{block.text}</span>
            </div>
          );
        }
        if (block.type === "quote") {
          return (
            <div key={i} style={{ background: `${color}15`, border: `2px solid ${color}40`, borderRadius: 12, padding: "18px 20px", fontSize: 15, fontStyle: "italic", color: "#374151", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {block.text}
            </div>
          );
        }
        if (block.type === "formula") {
          return (
            <div key={i} style={{ background: "#F0F9FF", border: "1.5px solid #BAE6FD", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#0369A1", marginBottom: 8 }}>{block.title}</div>
              <pre style={{ margin: 0, fontSize: 14, color: "#0C4A6E", fontFamily: "monospace", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{block.text}</pre>
            </div>
          );
        }
        if (block.type === "steps") {
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {block.items.map((s, j) => (
                <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ minWidth: 36, height: 36, borderRadius: 99, background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                    {s.num}
                  </div>
                  <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "10px 14px", fontSize: 14, color: "#374151", lineHeight: 1.6, flex: 1 }}>{s.text}</div>
                </div>
              ))}
            </div>
          );
        }
        if (block.type === "table") {
          return (
            <div key={i} style={{ overflowX: "auto", borderRadius: 12, border: "1.5px solid #E5E7EB" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: color }}>
                    {block.headers.map((h, j) => (
                      <th key={j} style={{ padding: "12px 16px", color: "#fff", textAlign: "left", fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, j) => (
                    <tr key={j} style={{ background: j % 2 === 0 ? "#fff" : "#F9FAFB" }}>
                      {row.map((cell, k) => (
                        <td key={k} style={{ padding: "11px 16px", color: "#374151", borderTop: "1px solid #F3F4F6" }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === "area-diagram") {
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {block.items.map((a, j) => (
                <div key={j} style={{ background: a.color, border: `2px solid ${a.border}`, borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{a.name}</div>
                    <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{a.desc}</div>
                  </div>
                  <div style={{ background: a.border, color: "#fff", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{a.size}</div>
                </div>
              ))}
            </div>
          );
        }
        if (block.type === "cities") {
          return (
            <div key={i} style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {block.items.map((c, j) => (
                <div key={j} style={{ background: color, color: "#fff", borderRadius: 99, padding: "8px 18px", fontSize: 14, fontWeight: 600 }}>{c}</div>
              ))}
            </div>
          );
        }
        if (block.type === "plan-cards") {
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
              {block.items.map((p, j) => (
                <div key={j} style={{ background: p.color, border: `2px solid ${p.border}`, borderRadius: 14, padding: "18px 16px" }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#111827", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: p.border, marginBottom: 12 }}>{p.price}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                    {p.features.map((f, k) => (
                      <div key={k} style={{ fontSize: 13, color: "#374151" }}>✓ {f}</div>
                    ))}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: p.refund.startsWith("✅") ? "#16A34A" : "#DC2626" }}>{p.refund}</div>
                </div>
              ))}
            </div>
          );
        }
        if (block.type === "doc-cards") {
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {block.items.map((d, j) => (
                <div key={j} style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 26, minWidth: 32 }}>{d.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{d.name}
                      {d.mandatory && <span style={{ marginLeft: 8, background: "#FEE2E2", color: "#DC2626", fontSize: 11, padding: "2px 8px", borderRadius: 99, fontWeight: 700 }}>MANDATORY</span>}
                    </div>
                    <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.55, marginTop: 2 }}>{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        }
        if (block.type === "ztp") {
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {block.items.map((z, j) => (
                <div key={j} style={{ background: "#FFF1F2", border: "1.5px solid #FECDD3", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{z.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#9F1239", marginBottom: 4 }}>🚫 {z.rule}</div>
                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{z.desc}</div>
                </div>
              ))}
            </div>
          );
        }
        if (block.type === "objections") {
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {block.items.map((o, j) => (
                <div key={j} style={{ border: "1.5px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ background: "#FEF3C7", padding: "12px 16px", display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 22 }}>{o.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#92400E" }}>Customer says: {o.problem}</span>
                  </div>
                  <div style={{ background: "#ECFDF5", padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 18, minWidth: 24 }}>💬</span>
                    <span style={{ fontSize: 13, color: "#065F46", lineHeight: 1.6, fontStyle: "italic" }}>You say: {o.say}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        }
        if (block.type === "framework") {
          return (
            <div key={i}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#111827", marginBottom: 14, textAlign: "center" }}>{block.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {block.items.map((f, j) => (
                  <div key={j} style={{ border: `2px solid ${f.color}`, borderRadius: 14, overflow: "hidden" }}>
                    <div style={{ background: f.color, padding: "12px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ background: "rgba(255,255,255,0.3)", color: "#fff", fontWeight: 900, fontSize: 20, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10 }}>{f.letter}</span>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{f.word}</span>
                    </div>
                    <div style={{ background: "#fff", padding: "12px 18px" }}>
                      {f.dos.length > 0 && (
                        <div>
                          {f.donts.length > 0 && <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginBottom: 6, textTransform: "uppercase" }}>✅ Do:</div>}
                          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            {f.dos.map((d, k) => (
                              <div key={k} style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>✅ {d}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      {f.donts.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", marginBottom: 6, textTransform: "uppercase" }}>❌ Don't:</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            {f.donts.map((d, k) => (
                              <div key={k} style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>❌ {d}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("dashboard"); // dashboard | day | quiz | result
  const [activeDayId, setActiveDayId] = useState(null);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [progress, setProgress] = useState({}); // { dayId: { completedLessons: [], quizScore: null, passed: bool } }
  const [quizState, setQuizState] = useState({ answers: {}, submitted: false });
  const [storageLoaded, setStorageLoaded] = useState(false);

  // Load progress from storage
  useEffect(() => {
    (async () => {
      try {
        const result = await safeStorage.get("asm_progress");
        if (result && result.value) {
          setProgress(JSON.parse(result.value));
        }
      } catch (e) {
        // No saved progress
      }
      setStorageLoaded(true);
    })();
  }, []);

  // Save progress
  const saveProgress = async (newProgress) => {
    setProgress(newProgress);
    try {
      await safeStorage.set("asm_progress", JSON.stringify(newProgress));
    } catch (e) {}
  };

  const getDay = (id) => DAYS.find((d) => d.id === id);
  const activeDay = activeDayId ? getDay(activeDayId) : null;
  const dayProgress = activeDayId ? (progress[activeDayId] || { completedLessons: [], quizScore: null, passed: false }) : null;

  const isDayUnlocked = (dayId) => {
    if (dayId === 1) return true;
    return progress[dayId - 1]?.passed === true;
  };

  const markLessonComplete = async (lessonId) => {
    const dp = progress[activeDayId] || { completedLessons: [], quizScore: null, passed: false };
    if (!dp.completedLessons.includes(lessonId)) {
      const updated = { ...progress, [activeDayId]: { ...dp, completedLessons: [...dp.completedLessons, lessonId] } };
      await saveProgress(updated);
    }
  };

  const handleStartQuiz = () => {
    setQuizState({ answers: {}, submitted: false });
    setView("quiz");
  };

  const handleQuizAnswer = (qIdx, aIdx) => {
    if (quizState.submitted) return;
    setQuizState((prev) => ({ ...prev, answers: { ...prev.answers, [qIdx]: aIdx } }));
  };

  const handleSubmitQuiz = async () => {
    const questions = activeDay.quiz.questions;
    let correct = 0;
    questions.forEach((q, i) => {
      if (quizState.answers[i] === q.answer) correct++;
    });
    const passed = correct >= activeDay.quiz.passMark;
    const dp = progress[activeDayId] || { completedLessons: [], quizScore: null, passed: false };
    const updated = { ...progress, [activeDayId]: { ...dp, quizScore: correct, passed: passed || dp.passed } };
    await saveProgress(updated);
    setQuizState((prev) => ({ ...prev, submitted: true, correct, passed }));
    setView("result");
  };

  const allLessonsDone = activeDay && dayProgress &&
    activeDay.lessons.every((l) => dayProgress.completedLessons.includes(l.id));

  // ── LOADING SCREEN (prevents code flash while storage resolves) ──
  if (!storageLoaded) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
          <div style={{ fontWeight: 700, color: "#374151", fontSize: 16 }}>Loading ASM Training…</div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──
  if (view === "dashboard") {
    const totalDays = DAYS.length;
    const passedDays = DAYS.filter((d) => progress[d.id]?.passed).length;
    const overallPercent = Math.round((passedDays / totalDays) * 100);

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea22 0%, #764ba222 100%)", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)", padding: "32px 24px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>📚</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>ASM Training</h1>
          <p style={{ margin: "6px 0 0", color: "#94A3B8", fontSize: 15 }}>Learn. Practice. Succeed.</p>

          <div style={{ marginTop: 24, background: "rgba(255,255,255,0.1)", borderRadius: 16, padding: "16px 20px", maxWidth: 340, margin: "24px auto 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#CBD5E1", fontSize: 13 }}>Overall Progress</span>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{passedDays}/{totalDays} Days Done</span>
              </div>
              <ProgressBar percent={overallPercent} color="#10B981" />
              <div style={{ color: "#10B981", fontSize: 12, marginTop: 6, textAlign: "right" }}>{overallPercent}% Complete</div>
            </div>
        </div>

        {/* Day Cards */}
        <div style={{ padding: "24px 16px 40px", maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 17, color: "#374151", fontWeight: 700 }}>Choose a Day to Start 👇</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {DAYS.map((day) => {
              const unlocked = isDayUnlocked(day.id);
              const dp = progress[day.id] || { completedLessons: [], quizScore: null, passed: false };
              const lessonsDone = dp.completedLessons.length;
              const totalLessons = day.lessons.length;
              const lessonPercent = Math.round((lessonsDone / totalLessons) * 100);

              return (
                <div
                  key={day.id}
                  onClick={() => {
                    if (!unlocked) return;
                    setActiveDayId(day.id);
                    setActiveLessonIdx(0);
                    setView("day");
                  }}
                  style={{
                    background: "#fff",
                    borderRadius: 18,
                    padding: "20px 22px",
                    border: `2px solid ${unlocked ? day.color + "40" : "#E5E7EB"}`,
                    cursor: unlocked ? "pointer" : "not-allowed",
                    opacity: unlocked ? 1 : 0.6,
                    transition: "transform 0.15s, box-shadow 0.15s",
                    boxShadow: unlocked ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
                  }}
                  onMouseEnter={(e) => { if (unlocked) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = unlocked ? "0 4px 16px rgba(0,0,0,0.08)" : "none"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 16, background: unlocked ? day.color : "#D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                      {unlocked ? day.emoji : "🔒"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <span style={{ fontWeight: 800, fontSize: 17, color: "#111827" }}>{day.title}</span>
                        {dp.passed && <span style={{ background: "#DCFCE7", color: "#16A34A", fontSize: 12, padding: "2px 10px", borderRadius: 99, fontWeight: 700 }}>✅ Passed</span>}
                        {!unlocked && <span style={{ background: "#F3F4F6", color: "#9CA3AF", fontSize: 12, padding: "2px 10px", borderRadius: 99, fontWeight: 700 }}>🔒 Locked</span>}
                      </div>
                      <div style={{ color: "#6B7280", fontSize: 14, marginBottom: 10 }}>{day.subtitle}</div>
                      {unlocked && (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ fontSize: 12, color: "#9CA3AF" }}>Lessons: {lessonsDone}/{totalLessons}</span>
                            {dp.quizScore !== null && (
                              <span style={{ fontSize: 12, color: dp.passed ? "#16A34A" : "#DC2626", fontWeight: 600 }}>
                                Quiz: {dp.quizScore}/{day.quiz.questions.length}
                              </span>
                            )}
                          </div>
                          <ProgressBar percent={lessonPercent} color={day.color} />
                        </>
                      )}
                      {!unlocked && (
                        <div style={{ fontSize: 13, color: "#9CA3AF" }}>Complete Day {day.id - 1} quiz to unlock</div>
                      )}
                    </div>
                    {unlocked && (
                      <div style={{ color: day.color, fontSize: 22, flexShrink: 0 }}>›</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {passedDays === DAYS.length && (
            <div style={{ marginTop: 24, background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: 18, padding: "28px 24px", textAlign: "center", color: "#fff" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 900 }}>Training Complete!</h2>
              <p style={{ margin: 0, opacity: 0.9, fontSize: 15 }}>Congratulations! You have finished all 4 days of ASM training. You are ready for the field!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── DAY VIEW ──
  if (view === "day" && activeDay) {
    const lesson = activeDay.lessons[activeLessonIdx];
    const dp = progress[activeDayId] || { completedLessons: [], quizScore: null, passed: false };
    const isLessonDone = dp.completedLessons.includes(lesson.id);
    const totalLessons = activeDay.lessons.length;
    const lessonsDone = dp.completedLessons.length;

    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        {/* Top Bar */}
        <div style={{ background: "#fff", borderBottom: "1.5px solid #E5E7EB", padding: "0 16px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, height: 56 }}>
            <button
              onClick={() => setView("dashboard")}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, padding: "4px 8px", borderRadius: 8, color: "#6B7280" }}
            >←</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>{activeDay.emoji} {activeDay.title}: {activeDay.subtitle}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>{lessonsDone}/{totalLessons} lessons done</div>
            </div>
            <div style={{ width: 80 }}>
              <ProgressBar percent={Math.round((lessonsDone / totalLessons) * 100)} color={activeDay.color} />
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px 100px", display: "flex", gap: 24 }}>
          {/* Sidebar (desktop) */}
          <div style={{ width: 200, flexShrink: 0, paddingTop: 20, display: "none" }} className="sidebar">
            {activeDay.lessons.map((l, i) => {
              const done = dp.completedLessons.includes(l.id);
              return (
                <div
                  key={l.id}
                  onClick={() => setActiveLessonIdx(i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 4,
                    background: i === activeLessonIdx ? activeDay.color + "20" : "transparent",
                    border: i === activeLessonIdx ? `1.5px solid ${activeDay.color}` : "1.5px solid transparent",
                  }}
                >
                  <span style={{ fontSize: 16, minWidth: 20 }}>{done ? "✅" : l.icon}</span>
                  <span style={{ fontSize: 13, color: i === activeLessonIdx ? activeDay.color : "#374151", fontWeight: i === activeLessonIdx ? 700 : 400 }}>{l.title}</span>
                </div>
              );
            })}
            {allLessonsDone && (
              <button
                onClick={handleStartQuiz}
                style={{
                  marginTop: 12, width: "100%", padding: "12px", borderRadius: 12,
                  background: activeDay.color, color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14,
                }}
              >📝 Take Quiz</button>
            )}
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, paddingTop: 20 }}>
            {/* Lesson Tabs (mobile) */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12, marginBottom: 16 }}>
              {activeDay.lessons.map((l, i) => {
                const done = dp.completedLessons.includes(l.id);
                return (
                  <button
                    key={l.id}
                    onClick={() => setActiveLessonIdx(i)}
                    style={{
                      flexShrink: 0, padding: "8px 14px", borderRadius: 99, border: "1.5px solid",
                      borderColor: i === activeLessonIdx ? activeDay.color : "#E5E7EB",
                      background: i === activeLessonIdx ? activeDay.color : "#fff",
                      color: i === activeLessonIdx ? "#fff" : "#6B7280",
                      cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    <span>{done ? "✅" : l.icon}</span>
                    <span style={{ display: "none" }}>{l.title}</span>
                    <span style={{ fontSize: 11 }}>L{i + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* Lesson Card */}
            <div style={{ background: "#fff", borderRadius: 20, padding: "24px 22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid #F3F4F6", marginBottom: 20 }}>
              {/* Lesson Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: activeDay.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, border: `2px solid ${activeDay.color}30` }}>
                  {lesson.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: activeDay.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                    Lesson {activeLessonIdx + 1} of {totalLessons}
                  </div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>{lesson.title}</h2>
                </div>
              </div>

              <LessonContent content={lesson.content} color={activeDay.color} />
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {activeLessonIdx > 0 && (
                <button
                  onClick={() => setActiveLessonIdx(activeLessonIdx - 1)}
                  style={{ flex: 1, padding: "13px 20px", borderRadius: 12, border: "1.5px solid #E5E7EB", background: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#374151" }}
                >
                  ← Previous
                </button>
              )}
              {!isLessonDone && (
                <button
                  onClick={async () => {
                    await markLessonComplete(lesson.id);
                    if (activeLessonIdx < totalLessons - 1) {
                      setActiveLessonIdx(activeLessonIdx + 1);
                    }
                  }}
                  style={{ flex: 2, padding: "13px 20px", borderRadius: 12, border: "none", background: activeDay.color, cursor: "pointer", fontWeight: 800, fontSize: 15, color: "#fff" }}
                >
                  ✅ Mark as Done {activeLessonIdx < totalLessons - 1 ? "& Next →" : ""}
                </button>
              )}
              {isLessonDone && activeLessonIdx < totalLessons - 1 && (
                <button
                  onClick={() => setActiveLessonIdx(activeLessonIdx + 1)}
                  style={{ flex: 2, padding: "13px 20px", borderRadius: 12, border: "none", background: activeDay.color, cursor: "pointer", fontWeight: 800, fontSize: 15, color: "#fff" }}
                >
                  Next Lesson →
                </button>
              )}
            </div>

            {/* Quiz CTA */}
            {allLessonsDone && (
              <div style={{ marginTop: 24, background: `${activeDay.color}15`, border: `2px solid ${activeDay.color}40`, borderRadius: 18, padding: "24px 22px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📝</div>
                <h3 style={{ margin: "0 0 6px", color: "#111827", fontSize: 18, fontWeight: 800 }}>All Lessons Complete!</h3>
                <p style={{ margin: "0 0 18px", color: "#6B7280", fontSize: 14 }}>
                  {dp.passed
                    ? `You scored ${dp.quizScore}/${activeDay.quiz.questions.length}. Day ${activeDayId} is unlocked ✅`
                    : `Take the quiz to unlock Day ${activeDayId + 1}. You need ${activeDay.quiz.passMark}/${activeDay.quiz.questions.length} to pass.`}
                </p>
                <button
                  onClick={handleStartQuiz}
                  style={{ padding: "14px 32px", borderRadius: 12, border: "none", background: activeDay.color, color: "#fff", cursor: "pointer", fontWeight: 800, fontSize: 16 }}
                >
                  {dp.passed ? "Retake Quiz 🔄" : "Start Quiz 🚀"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ VIEW ──
  if (view === "quiz" && activeDay) {
    const questions = activeDay.quiz.questions;
    const answeredCount = Object.keys(quizState.answers).length;

    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ background: activeDay.color, padding: "24px 20px 20px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <button
              onClick={() => setView("day")}
              style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", cursor: "pointer", borderRadius: 8, padding: "6px 14px", fontSize: 14, marginBottom: 16, fontWeight: 600 }}
            >← Back</button>
            <h2 style={{ margin: "0 0 4px", fontSize: 22, color: "#fff", fontWeight: 900 }}>📝 {activeDay.title} Quiz</h2>
            <p style={{ margin: "0 0 16px", color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
              Answer {questions.length} questions. You need {activeDay.quiz.passMark} correct to pass.
            </p>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 99, height: 8, overflow: "hidden" }}>
              <div style={{ width: `${(answeredCount / questions.length) * 100}%`, height: "100%", background: "#fff", borderRadius: 99, transition: "width 0.4s" }} />
            </div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 6 }}>{answeredCount}/{questions.length} answered</div>
          </div>
        </div>

        <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 40px" }}>
          {questions.map((q, i) => {
            const selected = quizState.answers[i];
            return (
              <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "22px 20px", marginBottom: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.05)", border: "1.5px solid #F3F4F6" }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "flex-start" }}>
                  <div style={{ minWidth: 34, height: 34, borderRadius: 10, background: activeDay.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <p style={{ margin: 0, fontSize: 16, color: "#111827", fontWeight: 700, lineHeight: 1.5 }}>{q.q}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {q.options.map((opt, j) => {
                    const isSelected = selected === j;
                    return (
                      <button
                        key={j}
                        onClick={() => handleQuizAnswer(i, j)}
                        style={{
                          textAlign: "left", padding: "13px 16px", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: isSelected ? 700 : 500, lineHeight: 1.5,
                          background: isSelected ? `${activeDay.color}20` : "#F9FAFB",
                          border: `2px solid ${isSelected ? activeDay.color : "#E5E7EB"}`,
                          color: isSelected ? activeDay.color : "#374151",
                          transition: "all 0.15s",
                        }}
                      >
                        <span style={{ marginRight: 10, opacity: 0.6 }}>{["A", "B", "C", "D"][j]}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <button
            onClick={handleSubmitQuiz}
            disabled={answeredCount < questions.length}
            style={{
              width: "100%", padding: "16px", borderRadius: 14, border: "none", fontWeight: 800, fontSize: 17, cursor: answeredCount < questions.length ? "not-allowed" : "pointer",
              background: answeredCount < questions.length ? "#D1D5DB" : activeDay.color,
              color: answeredCount < questions.length ? "#9CA3AF" : "#fff",
              transition: "background 0.2s",
            }}
          >
            {answeredCount < questions.length
              ? `Answer all questions (${answeredCount}/${questions.length})`
              : "Submit Quiz ✅"}
          </button>
        </div>
      </div>
    );
  }

  // ── RESULT VIEW ──
  if (view === "result" && activeDay) {
    const { correct, passed } = quizState;
    const total = activeDay.quiz.questions.length;
    const pct = Math.round((correct / total) * 100);
    const nextDay = DAYS.find((d) => d.id === activeDayId + 1);

    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 16px" }}>
          {/* Result Card */}
          <div style={{
            background: "#fff", borderRadius: 24, padding: "40px 32px", textAlign: "center",
            boxShadow: "0 8px 40px rgba(0,0,0,0.1)", border: `3px solid ${passed ? "#10B981" : "#F59E0B"}`,
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>{passed ? "🎉" : "💪"}</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 900, color: "#111827" }}>
              {passed ? "You Passed!" : "Keep Trying!"}
            </h2>
            <p style={{ margin: "0 0 28px", color: "#6B7280", fontSize: 16 }}>
              {passed
                ? `Great job! Day ${activeDayId} is now complete.`
                : `You need ${activeDay.quiz.passMark} correct answers to pass. Try again!`}
            </p>

            {/* Score Circle */}
            <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 120 120" style={{ position: "absolute", width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="52" fill="none" stroke="#F3F4F6" strokeWidth="10" />
                <circle cx="60" cy="60" r="52" fill="none" stroke={passed ? "#10B981" : "#F59E0B"} strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 52 * pct / 100} ${2 * Math.PI * 52 * (1 - pct / 100)}`} strokeLinecap="round" />
              </svg>
              <div>
                <div style={{ fontSize: 30, fontWeight: 900, color: "#111827" }}>{correct}/{total}</div>
                <div style={{ fontSize: 14, color: "#9CA3AF" }}>{pct}%</div>
              </div>
            </div>

            {/* Answer Review */}
            <div style={{ textAlign: "left", marginBottom: 28 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 12 }}>Question Review:</h3>
              {activeDay.quiz.questions.map((q, i) => {
                const userAnswer = quizState.answers[i];
                const isCorrect = userAnswer === q.answer;
                return (
                  <div key={i} style={{ background: isCorrect ? "#ECFDF5" : "#FFF1F2", borderRadius: 10, padding: "10px 14px", marginBottom: 8, border: `1.5px solid ${isCorrect ? "#BBF7D0" : "#FECDD3"}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Q{i + 1}: {q.q}</div>
                    <div style={{ fontSize: 12, color: isCorrect ? "#065F46" : "#9F1239" }}>
                      {isCorrect ? "✅ Correct!" : `❌ You chose: ${q.options[userAnswer]} | Correct: ${q.options[q.answer]}`}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {!passed && (
                <button
                  onClick={() => { setQuizState({ answers: {}, submitted: false }); setView("quiz"); }}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: activeDay.color, color: "#fff", cursor: "pointer", fontWeight: 800, fontSize: 16 }}
                >
                  🔄 Try Again
                </button>
              )}
              {passed && nextDay && (
                <button
                  onClick={() => { setActiveDayId(nextDay.id); setActiveLessonIdx(0); setView("day"); }}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: nextDay.color, color: "#fff", cursor: "pointer", fontWeight: 800, fontSize: 16 }}
                >
                  🚀 Start {nextDay.title}: {nextDay.subtitle} →
                </button>
              )}
              {passed && !nextDay && (
                <div style={{ background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: 12, padding: "16px", color: "#fff", fontWeight: 700, fontSize: 15 }}>
                  🎓 Training Complete! You are ready for the field!
                </div>
              )}
              <button
                onClick={() => setView("dashboard")}
                style={{ width: "100%", padding: "12px", borderRadius: 12, border: "1.5px solid #E5E7EB", background: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#374151" }}
              >
                🏠 Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
