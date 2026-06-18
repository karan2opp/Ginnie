export function getStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getMonthGrid(targetDate: Date) {
  const currentYear = targetDate.getFullYear();
  const currentMonth = targetDate.getMonth();
  
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); 

  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  const days = [];
  const todayStr = getDateStr(new Date());

  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - 1, prevMonthLastDay - i);
    days.push({ date: d, dateStr: getDateStr(d), isCurrentMonth: false, isToday: getDateStr(d) === todayStr });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(currentYear, currentMonth, i);
    days.push({ date: d, dateStr: getDateStr(d), isCurrentMonth: true, isToday: getDateStr(d) === todayStr });
  }

  const remainingDays = 42 - days.length; 
  for (let i = 1; i <= remainingDays; i++) {
    const d = new Date(currentYear, currentMonth + 1, i);
    days.push({ date: d, dateStr: getDateStr(d), isCurrentMonth: false, isToday: getDateStr(d) === todayStr });
  }

  return days;
}

export function getWeekGrid(targetDate: Date) {
  const currentYear = targetDate.getFullYear();
  const currentMonth = targetDate.getMonth();
  const currentDate = targetDate.getDate();
  const currentDayOfWeek = targetDate.getDay();

  const days = [];
  const todayStr = getDateStr(new Date());

  for (let i = 0; i < 7; i++) {
    const d = new Date(currentYear, currentMonth, currentDate - currentDayOfWeek + i);
    days.push({ date: d, dateStr: getDateStr(d), isToday: getDateStr(d) === todayStr });
  }

  return days;
}

export function parseGoogleEvents(items: any[]) {
  const eventsByDate: Record<string, any[]> = {};

  items.forEach((event) => {
    const startStr = event.start?.dateTime || event.start?.date;
    const endStr = event.end?.dateTime || event.end?.date;
    if (!startStr) return;

    const dateKey = startStr.split('T')[0];
    if (!eventsByDate[dateKey]) eventsByDate[dateKey] = [];

    const isAllDay = !event.start?.dateTime;
    const startDateObj = new Date(startStr);
    const endDateObj = endStr ? new Date(endStr) : new Date(startDateObj.getTime() + 60*60*1000); // default 1hr
    
    const startTime = isAllDay ? "" : startDateObj.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

    let startHour = 0;
    let startMin = 0;
    let durationHours = 24;

    if (!isAllDay) {
      startHour = startDateObj.getHours();
      startMin = startDateObj.getMinutes();
      durationHours = (endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60);
    }

    eventsByDate[dateKey].push({
      id: event.id,
      summary: event.summary || "(No Title)",
      timeString: startTime,
      isAllDay,
      htmlLink: event.htmlLink,
      hangoutLink: event.hangoutLink || null,
      description: event.description || "",
      location: event.location || "",
      startHour,
      startMin,
      durationHours
    });
  });

  return eventsByDate;
}
