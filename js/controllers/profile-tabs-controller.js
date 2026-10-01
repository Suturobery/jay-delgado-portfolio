const profileTabs = document.querySelectorAll('[data-profile-tab]');
const profilePanels = document.querySelectorAll('[data-profile-panel]');

function selectProfileTab(tab) {
  const selectedPanel = tab.dataset.profileTab;
  profileTabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
  profilePanels.forEach((panel) => {
    panel.hidden = panel.dataset.profilePanel !== selectedPanel;
  });
}

profileTabs.forEach((tab) => {
  tab.addEventListener('click', () => selectProfileTab(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...profileTabs];
    const index = tabs.indexOf(tab);
    const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    next.focus();
    selectProfileTab(next);
  });
});
