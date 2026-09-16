const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canGsap = () => typeof gsap !== "undefined" && motionOk;
const LEADS = window.LEAD_CONFIG || { netlifyFormName: "medicare-leads", form123: {} };

const STEPS = ["Audience", "Market", "Targeting", "Marketing", "Quantity", "Campaign"];
const KEYS = "ABCDEFGHIJK".split("");

const AUDIENCES = [
  "Turning 65",
  "Age 65+",
  "Medicare Advantage Prospects",
  "Medicare Supplement Prospects",
  "D-SNP Prospects",
  "C-SNP Prospects",
  "LIS Related Audiences",
  "General Senior Market",
  "Other Medicare Audiences",
];

const GEO_TYPES = [
  "State",
  "County",
  "City",
  "ZIP Codes",
  "Radius Around a ZIP Code or Location",
  "Multiple Markets",
];

const RADII = ["5 Miles", "10 Miles", "15 Miles", "25 Miles", "50 Miles", "Custom"];

const INCOME = [
  "Any Income",
  "Under $50,000",
  "$50,000 to $74,999",
  "$75,000 to $99,999",
  "$100,000 to $149,999",
  "$150,000+",
];

const NET_WORTH = [
  "Any Net Worth",
  "Under $100,000",
  "$100,000 to $249,999",
  "$250,000 to $499,999",
  "$500,000+",
];

const MARITAL = ["Any", "Married", "Single"];

const HOUSEHOLD = [
  "Any Household",
  "Presence of Children",
  "No Children Present",
  "Retired Household",
];

const EXTRAS = [
  "Home Value",
  "Length of Residence",
  "Lifestyle or Interests",
  "Other Available Demographic Criteria",
];

const CHANNELS = [
  "Direct Mail",
  "Phone",
  "Email",
  "Digital Advertising",
  "Multiple Channels",
  "Not Sure Yet",
];

const QTY = [
  "Under 1,000",
  "1,000 to 5,000",
  "5,000 to 10,000",
  "10,000 to 25,000",
  "25,000+",
  "All Available Prospects",
];

const TIMING = [
  "Immediately",
  "Within 30 Days",
  "Within 60 Days",
  "Preparing for AEP",
  "Planning Ahead",
  "Just Researching",
];

const state = {
  screen: "q",
  q: 0,
  audiences: [],
  otherAudience: "",
  geoType: "",
  market: "",
  radiusOrigin: "",
  radius: "",
  anyAge: false,
  ageFrom: "",
  ageTo: "",
  dob: "",
  gender: "",
  income: [],
  homeownership: "",
  netWorth: [],
  marital: [],
  household: [],
  extras: [],
  targetingNotes: "",
  channels: [],
  quantity: "",
  timing: "",
  campaignNotes: "",
  contact: {
    first: "",
    last: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    method: "",
  },
};

const trackEl = document.getElementById("quiz-track");
const summaryEl = document.getElementById("audience-summary");
const body = document.getElementById("quiz-body");
const dock = document.getElementById("quiz-dock");
const dockBack = document.getElementById("dock-back");
const dockNext = document.getElementById("dock-next");
const dockHint = document.getElementById("dock-hint");

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function animateIn() {
  if (!canGsap()) return;
  gsap.killTweensOf(".quiz-enter");
  gsap.from(".quiz-enter", { y: 16, opacity: 0, duration: 0.35, stagger: 0.03, ease: "power2.out" });
}

function toggle(list, value) {
  const i = list.indexOf(value);
  if (i >= 0) list.splice(i, 1);
  else list.push(value);
}

function toggleExclusive(list, value, anyLabel) {
  if (value === anyLabel) {
    list.splice(0, list.length, anyLabel);
    return;
  }
  const any = list.indexOf(anyLabel);
  if (any >= 0) list.splice(any, 1);
  toggle(list, value);
}

function toggleChannel(label) {
  if (label === "Not Sure Yet") {
    state.channels = state.channels.includes(label) ? [] : ["Not Sure Yet"];
    return;
  }
  const unsure = state.channels.indexOf("Not Sure Yet");
  if (unsure >= 0) state.channels.splice(unsure, 1);
  toggle(state.channels, label);
}

function el(html) {
  const wrap = document.createElement("div");
  wrap.innerHTML = html.trim();
  return wrap.firstElementChild;
}

function progressIndex() {
  if (state.screen !== "q") return 6;
  return state.q;
}

function clip(text, max = 80) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

