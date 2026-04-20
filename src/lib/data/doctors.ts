import type { Doctor } from "@/types/doctor";

export const doctors: Doctor[] = [
  {
    id: "maya-thompson",
    name: "Dr. Maya Thompson",
    specialty: "Family Medicine",
    availableSlots: ["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM"],
  },
  {
    id: "samuel-chen",
    name: "Dr. Samuel Chen",
    specialty: "Cardiology",
    availableSlots: ["8:30 AM", "11:00 AM", "2:00 PM"],
  },
  {
    id: "amina-bello",
    name: "Dr. Amina Bello",
    specialty: "Pediatrics",
    availableSlots: ["9:30 AM", "12:00 PM", "4:00 PM"],
  },
  {
    id: "olivia-reed",
    name: "Dr. Olivia Reed",
    specialty: "Dermatology",
    availableSlots: ["10:00 AM", "1:30 PM", "5:00 PM"],
  },
  {
    id: "james-okafor",
    name: "Dr. James Okafor",
    specialty: "Orthopedics",
    availableSlots: ["8:00 AM", "11:30 AM", "2:30 PM"],
  },
  {
    id: "sofia-martinez",
    name: "Dr. Sofia Martinez",
    specialty: "Mental Health",
    availableSlots: ["9:00 AM", "12:30 PM", "3:00 PM"],
  },
];
