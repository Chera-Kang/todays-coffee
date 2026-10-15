const STORAGE_KEY = 'todays_coffee_consumed_v1';

export const getConsumedCoffees = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to load consumed coffees from localStorage:', err);
    return [];
  }
};

export const saveConsumedCoffees = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
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
