(() => {
  const rows = document.querySelectorAll("#tableContainer tbody tr");
  const gorganRows = [...rows].filter((r) => {
    return r.querySelector("td:nth-child(9)").innerText === "گرگان";
  });

  const dayMapper = [
    {
      id: "sat",
      label: "شنبه",
    },

    {
      id: "sun",
      label: "یکشنبه",
    },
    {
        id: "sun",
        label: "يكشنبه",
      },
    
    {
      id: "sun",
      label: "یک شنبه",
    },

    {
      id: "mon",
      label: "دوشنبه",
    },
    {
      id: "mon",
      label: "دو شنبه",
    },

    {
      id: "tues",
      label: "سه‌شنبه",
    },
    {
      id: "tues",
      label: "سه شنبه",
    },
    {
      id: "wed",
      label: "چهارشنبه",
    },
    {
      id: "wed",
      label: "چهار شنبه",
    },
    {
      id: "thurs",
      label: "پنجشنبه",
    },
    {
      id: "thurs",
      label: "پنج شنبه",
    },
    {
      id: "fri",
      label: "جمعه",
    },
  ];
  const formatted = gorganRows.map((r) => {
      const day = r
      .querySelector("td:nth-child(16)")
      .innerText.split("از")[0]
      .trim();
    const time = r
      .querySelector("td:nth-child(16)")
      .innerText.split("از")[1]
      .trim();
      console.log(day)
    return {
      class_id: r.querySelector("td:nth-child(8)").innerText,
      course_id: r.querySelector("td:nth-child(3)").innerText,
      day: dayMapper.find(d => d.label === day).id,
      start_at: time.split("تا")[0].trim(),
      end_at: time.split("تا")[1].trim(),
      prof: r.querySelector("td:nth-child(18)").innerText,
    };
  });

  console.log(formatted);
})();
