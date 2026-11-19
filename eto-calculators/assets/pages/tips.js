(function () {
  const { esc } = ETO;
  const L = arr => `<ul class="steps">${arr.map(x => `<li>${x}</li>`).join('')}</ul>`;
  const S = [
    ['use', '💡', 'Using the calculators', () => L([
      'Every calculator shows the <b>formula used</b>. Green / amber / red tiles flag acceptable, borderline and unacceptable values.',
      'Fields marked with a table (load lists, DG sharing, blackout steps) can have rows added or removed.',
      'Use <b>📋 Copy results</b> to paste into a requisition / report, or <b>🖨 Print</b> for a PDF record.',
      'Default values are typical examples (440 V / 60 Hz marine system) – replace them with your vessel\'s nameplate data.',
      'Cable / breaker tables and class rules differ by vessel: the vessel\'s design documents and class society rules are always the authority.'])],
    ['nav', '🧭', 'Finding your way', () => L([
      'The home page has two sections: <b>🧮 Calculators</b> and <b>📘 Guides &amp; Knowledge</b>, each split into groups.',
      'Type in the <b>search box</b> on the home page (e.g. “voltage drop”, “megger”, “DP”) to filter all pages instantly.',
      'Inside a page, use the <b>Sections</b> list to switch between calculators or topics, and the page menu in the top bar to jump to any other page.',
      'The ◀ ▶ buttons at the bottom of every page step through the handbook in order.'])],
    ['app', '📱', 'Offline, phone & dark mode', () => L([
      'The single file <b>ETO-Handbook.html</b> works fully offline – copy it to your phone, laptop or the ship\'s PC.',
      'Your inputs are remembered on your own device only; nothing is sent anywhere.',
      'Use the 🌓 button for dark mode – easier on the eyes during night watches.',
      'On a phone, open the file in the browser and use “Add to Home screen” for one-tap access.'])]
  ];
  ETO.page({
    title: 'Quick Tips', icon: '💡', accent: '#4f46e5',
    subtitle: 'How to get the most out of the ETO Handbook – calculators, navigation, offline use and dark mode.',
    refs: [],
    calcs: S.map(([id, icon, title, html]) => ({ id, icon, title, noActions: true, inputs: [], run: () => ({ head: '<span></span>', html: html() }) }))
  });
})();
