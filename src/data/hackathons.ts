import { image } from "framer-motion/client";

// Mock data for hackathons - this would typically come from an API or database
export const hacks = [
  {
    id: 1,
    slug: "aptos-defi-hackathon",
    image: "/aptos.png",
    title: "Aptos DeFi Hackathon",
    description: "Build the next generation of DeFi applications on the Aptos blockchain.",
    date: "June 15-17, 2025",
    location: "Virtual",
    time: "48 hours",
    participants: "500+",
    bgColor: "bg-blue-600",
    registrationDeadline: "June 10, 2025",
    prizes: "$50,000 in prizes",
    longDescription: "Join us for an exciting 48-hour hackathon focused on building decentralized finance applications on the Aptos blockchain. This virtual event brings together developers, designers, and blockchain enthusiasts from around the world to create innovative DeFi solutions. Whether you're interested in lending protocols, decentralized exchanges, or novel financial instruments, this hackathon is your opportunity to build the future of finance on Aptos.",
    requirements: ["Basic knowledge of Move language", "Understanding of DeFi concepts", "Laptop with development environment"],
    judges: ["Jane Doe - Aptos Foundation", "John Smith - DeFi Protocol Lead", "Alex Johnson - Blockchain Venture Capital"]
  },
  {
    id: 2,
    slug: "move-language-summit",
    image: "/move.png",
    title: "Move Language Summit",
    description: "Explore the Move programming language and build secure smart contracts.",
    date: "July 8-10, 2025",
    location: "San Francisco, CA",
    time: "72 hours",
    participants: "300+",
    bgColor: "bg-purple-600",
    registrationDeadline: "July 1, 2025",
    prizes: "$30,000 in prizes",
    longDescription: "The Move Language Summit is a 3-day in-person event in San Francisco focused on advancing the Move programming language ecosystem. Participants will work on building secure, efficient smart contracts and explore new patterns and libraries. This summit combines workshops, coding sessions, and networking opportunities with the core Move language developers and community leaders.",
    requirements: ["Experience with Move or similar languages", "Smart contract development background", "Laptop with Move development environment"],
    judges: ["Michael Chen - Move Core Developer", "Sarah Williams - Security Expert", "David Garcia - Protocol Architect"]
  },
  {
    id: 3,
    slug: "web3-gaming-hackathon",
    image: "/web3game.png",
    title: "Web3 Gaming Hackathon",
    description: "Create innovative blockchain games with NFTs and play-to-earn mechanics.",
    date: "August 20-22, 2025",
    location: "Hybrid (Online & New York)",
    time: "48 hours",
    participants: "400+",
    bgColor: "bg-pink-600",
    registrationDeadline: "August 15, 2025",
    prizes: "$45,000 in prizes",
    longDescription: "The Web3 Gaming Hackathon brings together game developers, artists, and blockchain enthusiasts to create the next generation of blockchain-based games. Focus areas include NFT integration, play-to-earn mechanics, on-chain game logic, and innovative tokenomics. This hybrid event allows for both in-person participation in New York and remote collaboration from anywhere in the world.",
    requirements: ["Game development experience", "Understanding of NFTs and tokens", "Creativity and passion for gaming"],
    judges: ["Emma Roberts - Game Studio Founder", "Carlos Mendez - NFT Platform Lead", "Taylor Kim - Gaming VC Partner"]
  },
  {
    id: 4,
    slug: "blockchain-interoperability-challenge",
    image: "/blockchain.png",
    title: "Blockchain Interoperability Challenge",
    description: "Build bridges between different blockchain ecosystems and enable seamless asset transfers.",
    date: "September 5-7, 2025",
    location: "Virtual",
    time: "72 hours",
    participants: "250+",
    bgColor: "bg-emerald-600",
    registrationDeadline: "September 1, 2025",
    prizes: "$40,000 in prizes",
    longDescription: "The Blockchain Interoperability Challenge focuses on creating solutions that bridge different blockchain ecosystems. Participants will work on cross-chain messaging, asset transfers, and unified identity systems. This virtual hackathon aims to break down the silos between blockchain networks and create a more connected Web3 ecosystem where assets and data can flow freely between chains.",
    requirements: ["Experience with multiple blockchain platforms", "Understanding of cross-chain concepts", "Knowledge of cryptographic principles"],
    judges: ["Robert Zhang - Cross-chain Protocol Founder", "Lisa Patel - Blockchain Researcher", "Kevin Wilson - Infrastructure Engineer"]
  }
]; 