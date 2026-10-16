const eventList = document.querySelector("#event-list");

function addText(parent, tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function validEventImage(image) {
  if (typeof image !== "string" || !image.trim()) return null;

  try {
    const url = new URL(image, document.baseURI);
    return url.origin === window.location.origin ? url.href : null;
  } catch {
    return null;
  }
}

function validTicketUrl(ticketUrl) {
  if (typeof ticketUrl !== "string" || !ticketUrl.trim()) return null;

  try {
    const url = new URL(ticketUrl);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function formatDate(date, time) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";
  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== date) return "";

  const formattedDate = new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsedDate);
  return typeof time === "string" && time.trim()
    ? `${formattedDate} · ${time.trim()}`
    : formattedDate;
}

const priceFormatter = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

function formatPrice(price) {
  if (typeof price === "number") {
    return Number.isFinite(price) && price >= 0 ? priceFormatter.format(price) : "";
  }
  return typeof price === "string" ? price.trim() : "";
}

function renderPrices(card, event) {
  const prices = [
    ["Vorverkauf", formatPrice(event.presalePrice)],
    ["Abendkasse", formatPrice(event.boxOfficePrice)],
  ].filter(([, value]) => value);
  if (!prices.length) return;

  const list = document.createElement("dl");
  list.className = "event-card__prices";
  for (const [label, value] of prices) {
    const item = document.createElement("div");
    addText(item, "dt", "", label);
    addText(item, "dd", "", value);
    list.append(item);
  }
  card.append(list);
}

function renderEvent(event) {
  if (!event || typeof event !== "object" || typeof event.title !== "string" || !event.title.trim()) {
    return null;
  }

  const card = document.createElement("article");
  card.className = "event-card";

  if (typeof event.category === "string" && event.category.trim()) {
    addText(card, "p", "event-card__category", event.category.trim());
  }

  addText(card, "h3", "", event.title.trim());

  const meta = document.createElement("div");
  meta.className = "event-card__meta";
  const date = formatDate(event.date, event.time);
  if (date) addText(meta, "span", "", date);
  if (typeof event.venue === "string" && event.venue.trim()) {
    addText(meta, "span", "", event.venue.trim());
  }
  if (meta.childElementCount) card.append(meta);


  if (typeof event.description === "string" && event.description.trim()) {
    addText(card, "p", "event-card__description", event.description.trim());
  }

  if (typeof event.status === "string" && event.status.trim()) {
    addText(card, "p", "event-card__status", event.status.trim());
  }

  renderPrices(card, event);

  const imageUrl = validEventImage(event.image);
  if (imageUrl) {
    const image = document.createElement("img");
    image.className = "event-card__image";
    image.src = imageUrl;
    image.alt = typeof event.imageAlt === "string" ? event.imageAlt : "";
    image.loading = "lazy";
    const frame = document.createElement("div");
    frame.className = "event-card__media";
    const backdrop = document.createElement("img");
    backdrop.className = "event-card__backdrop";
    backdrop.src = imageUrl;
    backdrop.alt = "";
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.loading = "lazy";
    image.addEventListener("error", () => frame.remove(), { once: true });
    frame.append(backdrop, image);
    card.prepend(frame);
  }

  const ticketUrl = validTicketUrl(event.ticketUrl);
  if (ticketUrl) {
    const ticketLink = document.createElement("a");
    ticketLink.className = "button button--ticket";
    ticketLink.href = ticketUrl;
    ticketLink.target = "_blank";
    ticketLink.rel = "noopener noreferrer";
    ticketLink.textContent = "Tickets kaufen";
    ticketLink.setAttribute("aria-label", `Tickets kaufen: ${event.title.trim()}`);
    card.append(ticketLink);
  }

  return card;
}

async function loadEvents() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) throw new Error("Veranstaltungen konnten nicht geladen werden.");
    const events = await response.json();
    if (!Array.isArray(events)) throw new Error("Ungültiges Veranstaltungsformat.");

    eventList.replaceChildren();
    const cards = events.map(renderEvent).filter(Boolean);
    if (cards.length) {
      eventList.append(...cards);
    } else {
      addText(
        eventList,
        "p",
        "event-message",
        "Veranstaltungsinformationen werden ergänzt. Schauen Sie bald wieder vorbei.",
      );
    }
  } catch {
    eventList.replaceChildren();
    addText(eventList, "p", "event-message", "Veranstaltungen sind momentan nicht verfügbar.");
  } finally {
    eventList.setAttribute("aria-busy", "false");
  }
}

if (eventList) loadEvents();
