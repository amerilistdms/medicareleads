const FORM_URL = "https://form.123formbuilder.com/6979581/findmedicareprospects";
const FORM_ID = 6979581;

const FIELDS = {
  first: { id: 121851111, type: 23, hash: "00000007" },
  last: { id: 121851112, type: 23, hash: "00000009" },
  company: { id: 121851113, type: 23, hash: "0000000b" },
  email: { id: 121851115, type: 5, hash: "0000000d" },
  phone: { id: 121851116, type: 16, hash: "0000000f" },
  website: { id: 121851117, type: 23, hash: "00000011" },
  contactMethod: { id: 121851119, type: 23, hash: "00000013" },
  audiences: { id: 121851124, type: 23, hash: "00000015" },
  otherAudience: { id: 121851127, type: 23, hash: "00000017" },
  geoType: { id: 121851131, type: 23, hash: "00000019" },
  market: { id: 121851132, type: 23, hash: "0000001b" },
  channel: { id: 121851133, type: 23, hash: "0000001d" },
  quantity: { id: 121851134, type: 23, hash: "0000001f" },
  timing: { id: 121851136, type: 23, hash: "00000021" },
  summary: { id: 121851137, type: 23, hash: "00000023" },
  radiusOrigin: { id: 121851139, type: 23, hash: "00000025" },
  radius: { id: 121851145, type: 23, hash: "00000027" },
  ageFrom: { id: 121851148, type: 23, hash: "00000029" },
  ageTo: { id: 121851150, type: 23, hash: "0000002b" },
  anyAge: { id: 121851151, type: 23, hash: "0000002d" },
  dob: { id: 121851152, type: 23, hash: "0000002f" },
  gender: { id: 121851153, type: 23, hash: "00000031" },
  income: { id: 121851154, type: 23, hash: "00000033" },
  homeownership: { id: 121851155, type: 23, hash: "00000035" },
  netWorth: { id: 121851156, type: 23, hash: "00000037" },
  marital: { id: 121851157, type: 23, hash: "00000039" },
  household: { id: 121851158, type: 23, hash: "0000003b" },
  extras: { id: 121851159, type: 23, hash: "0000003d" },
  targetingNotes: { id: 121851160, type: 23, hash: "0000003f" },
  campaignNotes: { id: 121851161, type: 23, hash: "00000041" },
};

function formatPhone(raw) {
  let digits = String(raw || "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return String(raw || "").trim();
}

async function getSession() {
  const res = await fetch(FORM_URL, {
    headers: { "User-Agent": "Mozilla/5.0 FindMedicareProspects" },
  });
  const html = await res.text();
  const match = html.match(/withSessionId\(\s*"([^"]+)"/);
  if (!match) throw new Error("123FormBuilder session missing");
  return match[1];
}

function submissionFrom(payload) {
  return Object.entries(FIELDS).flatMap(([key, field]) => {
    let value = payload[key];
    if (value == null) return [];
    value = String(value).trim();
    if (!value) return [];
    if (key === "phone") value = formatPhone(value);
    return [{
      id: field.id,
      value: { value },
      hash: field.hash,
      typeId: field.type,
      visible: true,
      path: "",
    }];
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const session = await getSession();
    const body = {
      action: 0,
      formId: FORM_ID,
      location: "https://findmedicareprospects.com/",
      referrer: "https://findmedicareprospects.com/",
      partial: false,
      sessionId: session,
      submission: submissionFrom(payload),
      sessionKey: "",
      currentPage: 0,
      targetPage: null,
      totalPages: 1,
      language: "en",
    };

    const submit = await fetch(`${FORM_URL}?PHPSESSID=${encodeURIComponent(session)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 FindMedicareProspects",
        "X-PHPSESSID": session,
        Origin: "https://form.123formbuilder.com",
        Referer: FORM_URL,
      },
      body: JSON.stringify(body),
    });
    const result = await submit.json();
    if (!result || result.ok !== true) {
      return res.status(502).json({ ok: false, error: "123FormBuilder rejected the submission", details: result });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message || "Lead submit failed" });
  }
};