function audienceLabel() {
  const items = [...state.audiences];
  if (state.otherAudience.trim()) items.push(state.otherAudience.trim());
  return items.join(", ");
}

function marketLabel() {
  if (state.geoType === "Radius Around a ZIP Code or Location") {
    if (state.radiusOrigin && state.radius) return `${state.radius} of ${state.radiusOrigin}`;
    return [state.geoType, state.radiusOrigin, state.radius].filter(Boolean).join(" · ");
  }
  if (state.geoType && state.market) return `${state.geoType}: ${state.market}`;
  return state.geoType;
}

function recapPairs() {
  return [
    ["Audience", audienceLabel()],
    ["Market", marketLabel()],
    ["Target Window", state.timing],
    ["Marketing Method", state.channels.join(" + ")],
    ["Quantity", state.quantity],
  ].filter(([, value]) => String(value || "").trim());
}

function summaryItems() {
  const items = [];
  const add = (value) => {
    const text = clip(value);
    if (text) items.push(text);
  };

  add(audienceLabel());
  add(marketLabel());

  if (state.anyAge) add("Any Age");
  else if (state.ageFrom || state.ageTo) add(`Age ${state.ageFrom || "?"} to ${state.ageTo || "?"}`);
  if (state.dob) add(`Date of birth: ${state.dob}`);
  if (state.gender) add(`Gender: ${state.gender}`);
  if (state.income.length) add(`Income: ${state.income.join(", ")}`);
  if (state.homeownership) add(`Homeownership: ${state.homeownership}`);
  if (state.netWorth.length) add(`Net worth: ${state.netWorth.join(", ")}`);
  if (state.marital.length) add(`Marital status: ${state.marital.join(", ")}`);
  if (state.household.length) add(`Household: ${state.household.join(", ")}`);
  state.extras.forEach((item) => add(item));
  if (state.targetingNotes) add(`Notes: ${state.targetingNotes}`);
  if (state.channels.length) add(state.channels.join(" + "));
  add(state.quantity);
  add(state.timing);
  if (state.campaignNotes) add(`Campaign: ${state.campaignNotes}`);
  return items;
}

function renderSummary() {
  const items = summaryItems();
  summaryEl.replaceChildren();
  if (!items.length) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Tell Us Who You Want to Reach.";
    summaryEl.appendChild(empty);
    return;
  }
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    summaryEl.appendChild(li);
  });
  const card = document.getElementById("audience-card");
  if (card) card.scrollTop = card.scrollHeight;
}

function renderTrack() {
  const current = progressIndex();
  trackEl.innerHTML = STEPS.map((label, i) => {
    const cls = i === current ? "on" : i < current ? "done" : "";
    return `<button type="button" class="${cls}" data-step="${i}" ${i > current ? "disabled" : ""}>${label}</button>`;
  }).join("");
  [...trackEl.querySelectorAll("button")].forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.step);
      if (i > current) return;
      goQuestion(i);
    });
  });
}

function needsOtherAudience() {
  return state.audiences.includes("Other Medicare Audiences");
}

function canContinue() {
  if (state.q === 0) {
    if (!state.audiences.length) return false;
    if (needsOtherAudience()) return !!state.otherAudience.trim();
    return true;
  }
  if (state.q === 1) {
    if (!state.geoType) return false;
    if (state.geoType === "Radius Around a ZIP Code or Location") {
      return !!state.radiusOrigin.trim() && !!state.radius;
    }
    return !!state.market.trim();
  }
  if (state.q === 2) return true;
  if (state.q === 3) return state.channels.length > 0;
  if (state.q === 5) return !!state.timing;
  return false;
}

function updateChrome() {
  const onQuestion = state.screen === "q";
  renderTrack();
  renderSummary();
  dock.hidden = !onQuestion;
  dockBack.hidden = state.q === 0;
  if (!onQuestion) return;

  const tapAdvance = state.q === 4;
  dockNext.hidden = tapAdvance;
  dockNext.disabled = tapAdvance ? false : !canContinue();
  dockNext.textContent = state.q === 5 ? "Get My Free Market Analysis" : "Continue";

  const hints = [
    "Choose the audience you want to reach.",
    "Select your market.",
    "Add targeting if you need it.",
    "Select all that apply.",
    "Tell us the size of your campaign.",
    "Tell us when you plan to market.",
  ];
  dockHint.textContent = hints[state.q] || "";
}

