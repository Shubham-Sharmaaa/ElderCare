export function computeRisk({
  history = [],
  age = 65,
  condition = "hypertension",
  missedMeds = 0,
}) {
  let score = 0;
  const notes = [];
  const recent = history.slice(-12);
  const lows = recent.filter((v) => v.spo2 < 92).length;
  const highs = recent.filter((v) => v.hr > 105).length;
  if (lows >= 2) {
    score += 20;
    notes.push("SpO₂ < 92 twice in 24h (+20)");
  }
  if (highs >= 2) {
    score += 15;
    notes.push("HR > 105 twice in 24h (+15)");
  }
  if (recent.length >= 5) {
    const hrs = recent.map((v) => v.hr);
    const mean = hrs.reduce((a, b) => a + b, 0) / hrs.length;
    const varHr = Math.sqrt(
      hrs.reduce((a, b) => a + (b - mean) * (b - mean), 0) / hrs.length
    );
    if (varHr > 12) {
      score += 10;
      notes.push("High HR variability (+10)");
    }
  }
  if (age >= 70) {
    score += 10;
    notes.push("Age ≥ 70 (+10)");
  }
  if (/hypertension|cardio/i.test(condition)) {
    score += 8;
    notes.push("Cardio condition (+8)");
  }
  if (missedMeds >= 2) {
    score += 8;
    notes.push("Missed meds ≥ 2 (+8)");
  }
  score = Math.max(0, Math.min(100, score));
  let label = "Low";
  if (score >= 60) label = "High";
  else if (score >= 30) label = "Moderate";
  return { score, label, notes };
}
