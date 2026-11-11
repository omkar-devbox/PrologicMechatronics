import { initSharedNavigation } from '../../assets/js/nav';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Header Navigation
  initSharedNavigation('solutions');

  // 2. Interactive Category Tabs Filtering
  const filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-tab-btn');
  const solutionCards = document.querySelectorAll<HTMLElement>('.solution-card-item');
  const countDisplay = document.getElementById('visible-count');
  const searchInput = document.getElementById('solution-search-input') as HTMLInputElement | null;
  const clearSearchBtn = document.getElementById('clear-search-btn') as HTMLButtonElement | null;

  let activeFilter = 'all';
  let searchTerm = '';

  function filterSolutions() {
    let count = 0;
    const term = searchTerm.toLowerCase().trim();

    solutionCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const desc = (card.getAttribute('data-desc') || '').toLowerCase();
      const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();

      const matchesFilter = activeFilter === 'all' || category.includes(activeFilter);
      const matchesSearch = !term || title.includes(term) || desc.includes(term) || keywords.includes(term);

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
        count++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = count.toString();
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      filterSolutions();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchTerm = searchInput.value;
      if (clearSearchBtn) {
        if (searchTerm.length > 0) {
          clearSearchBtn.classList.remove('hidden');
        } else {
          clearSearchBtn.classList.add('hidden');
        }
      }
      filterSolutions();
    });
  }

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchTerm = '';
      clearSearchBtn.classList.add('hidden');
      searchInput.focus();
      filterSolutions();
    });
  }
});
