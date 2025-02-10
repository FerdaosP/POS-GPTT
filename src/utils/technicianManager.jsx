// File: src/utils/technicianManager.js
export const TechnicianManager = {
    getAll: () => {
      try {
        return JSON.parse(localStorage.getItem('technicians')) || [];
      } catch (error) {
        console.error('Error loading technicians:', error);
        return [];
      }
    },
    
    add: (technician) => {
      const technicians = TechnicianManager.getAll();
      const newTechnician = { 
        id: Date.now(),
        ...technician,
        createdAt: new Date().toISOString()
      };
      technicians.push(newTechnician);
      localStorage.setItem('technicians', JSON.stringify(technicians));
      return newTechnician;
    },
  
    delete: (id) => {
      const technicians = TechnicianManager.getAll().filter(t => t.id !== id);
      localStorage.setItem('technicians', JSON.stringify(technicians));
    }
  };