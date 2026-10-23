export function ledigaTider(bokningar, dagStart, dagSlut) {
  const sorterade = [...bokningar].sort((a, b) => new Date(a.startsAt) - new Date (b.startsAt))
  const luckor = []
  let markör = dagStart

  for (const b of sorterade) {
    if (b.startsAt > markör) {
      luckor.push({ start: markör, end: b.startsAt })
    }
    markör = b.endsAt > markör ? b.endsAt : markör
  }

  if (markör < dagSlut) {
    luckor.push({ start: markör, end: dagSlut })
  }

  return luckor
}
