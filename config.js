/**
 * Lead delivery. After domain approval, fill form123 only.
 *
 * 123FormBuilder: create a form with contact fields plus hidden/text
 * fields for the quiz answers, then paste IDs below. Submissions then
 * appear in the same 123FB inbox as your other forms.
 *
 * How to get IDs:
 * 1. Publish → Share form. The URL looks like
 *    https://form.123formbuilder.com/201140/...  → id is 201140
 * 2. Open the live form, Inspect a field, copy its name="control########"
 * 3. Paste those names into controls below (include the "control" prefix)
 *
 * Netlify Forms is left as a fallback if this ever runs on Netlify.
 * It does not fire on Vercel.
 */
window.LEAD_CONFIG = {
  netlifyFormName: "medicare-leads",
  form123: {
    id: "",
    action: "https://form.123formbuilder.com/sf.php",
    sParam: "",
    controls: {
      first: "",
      last: "",
      company: "",
      email: "",
      phone: "",
      website: "",
      contactMethod: "",
      audiences: "",
      otherAudience: "",
      geoType: "",
      market: "",
      radiusOrigin: "",
      radius: "",
      ageFrom: "",
      ageTo: "",
      anyAge: "",
      dob: "",
      gender: "",
      income: "",
      homeownership: "",
      netWorth: "",
      marital: "",
      household: "",
      extras: "",
      targetingNotes: "",
      channel: "",
      quantity: "",
      campaignNotes: "",
      timing: "",
      summary: "",
    },
  },
};