function pillRow(options, isOn, onToggle) {
  const row = document.createElement("div");
  row.className = "quiz-pills quiz-enter";
  options.forEach((label) => {
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.value = label;
    b.textContent = label;
    if (isOn(label)) b.classList.add("selected");
    b.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onToggle(label);
      [...row.children].forEach((btn) => btn.classList.toggle("selected", isOn(btn.dataset.value)));
      renderSummary();
      updateChrome();
    });
    row.appendChild(b);
  });
  return row;
}

function answerBtn({ key, label, selected, check, onClick }) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = `answer quiz-enter${check ? " check" : ""}${selected ? " selected" : ""}`;
  b.innerHTML = `<kbd>${key}</kbd><span><b>${label}</b></span><i></i>`;
  b.addEventListener("click", () => onClick(b));
  return b;
}

function radioList(options, getSelected, onSelect, { check = false, advance = false } = {}) {
  const list = document.createElement("div");
  list.className = "answer-stack";
  options.forEach((label, i) => {
    list.appendChild(answerBtn({
      key: KEYS[i],
      label,
      check,
      selected: check ? getSelected().includes(label) : getSelected() === label,
      onClick: async (btn) => {
        onSelect(label, btn, list);
        updateChrome();
        if (advance) {
          await delay(220);
          goQuestion(state.q + 1);
        }
      },
    }));
  });
  return list;
}

function goQuestion(i) {
  state.screen = "q";
  state.q = i;
  render({ scroll: true, animate: true });
}

function head(kicker, title, help) {
  return el(`
    <div class="quiz-head quiz-enter">
      <p class="quiz-kicker">${kicker}</p>
      <h2>${title}</h2>
      ${help ? `<p>${help}</p>` : ""}
    </div>`);
}

function block(label, child) {
  const wrap = el(`<div class="quiz-block quiz-enter">${label ? `<p class="quiz-label">${label}</p>` : ""}</div>`);
  wrap.appendChild(child);
  return wrap;
}

function textField({ id, value, placeholder, textarea, onInput }) {
  const node = el(textarea
    ? `<textarea class="quiz-note-field quiz-enter" id="${id}" placeholder="${placeholder || ""}"></textarea>`
    : `<input class="quiz-text-field quiz-enter" id="${id}" type="text" placeholder="${placeholder || ""}" />`);
  node.value = value || "";
  node.addEventListener("input", () => onInput(node.value));
  return node;
}

function syncOtherAudience() {
  const wrap = document.getElementById("other-audience");
  if (!wrap) return;
  wrap.hidden = !needsOtherAudience();
}

