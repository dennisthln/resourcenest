import { Resource } from '../types';

export function createResourceSidebar(resources: Resource[], isMultiDay: boolean): HTMLElement {
  const sidebarElement = document.createElement('div');
  sidebarElement.className = 'rn-resource-sidebar';

  let innerHTML = '';
  if (isMultiDay) {
    innerHTML += '<div class="rn-resource-row" style="height:40px;"></div>'; // Spacer for multi-day header
  }

  innerHTML += resources.map(r => `
    <div class="rn-resource-row" data-resource-id="${r.id}">${r.name || '—'}</div>
  `).join('');

  sidebarElement.innerHTML = innerHTML;
  return sidebarElement;
}
