import type { VotingItem, UserProfile } from "@/types/voting"

export const sampleItems: VotingItem[] = [
  {
    id: "1",
    title: "Mountain Adventure",
    description:
      "Experience breathtaking views and challenging trails in the Swiss Alps. Perfect for outdoor enthusiasts seeking their next adventure.",
    imageUrl: "/mountain-landscape-adventure.png",
    category: "Travel",
  },
  {
    id: "2",
    title: "Urban Coffee Culture",
    description:
      "Discover the perfect blend of artisanal coffee and modern city vibes. A cozy spot for digital nomads and coffee lovers.",
    imageUrl: "/modern-coffee-shop-urban.jpg",
    category: "Lifestyle",
  },
  {
    id: "3",
    title: "Vintage Photography",
    description:
      "Capture moments with classic film cameras and timeless techniques. Embrace the art of analog photography.",
    imageUrl: "/vintage-camera-photography.jpg",
    category: "Art",
  },
  {
    id: "4",
    title: "Sustainable Living",
    description:
      "Eco-friendly products and practices for a greener lifestyle. Small changes that make a big environmental impact.",
    imageUrl: "/sustainable-eco-friendly-lifestyle.jpg",
    category: "Environment",
  },
  {
    id: "5",
    title: "Tech Innovation",
    description:
      "Cutting-edge technology solutions that are shaping the future. From AI to renewable energy breakthroughs.",
    imageUrl: "/futuristic-technology-innovation.jpg",
    category: "Technology",
  },
  {
    id: "6",
    title: "Culinary Excellence",
    description: "Gourmet dining experiences that celebrate local ingredients and innovative cooking techniques.",
    imageUrl: "/gourmet-food-culinary-art.jpg",
    category: "Food",
  },
]

export const sampleUser: UserProfile = {
  id: "user-1",
  name: "Alex Chen",
  avatar: "/professional-avatar.png",
  votes: [],
}