function renderQ() {
  if (state.q === 0) {
    body.appendChild(head(
      "Step 1 of 6: Who Do You Want to Reach?",
      "Tell Us Who You Want to Reach.",
      "Choose the type of Medicare or senior audience you’re interested in targeting.",
    ));
    body.appendChild(radioList(
      AUDIENCES,
      () => state.audiences,
      (label, btn) => {
        toggle(state.audiences, label);
        btn.classList.toggle("selected", state.audiences.includes(label));
        syncOtherAudience();
      },
      { check: true },
    ));
    const other = el(`<div class="quiz-block quiz-enter" id="other-audience"></div>`);
    other.hidden = !needsOtherAudience();
    other.appendChild(el(`<p class="quiz-label">Describe the Medicare Audience You Want to Reach</p>`));
    other.appendChild(textField({
      id: "other-audience-field",
      value: state.otherAudience,
      placeholder: "Tell us about the audience you’re trying to reach",
      onInput: (v) => { state.otherAudience = v; updateChrome(); },
    }));
    body.appendChild(other);
  }

  if (state.q === 1) {
    body.appendChild(head(
      "Step 2 of 6: Where Do You Want to Find Prospects?",
      "Select Your Market.",
      "Enter your ZIP Codes, counties, cities, states or target radius.",
    ));
    body.appendChild(radioList(
      GEO_TYPES,
      () => state.geoType,
      (label, btn, list) => {
        state.geoType = label;
        list.querySelectorAll(".answer").forEach((a) => a.classList.remove("selected"));
        btn.classList.add("selected");
        syncGeoFields();
      },
    ));
    const fields = el(`<div class="quiz-block quiz-enter" id="geo-fields"></div>`);
    body.appendChild(fields);
    syncGeoFields();
  }

  if (state.q === 2) {
    body.appendChild(head(
      "Step 3 of 6: Build Your Audience",
      "Select the Criteria That Matter to Your Campaign.",
      "Age, date of birth, gender, income, homeownership, net worth, marital status and household information.",
    ));

    const age = el(`
      <div class="quiz-block quiz-enter">
        <p class="quiz-label">Age</p>
        <label class="quiz-check"><input type="checkbox" id="any-age" ${state.anyAge ? "checked" : ""} /> Any Age</label>
        <div class="quiz-age" id="age-fields">
          <div>
            <label for="age-from">From</label>
            <input id="age-from" type="number" min="18" max="120" inputmode="numeric" value="${state.ageFrom}" />
          </div>
          <div>
            <label for="age-to">To</label>
            <input id="age-to" type="number" min="18" max="120" inputmode="numeric" value="${state.ageTo}" />
          </div>
        </div>
      </div>`);
    const anyAge = age.querySelector("#any-age");
    const ageFields = age.querySelector("#age-fields");
    ageFields.hidden = state.anyAge;
    anyAge.addEventListener("change", () => {
      state.anyAge = anyAge.checked;
      ageFields.hidden = state.anyAge;
      updateChrome();
    });
    age.querySelector("#age-from").addEventListener("input", (e) => { state.ageFrom = e.target.value; updateChrome(); });
    age.querySelector("#age-to").addEventListener("input", (e) => { state.ageTo = e.target.value; updateChrome(); });
    body.appendChild(age);

    body.appendChild(block("Date of Birth", textField({
      id: "dob-field",
      value: state.dob,
      placeholder: "Month, year, or birth date window",
      onInput: (v) => { state.dob = v; updateChrome(); },
    })));
    body.appendChild(block("Gender", pillRow(
      ["All", "Male", "Female"],
      (label) => state.gender === label,
      (label) => { state.gender = label; },
    )));
    body.appendChild(block("Estimated Household Income", pillRow(
      INCOME,
      (label) => state.income.includes(label),
      (label) => toggleExclusive(state.income, label, "Any Income"),
    )));
    body.appendChild(block("Homeownership", pillRow(
      ["Any", "Homeowners", "Renters"],
      (label) => state.homeownership === label,
      (label) => { state.homeownership = label; },
    )));
    body.appendChild(block("Estimated Net Worth", pillRow(
      NET_WORTH,
      (label) => state.netWorth.includes(label),
      (label) => toggleExclusive(state.netWorth, label, "Any Net Worth"),
    )));
    body.appendChild(block("Marital Status", pillRow(
      MARITAL,
      (label) => state.marital.includes(label),
      (label) => toggleExclusive(state.marital, label, "Any"),
    )));
    body.appendChild(block("Household Information", pillRow(
      HOUSEHOLD,
      (label) => state.household.includes(label),
      (label) => toggleExclusive(state.household, label, "Any Household"),
    )));
    body.appendChild(block("Other Available Demographic Criteria", pillRow(
      EXTRAS,
      (label) => state.extras.includes(label),
      (label) => toggle(state.extras, label),
    )));
    body.appendChild(block("Anything Else We Should Know About This Audience?", textField({
      id: "targeting-notes",
      textarea: true,
      value: state.targetingNotes,
      placeholder: "Tell us about the audience you’re trying to reach",
      onInput: (v) => { state.targetingNotes = v; updateChrome(); },
    })));
  }

  if (state.q === 3) {
    body.appendChild(head(
      "Step 4 of 6: Tell Us How You Want to Market",
      "Choose Direct Mail, Telephone, Email, Digital or a Combination of Channels.",
      "Select all that apply.",
    ));
    body.appendChild(radioList(
      CHANNELS,
      () => state.channels,
      (label, btn) => {
        toggleChannel(label);
        [...btn.parentElement.children].forEach((item) => {
          item.classList.toggle("selected", state.channels.includes(item.querySelector("b").textContent));
        });
      },
      { check: true },
    ));
  }

  if (state.q === 4) {
    body.appendChild(head(
      "Step 5 of 6: Desired Quantity",
      "How Many Prospects Do You Need?",
      "",
    ));
    body.appendChild(radioList(
      QTY,
      () => state.quantity,
      (label, btn, list) => {
        state.quantity = label;
        list.querySelectorAll(".answer").forEach((a) => a.classList.remove("selected"));
        btn.classList.add("selected");
      },
      { advance: true },
    ));
  }

  if (state.q === 5) {
    body.appendChild(head(
      "Step 6 of 6: Tell Us About Your Campaign",
      "When Do You Plan to Market?",
      "Any additional campaign information helps us research the right options.",
    ));
    body.appendChild(radioList(
      TIMING,
      () => state.timing,
      (label, btn, list) => {
        state.timing = label;
        list.querySelectorAll(".answer").forEach((a) => a.classList.remove("selected"));
        btn.classList.add("selected");
      },
    ));
    body.appendChild(block("Any Additional Campaign Information", textField({
      id: "campaign-notes",
      textarea: true,
      value: state.campaignNotes,
      placeholder: "Products, geography, AEP plans, or anything else we should know",
      onInput: (v) => { state.campaignNotes = v; updateChrome(); },
    })));
  }
}

