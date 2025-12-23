export interface Quest {
  id: string;
  title: string;
  description: string;
  location: string;
  points: number;
  date: string;
  completed: boolean;
}

export interface Photo {
  id: string;
  questId: string;
  questTitle: string;
  userId: string;
  userName: string;
  imageUrl: string;
  location: string;
  timestamp: string;
  likes: number;
}

export interface User {
  id: string;
  name: string;
  completedQuests: number;
  totalPoints: number;
  avatar?: string;
}
