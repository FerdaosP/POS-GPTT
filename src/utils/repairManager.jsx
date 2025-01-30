export default {
    getRepairs: () => JSON.parse(localStorage.getItem('repairs') || '[]'),
    saveRepair: (repair) => {
      const repairs = JSON.parse(localStorage.getItem('repairs') || '[]');
      repairs.push(repair);
      localStorage.setItem('repairs', JSON.stringify(repairs));
    }
  }