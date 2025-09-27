export interface VotingItem {
  id: string
  title: string
  description: string
  imageUrl: string
  category?: string
}

export interface Vote {
  itemId: string
  vote: "like" | "dislike"
  timestamp: Date
}

export interface UserProfile {
  id: string
  name: string
  avatar: string
  votes: Vote[]
}
