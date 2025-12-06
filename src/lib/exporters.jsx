// // Simple CSV/JSON download helpers

// export function downloadJSON(filename, data) {
//   const blob = new Blob([JSON.stringify(data, null, 2)], {
//     type: "application/json",
//   });
//   const a = document.createElement("a");
//   a.href = URL.createObjectURL(blob);
//   a.download = filename;
//   a.click();
// }

// export function downloadCSV(filename, rows) {
//   if (!rows?.length) return;
//   const headers = Object.keys(rows[0]);
//   const csv = [
//     headers.join(","),
//     ...rows.map((r) =>
//       headers
//         .map((h) => String(r[h] ?? "").replaceAll('"', '""'))
//         .map((v) => `"${v}"`)
//         .join(",")
//     ),
//   ].join("\n");
//   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//   const a = document.createElement("a");
//   a.href = URL.createObjectURL(blob);
//   a.download = filename;
//   a.click();
// }
export function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
export function downloadCSV(filename, rows) {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => String(r[h] ?? "").replaceAll('"', '""'))
        .map((v) => `"${v}"`)
        .join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
