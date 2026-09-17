(function () {
  const form = document.getElementById("contact-form");
  const thanks = document.getElementById("contact-thanks");
  const error = document.getElementById("contact-error");
  if (!form) return;

  const endpoint = (window.LEAD_CONFIG && window.LEAD_CONFIG.leadEndpoint) || "/api/lead";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("[type='submit']");
    const data = Object.fromEntries(new FormData(form).entries());
    const message = String(data.message || "").trim();
    error.hidden = true;
    submit.disabled = true;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first: data.first,
          last: data.last,
          company: data.company,
          email: data.email,
          phone: data.phone,
          contactMethod: data.contactMethod || "Either",
          campaignNotes: message,
          summary: message
            ? `Contact page inquiry (audience quiz not completed). ${message}`
            : "Contact page inquiry (audience quiz not completed).",
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      form.hidden = true;
      thanks.hidden = false;
    } catch (err) {
      error.hidden = false;
      submit.disabled = false;
    }
  });
})();