function syncGeoFields() {
  const wrap = document.getElementById("geo-fields");
  if (!wrap) return;
  wrap.innerHTML = "";
  const type = state.geoType;
  if (!type) {
    updateChrome();
    return;
  }
  if (type === "Radius Around a ZIP Code or Location") {
    wrap.appendChild(el(`<p class="quiz-label">Starting ZIP Code or Location</p>`));
    const origin = textField({
      id: "radius-origin",
      value: state.radiusOrigin,
      placeholder: "Starting ZIP Code or location",
      onInput: (v) => { state.radiusOrigin = v; updateChrome(); },
    });
    wrap.appendChild(origin);
    wrap.appendChild(el(`<p class="quiz-label">Radius</p>`));
    wrap.appendChild(pillRow(
      RADII,
      (label) => state.radius === label,
      (label) => { state.radius = label; },
    ));
    setTimeout(() => origin.focus(), 40);
    updateChrome();
    return;
  }
  const placeholders = {
    State: "Enter one or more states",
    County: "Enter one or more counties",
    City: "Enter one or more cities",
    "ZIP Codes": "Enter one or more ZIP Codes",
    "Multiple Markets": "Enter ZIP Codes, cities, counties or states",
  };
  wrap.appendChild(el(`<p class="quiz-label">Enter Your Target Market. You Can Add More Than One.</p>`));
  const field = textField({
    id: "market-field",
    textarea: true,
    value: state.market,
    placeholder: placeholders[type] || "Enter your target market",
    onInput: (v) => { state.market = v; updateChrome(); },
  });
  wrap.appendChild(field);
  setTimeout(() => field.focus(), 40);
  updateChrome();
}

function leadPayload() {
  const c = state.contact;
  return {
    first: c.first.trim(),
    last: c.last.trim(),
    company: c.company.trim(),
    email: c.email.trim(),
    phone: c.phone.trim(),
    website: c.website.trim(),
    contactMethod: c.method,
    audiences: audienceLabel(),
    otherAudience: state.otherAudience,
    geoType: state.geoType,
    market: state.market,
    radiusOrigin: state.radiusOrigin,
    radius: state.radius,
    ageFrom: state.ageFrom,
    ageTo: state.ageTo,
    anyAge: state.anyAge ? "Yes" : "",
    dob: state.dob,
    gender: state.gender,
    income: state.income.join(", "),
    homeownership: state.homeownership,
    netWorth: state.netWorth.join(", "),
    marital: state.marital.join(", "),
    household: state.household.join(", "),
    extras: state.extras.join(", "),
    targetingNotes: state.targetingNotes,
    channel: state.channels.join(", "),
    quantity: state.quantity,
    campaignNotes: state.campaignNotes,
    timing: state.timing,
    summary: recapPairs().map(([label, value]) => `${label}: ${value}`).join(" | "),
  };
}

async function submitNetlify(payload) {
  const name = LEADS.netlifyFormName || "medicare-leads";
  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ "form-name": name, ...payload }),
  });
  if (!res.ok) throw new Error(`Netlify form ${res.status}`);
}

function submit123(payload) {
  const cfg = LEADS.form123 || {};
  const controls = cfg.controls || {};
  if (!cfg.id || !Object.values(controls).some(Boolean)) return;
  const form = document.createElement("form");
  form.method = "POST";
  form.action = cfg.action || "https://form.123formbuilder.com/sf.php";
  form.target = "form123-frame";
  form.hidden = true;
  const fields = {
    s: cfg.sParam || `123formbuilder-${cfg.id}`,
    formIsSubmitted: "1",
  };
  Object.entries(controls).forEach(([key, controlName]) => {
    if (controlName) fields[controlName] = payload[key] ?? "";
  });
  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = String(value);
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
  setTimeout(() => form.remove(), 2500);
}

