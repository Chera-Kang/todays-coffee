const STORAGE_KEY = 'todays_coffee_consumed_v1';
const DATE_KEY = 'todays_coffee_date_v1';

// 로컬 시간대 기준 YYYY-MM-DD 문자열 생성
export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 자정 경과 여부 검사 및 데이터 자동 초기화
export const checkAndResetMidnight = () => {
  try {
    const today = getTodayDateString();
    const lastDate = localStorage.getItem(DATE_KEY);

    if (lastDate && lastDate !== today) {
      // 날짜가 바뀜(자정 경과) -> 어제 기록 초기화
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem(DATE_KEY, today);
      return [];
    }

    if (!lastDate) {
      localStorage.setItem(DATE_KEY, today);
    }
    return null;
  } catch (err) {
    console.error('Failed to check midnight reset:', err);
    return null;
  }
};

export const getConsumedCoffees = () => {
  try {
    const today = getTodayDateString();
    const lastDate = localStorage.getItem(DATE_KEY);

    // 날짜가 바뀌었으면 빈 목록으로 리셋
    if (lastDate && lastDate !== today) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem(DATE_KEY, today);
      return [];
    }

    if (!lastDate) {
      localStorage.setItem(DATE_KEY, today);
    }

    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to load consumed coffees from localStorage:', err);
    return [];
  }
};

export const saveConsumedCoffees = (items) => {
  try {
    const today = getTodayDateString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    localStorage.setItem(DATE_KEY, today);
  } catch (err) {
    console.error('Failed to save consumed coffees to localStorage:', err);
  }
};

export const addConsumedCoffee = (menu, memo = '') => {
  const current = getConsumedCoffees();
  const newItem = {
    id: `${menu.id}-${Date.now()}`,
    menuId: menu.id,
    name: menu.name,
    brand: menu.brand,
    brandId: menu.brandId,
    caffeine: Number(menu.caffeine),
    calories: Number(menu.calories),
    sugar: Number(menu.sugar),
    memo: memo.trim(),
    consumedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now()
  };
  const updated = [newItem, ...current];
  saveConsumedCoffees(updated);
  return updated;
};

export const removeConsumedCoffee = (id) => {
  const current = getConsumedCoffees();
  const updated = current.filter((item) => item.id !== id);
  saveConsumedCoffees(updated);
  return updated;
};

export const clearConsumedCoffees = () => {
  saveConsumedCoffees([]);
  return [];
};
