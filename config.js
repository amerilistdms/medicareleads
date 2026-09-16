/**
 * Lead delivery. Fill form123 when you have a 123FormBuilder form ready.
 *
 * Netlify Forms (already wired): submissions land in Netlify → Forms →
 * medicare-leads, and can email the team. Works as soon as this site is
 * deployed on Netlify. Does not work on localhost.
 *
 * 123FormBuilder: you cannot dump a custom quiz into 123FB from the browser
 * without a Form ID + field control IDs. Create a form with contact fields
 * plus hidden/text fields for the quiz answers, then paste IDs below.
 * Submissions then appear in the same 123FB inbox as your other forms.
 *
 * How to get IDs:
 * 1. Publish → Share form. The URL looks like
 *    https://form.123formbuilder.com/201140/...  → id is 201140
 * 2. Open the live form, Inspect a field, copy its name="control########"
 * 3. Paste those names into controls below (include the "control" prefix)
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
