export function ledigaTider(bokningar, dagStart, dagSlut) {
  const sorterade = [...bokningar].sort((a, b) => new Date(a.startsAt) - new Date (b.startsAt))
  const luckor = []
  let markör = dagStart
  const dagNu = new Date();

  for (const b of sorterade) {
    const bStartTime = new Date(b.startsAt);
    const bEndTime = new Date(b.endsAt);

    if (bStartTime > markör && markör < dagNu) {
        luckor.push({ start: markör, end: bStartTime, past: true });
    } else if (bStartTime > markör) {
        luckor.push({ start: markör, end: bStartTime, past: false });
    }
    markör = bEndTime > markör ? bEndTime : markör
  }

  if (markör < dagSlut) {
        luckor.push({ start: markör, end: dagSlut, past: false });
  }

  return luckor
}
