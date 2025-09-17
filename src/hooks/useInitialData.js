import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

// Dati di esempio per la dimostrazione
const defaultGroups = [
  {
    id: 1,
    name: "Vacanza Montagna",
    participants: ["Mario Rossi", "Luigi Verdi", "Giovanna Bianchi", "Sofia Neri"],
    total: 1250.0,
    description: "Weekend in montagna",
    expenses: [
      {
        id: 1,
        groupId: 1,
        amount: 200,
        description: "Affitto cabina",
        payer: "Mario Rossi",
        category: "alloggio",
        date: "2024-09-10",
        participants: ["Mario Rossi", "Luigi Verdi", "Giovanna Bianchi", "Sofia Neri"],
        splitType: "equal"
      },
      {
        id: 2,
        groupId: 1,
        amount: 150,
        description: "Spesa alimentari",
        payer: "Luigi Verdi", 
        category: "cibo",
        date: "2024-09-11",
        participants: ["Mario Rossi", "Luigi Verdi", "Giovanna Bianchi", "Sofia Neri"],
        splitType: "equal"
      }
    ]
  },
  {
    id: 2,
    name: "Cena di Compleanno", 
    participants: ["Marco Rossi", "Anna Verdi", "Luca Bianchi"],
    total: 480.0,
    description: "Cena di compleanno di Marco",
    expenses: [
      {
        id: 3,
        groupId: 2,
        amount: 120,
        description: "Ristorante",
        payer: "Marco Rossi",
        category: "cibo", 
        date: "2024-09-12",
        participants: ["Marco Rossi", "Anna Verdi", "Luca Bianchi"],
        splitType: "equal"
      }
    ]
  }
];

const defaultUsers = [
  {
    id: 1,
    name: "Mario Rossi",
    email: "mario.rossi@email.com",
    phone: "+39 123 456 7890",
    groups: ["Vacanza Montagna"],
    totalSpent: 325.50,
    totalOwed: 125.75,
    joinDate: "2024-01-15"
  },
  {
    id: 2,
    name: "Luigi Verdi",
    email: "luigi.verdi@email.com", 
    phone: "+39 987 654 3210",
    groups: ["Vacanza Montagna", "Cena Compleanno"],
    totalSpent: 480.00,
    totalOwed: 0.00,
    joinDate: "2024-02-20"
  }
];

export const useInitialData = () => {
  const [groups, setGroups] = useLocalStorage('expense-groups', []);
  const [users, setUsers] = useLocalStorage('expense-users', []);

  // Carica i dati di esempio solo al primo accesso
  useEffect(() => {
    const isFirstAccess = localStorage.getItem('first-access') === null;
    
    if (isFirstAccess && groups.length === 0) {
      setGroups(defaultGroups);
      setUsers(defaultUsers);
      localStorage.setItem('first-access', 'false');
    }
  }, [groups.length, setGroups, setUsers]);

  return [groups, setGroups, users, setUsers];
};