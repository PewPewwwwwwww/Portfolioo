/* ==========================================================================
   Erick Gozo | Portfolio Logic
   - Typewriter Headline Effect
   - Spec Architecture Modal Data & Controller
   - Clipboard Copy & Fallback Mail Handler
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initTypewriter();
});

/* --------------------------------------------------------------------------
   Typewriter Effect
   -------------------------------------------------------------------------- */
const words = ["Erick Gozo", "Full-Stack Developer"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingDelay = 120;
const deletingDelay = 60;
const holdDelay = 1800;

function initTypewriter() {
  const target = document.getElementById("typewriter");
  if (!target) return;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      charIndex--;
      target.textContent = currentWord.substring(0, charIndex);
    } else {
      charIndex++;
      target.textContent = currentWord.substring(0, charIndex);
    }

    let delay = isDeleting ? deletingDelay : typingDelay;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = holdDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* --------------------------------------------------------------------------
   Architecture Spec Modal Content & Handlers
   -------------------------------------------------------------------------- */
const projectSpecs = {
  "cm-helphub": {
    title: "CM-HelpHub: Architecture Overview",
    html: `
      <div class="spec-block">
        <div class="spec-block-title">SYSTEM SUMMARY</div>
        <p>A structured community helpdesk and issue resolution system designed to streamline citizen support inquiries, automate ticket prioritization, and provide audit logging for administrative staff.</p>
      </div>

      <div class="spec-block">
        <div class="spec-block-title">CORE API ENDPOINTS</div>
        <pre class="spec-code">POST   /api/auth/login            -> JWT token issue & session init
POST   /api/tickets/create        -> Validates payload & creates ticket document
GET    /api/tickets?status=&cat=  -> Indexed multi-field query with pagination
PATCH  /api/tickets/:id/resolve   -> Moderator resolution timeline update</pre>
      </div>

      <div class="spec-block">
        <div class="spec-block-title">DATA STORAGE SCHEMA (MONGODB)</div>
        <pre class="spec-code">{
  "_id": ObjectId("..."),
  "ticket_ref": "CM-2026-084",
  "category": "INFRASTRUCTURE | DISPATCH | INQUIRY",
  "priority": "LOW | MED | URGENT",
  "status": "OPEN | IN_REVIEW | RESOLVED",
  "reporter_id": ObjectId("..."),
  "timeline": [{ "event": String, "updated_by": ObjectId, "at": Date }]
}</pre>
      </div>
    `
  },
  "frisbee-system": {
    title: "Ultimate Frisbee Management System: Architecture Overview",
    html: `
      <div class="spec-block">
        <div class="spec-block-title">SYSTEM SUMMARY</div>
        <p>An automated tournament coordination engine providing round-robin group stage calculations, single/double elimination bracket trees, roster eligibility verification, and real-time game scoring.</p>
      </div>

      <div class="spec-block">
        <div class="spec-block-title">CORE API ENDPOINTS</div>
        <pre class="spec-code">POST   /api/tournaments/:id/generate-bracket  -> Runs pairing algorithm & seeds teams
GET    /api/matches/:id/live-score            -> Real-time score & turnover feeds
POST   /api/matches/:id/log-point             -> Records point scorer, assist, & time
GET    /api/standings/differential            -> Computes +/- points & rank tie-breaks</pre>
      </div>

     <div class="spec-block">
  <div class="spec-block-title">DOCUMENT SCHEMAS (MONGODB / MONGOOSE)</div>
  <pre class="spec-code">// teams collection
{
  "_id": ObjectId("..."),
  "name": "Storm Discs",
  "seed": 1,
  "roster": [
    { "player_id": ObjectId("..."), "name": "Erick Gozo", "jersey_num": 7 }
  ]
}

// matches collection
{
  "_id": ObjectId("..."),
  "tournament_id": ObjectId("..."),
  "round": "QUARTER_FINALS",
  "team_a": { "id": ObjectId("..."), "name": "Team A", "score": 15 },
  "team_b": { "id": ObjectId("..."), "name": "Team B", "score": 12 },
  "status": "COMPLETED",
  "events": [
    {
      "point_scored_by": ObjectId("..."),
      "assist_by": ObjectId("..."),
      "turnover_type": null,
      "timestamp": ISODate("2026-11-01T14:30:00Z")
    }
  ]
}</pre>
</div>
    `
  }
};

function openSpecModal(projectId) {
  const modal = document.getElementById("specModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  const spec = projectSpecs[projectId];
  if (!spec) return;

  modalTitle.textContent = spec.title;
  modalBody.innerHTML = spec.html;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSpecModal(event) {
  if (event && event.target !== event.currentTarget && !event.target.classList.contains("modal-close-btn")) {
    return;
  }
  const modal = document.getElementById("specModal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSpecModal();
  }
});

/* --------------------------------------------------------------------------
   Contact Handlers (Copy to Clipboard & Mail Trigger)
   -------------------------------------------------------------------------- */
function copyEmail() {
  const email = "gozoerick28@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    showToast("Email copied: " + email);

    const btnText = document.getElementById("copyBtnText");
    if (btnText) {
      const original = btnText.textContent;
      btnText.textContent = "Copied!";
      setTimeout(() => {
        btnText.textContent = original;
      }, 2000);
    }
  }).catch(() => {
    showToast("Email: " + email);
  });
}

function handleSendMail(email) {
  // Try opening default mail client
  const mailtoUri = `mailto:${email}`;
  window.location.href = mailtoUri;

  // Webmail fallback timeout: if the user remains on the page, provide an instant option
  setTimeout(() => {
    showToast("If your mail app didn't open, use 'Copy Email' instead.");
  }, 1000);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}