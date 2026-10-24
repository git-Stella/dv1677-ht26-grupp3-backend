export function kontrolleraRegler(bokning, användarensBokningar) {
  const ends = new Date(bokning.endsAt);
  const starts = new Date(bokning.startsAt);
  const timmar = (ends - starts) / 3600000
  console.log("timmar: ", timmar);

  if (timmar > 4) {
    return { ok: false, fel: 'Max 4 timmar per bokning' }
  }

  if (starts < Date.now()) {
    return { ok: false, fel: 'Kan inte boka bakåt i tiden' }
  }

  if (användarensBokningar.length >= 3) {
    return { ok: false, fel: 'Max 3 aktiva bokningar' }
  }

  return { ok: true }
}
