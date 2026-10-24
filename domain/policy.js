export function kontrolleraRegler(bokning, användarensBokningar) {
  const timmar = (bokning.endsAt - bokning.startsAt) / 3600000

  if (timmar > 4) {
    return { ok: false, fel: 'Max 4 timmar per bokning' }
  }

  if (bokning.startsAt < Date.now()) {
    return { ok: false, fel: 'Kan inte boka bakåt i tiden' }
  }

  if (användarensBokningar.length >= 3) {
    return { ok: false, fel: 'Max 3 aktiva bokningar' }
  }

  return { ok: true }
}