function renderUnlock() {
  body.innerHTML = `
    <div class="unlock quiz-enter">
      <p class="quiz-kicker">Your Medicare Prospect Search</p>
      <h2>Get My Free Market Analysis</h2>
      <p>Submit your contact information to receive a complimentary Medicare Market Analysis with available counts and targeting options.</p>
      <form class="unlock-form" id="unlock-form">
        <div class="row-2">
          <input required name="first" placeholder="First Name*" autocomplete="given-name" />
          <input required name="last" placeholder="Last Name*" autocomplete="family-name" />
        </div>
        <input required name="company" placeholder="Agency / Company*" autocomplete="organization" />
        <input required type="email" name="email" placeholder="Email*" autocomplete="email" />
        <input required type="tel" name="phone" placeholder="Phone*" autocomplete="tel" />
        <input name="website" placeholder="Website" autocomplete="url" />
        <p class="quiz-label">Preferred Contact Method</p>
        <div class="quiz-pills" id="method-pills">
          <button type="button" data-value="Email">Email</button>
          <button type="button" data-value="Phone">Phone</button>
          <button type="button" data-value="Either">Either</button>
        </div>
        <button class="btn btn-primary btn-lg" type="submit">Get My Free Market Analysis</button>
        <p class="form-note">No obligation. No list purchase required.</p>
        <p class="form-note">By submitting, you agree that AmeriList may contact you about this request. See our <a href="https://www.amerilist.com/privacypolicy" target="_blank" rel="noopener">Privacy Policy</a>.</p>
      </form>
    </div>`;
  const form = document.getElementById("unlock-form");
  [...form.querySelectorAll("input")].forEach((input) => {
    input.value = state.contact[input.name] || "";
    input.addEventListener("input", () => { state.contact[input.name] = input.value; });
  });
  const pills = document.getElementById("method-pills");
  [...pills.children].forEach((btn) => {
    if (btn.dataset.value === state.contact.method) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      state.contact.method = btn.dataset.value;
      [...pills.children].forEach((b) => b.classList.toggle("selected", b === btn));
    });
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Sending…";
    const payload = leadPayload();
    try {
      await Promise.allSettled([
        submitNetlify(payload),
        Promise.resolve(submit123(payload)),
      ]);
    } finally {
      state.screen = "thanks";
      render({ scroll: true, animate: true });
    }
  });
}

function renderThanks() {
  const wrap = el(`
    <div class="beat quiz-enter thanks-panel">
      <p class="quiz-kicker">Thank You</p>
      <h2>Your Medicare Prospect Search Is Complete</h2>
      <div class="gen-bar"><i></i></div>
      <p>We’re preparing your Medicare Market Analysis.</p>
      <ul class="recap-list" id="thanks-recap"></ul>
      <p>Our data team will review your criteria and determine the number of matching Medicare prospects available in your market. Your complimentary Market Analysis will be sent to the contact information provided.</p>
      <p>Have an urgent request? Call AmeriList at <a href="tel:18004572899">1.800.457.2899</a>.</p>
    </div>`);
  body.appendChild(wrap);
  const list = wrap.querySelector("#thanks-recap");
  recapPairs().forEach(([label, value]) => {
    const li = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    li.appendChild(strong);
    li.appendChild(document.createTextNode(value));
    list.appendChild(li);
  });
  if (canGsap()) {
    gsap.fromTo(".gen-bar i", { width: "0%" }, { width: "90%", duration: 2.2, ease: "power2.inOut" });
  }
}

function render({ scroll, animate } = {}) {
  body.innerHTML = "";
  updateChrome();
  if (state.screen === "q") renderQ();
  else if (state.screen === "unlock") renderUnlock();
  else renderThanks();
  if (animate) animateIn();
  if (scroll) {
    document.getElementById("quiz-shell").scrollIntoView({ behavior: motionOk ? "smooth" : "auto", block: "start" });
  }
}

dockBack.addEventListener("click", () => {
  if (state.q > 0) goQuestion(state.q - 1);
});

dockNext.addEventListener("click", () => {
  if (!canContinue()) return;
  if (state.q === 5) {
    state.screen = "unlock";
    render({ scroll: true, animate: true });
    return;
  }
  goQuestion(state.q + 1);
});

document.addEventListener("keydown", (e) => {
  if (state.screen !== "q") return;
  if (e.target.matches("input, textarea")) return;
  const answers = [...body.querySelectorAll(".answer")];
  const idx = KEYS.indexOf(e.key.toUpperCase());
  if (idx >= 0 && answers[idx]) answers[idx].click();
});

render({ animate: true });
