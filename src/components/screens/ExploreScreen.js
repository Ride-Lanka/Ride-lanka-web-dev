"use client";

import { useMemo, useState } from "react";
import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";

const explorePlaces = [
  {
    id: 1,
    title: "Sigiriya Rock Fortress",
    snippet: "An ancient palace and fortress complex that lies in the heart of the northern Matale District.",
    image: "https://images.unsplash.com/photo-1588096344390-8b0101b44917?w=800&q=80",
    content: "Sigiriya, or Lion Rock, is a soaring granite peak in Sri Lanka featuring the ruins of an ancient stronghold. Renowned for its ancient frescoes and the monumental lion paws carved into its base, it was built by King Kasyapa in the 5th century. Visitors climb up a series of staircases attached to sheer rock walls to reach the summit, which houses the foundations of the lavish palace."
  },
  {
    id: 2,
    title: "Anuradhapura Ancient City",
    snippet: "The first ancient capital of Sri Lanka, known for its well-preserved ruins and sacred Bodhi tree.",
    image: "https://images.unsplash.com/photo-1620216637380-4df2f2a71bf6?w=800&q=80",
    content: "Anuradhapura was the center of Theravada Buddhism for many centuries. As one of the oldest continuously inhabited cities in the world, its vast complex contains massive stupas like Ruwanwelisaya and the sacred Jaya Sri Maha Bodhi, a sapling from the historical Bodhi tree. It remains a deeply spiritual destination."
  },
  {
    id: 3,
    title: "Polonnaruwa Ruins",
    snippet: "The second most ancient of Sri Lanka's kingdoms, echoing the glory of historical kings.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    content: "Polonnaruwa succeeded Anuradhapura as the capital. Its archaeological park is a delight to explore, featuring the monumental Gal Vihara – four majestic statues of Buddha carved into the face of a granite rock. The ruins of the Royal Palace and the Quadrangle reveal the architectural brilliance of the 12th century."
  },
  {
    id: 4,
    title: "Dambulla Cave Temple",
    snippet: "The largest and best-preserved cave temple complex in Sri Lanka, packed with profound history.",
    image: "https://images.unsplash.com/photo-1590483863777-be8e811b590e?w=800&q=80",
    content: "Dambulla Cave Temple, also known as the Golden Temple of Dambulla, holds over 150 stunning statues of Buddha and intricate mural paintings covering the cave ceilings. Used as a refuge by an ancient king, the caves have been a sacred pilgrimage site for over 22 centuries."
  },
  {
    id: 5,
    title: "Temple of the Sacred Tooth Relic",
    snippet: "A deeply revered Buddhist temple in the city of Kandy, housing the relic of the tooth of the Buddha.",
    image: "https://images.unsplash.com/photo-1624647970792-71ab523b09de?w=800&q=80",
    content: "Located in the royal palace complex of the former Kingdom of Kandy, this beautifully adorned temple houses Sri Lanka's most important Buddhist relic: a tooth of the Buddha. The rituals, traditional drumming, and the temple's serene lakeside setting make it an unforgettable cultural experience."
  },
  {
    id: 6,
    title: "Galle Dutch Fort",
    snippet: "A historical, archaeological, and architectural heritage monument maintained on the southwest coast.",
    image: "https://images.unsplash.com/photo-1549473889-14f410d83298?w=800&q=80",
    content: "First built by the Portuguese in 1588 and extensively fortified by the Dutch during the 17th century, the Galle Fort is a living UNESCO World Heritage Site. Today, its cobblestone streets are lined with boutique shops, cafes, and historical mansions facing the Indian Ocean."
  },
  {
    id: 7,
    title: "Yapahuwa Rock Fortress",
    snippet: "A monumental ancient fortress offering steep steps and extraordinary ornamental stairways.",
    image: "https://images.unsplash.com/photo-1601639016912-870ba68aa0fa?w=800&q=80",
    content: "Briefly the capital of Sri Lanka in the 13th century, Yapahuwa is built around a massive granite rock rising abruptly from the plain. The steep ornamental staircase adorned with elaborate stone carvings of lions and mythical creatures is its most striking feature."
  },
  {
    id: 8,
    title: "Ruwanwelisaya Stupa",
    snippet: "One of the world's tallest ancient monuments standing majestically in Anuradhapura.",
    image: "https://images.unsplash.com/photo-1632832971206-88d4078ea222?w=800&q=80",
    content: "Built by King Dutugemunu in 140 B.C., the Ruwanwelisaya is a magnificent hemispherical stupa. Surrounded by an elephant wall, it is considered a marvel of the ancient world's engineering and stands as a testament to the island's devout Buddhist heritage."
  },
  {
    id: 9,
    title: "Mihintale Peak",
    snippet: "Believed to be the meeting site that inaugurated the presence of Buddhism in Sri Lanka.",
    image: "https://images.unsplash.com/photo-1628189873099-281ce13dca7c?w=800&q=80",
    content: "Mihintale is an ancient mountain peak housing ruined monasteries, hospitals, and stupas. Pilgrims climb over 1,800 granite steps to reach the summit where the Indian monk Mahinda first taught Buddhism to the Sinhalese King Devanampiyatissa."
  },
  {
    id: 10,
    title: "Ritigala Nature Reserve",
    snippet: "An ancient Buddhist monastery hidden deep within a strict nature reserve.",
    image: "https://images.unsplash.com/photo-1558223681-3be2cdfae513?w=800&q=80",
    content: "Nestled in a dense jungle mountain, the Ritigala ruins date back to the 1st century BC. Devoid of the traditional stupas or temples, the site focuses on ascetic meditation. Walking through its shaded, stone-paved paths feels like stepping back into an untouched ancient world."
  },
  {
    id: 11,
    title: "Kataragama Sacred City",
    snippet: "A holy city venerated by Buddhists, Hindus, Muslims, and the indigenous Vedda people.",
    image: "https://images.unsplash.com/photo-1591873215206-cfa39247eb97?w=800&q=80",
    content: "Kataragama is an incredible melting pot of cultures. Dedicated to the deity Kataragama deviyo (Murugan), the bustling temple complex hosts vibrant evening pujas filled with traditional music, fire-walking rituals, and a unifying spiritual atmosphere."
  },
  {
    id: 12,
    title: "Aukana Buddha Statue",
    snippet: "A colossal, perfectly proportioned standing statue of the Buddha carved out of a granite rock face.",
    image: "https://images.unsplash.com/photo-1637402517869-ff0405cf52fc?w=800&q=80",
    content: "Carved in the 5th century, the Aukana Buddha stands over 40 feet tall. The precision of the sculpture is legendary: it is said a drop of water falling from the nose would drop exactly straight down between the toes. It remains one of Sri Lanka's most breathtaking ancient masterpieces."
  }
];

export default function ExploreScreen({ active, showScreen }) {
  const { user } = useAuth();
  const displayName = useMemo(() => user?.displayName || user?.email?.split("@")[0] || "traveler", [user]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Scroll to top when article is opened
  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    const scrollContainer = document.querySelector("#screen-explore .main-content");
    if (scrollContainer) scrollContainer.scrollTop = 0;
  };

  return (
    <div id="screen-explore" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="explore" userName={displayName} userRole="Trip planner for Sri Lanka" onNavigate={showScreen} />
        <div className="main-content">
          
          {selectedPlace ? (
            <div className="explore-article-view">
              <div className="explore-article-hero" style={{ backgroundImage: `url(${selectedPlace.image})` }}>
                <div className="hero-overlay">
                  <div className="hero-topbar">
                    <button 
                      className="btn-back-article" 
                      onClick={() => setSelectedPlace(null)} 
                    >
                      ← Back to Explore
                    </button>
                  </div>
                  <h1>{selectedPlace.title}</h1>
                </div>
              </div>
              <div className="explore-article-content">
                <p className="article-lead">{selectedPlace.snippet}</p>
                <div className="article-body">
                  <p>{selectedPlace.content}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="topbar">
                <div style={{ paddingBottom: "16px", borderBottom: "1px solid var(--gray-200)", width: "100%" }}>
                  <h1 style={{ fontSize: "2rem", color: "var(--teal-dark)", marginBottom: 8 }}>Explore Sri Lanka</h1>
                  <div className="subtitle" style={{ fontSize: "1.1rem", color: "var(--gray-600)" }}>
                    Discover ancient heritage, cultural wonders, and timeless stories from the pearl of the Indian Ocean.
                  </div>
                </div>
              </div>

              <div className="explore-bento">
                {explorePlaces.map((place, index) => {
                  let bentoClass = "bento-normal";
                  // Pattern for 1..7: Large, Normal, Normal, Wide, Normal, Normal, Wide
                  const pos = index % 7;
                  if (pos === 0) bentoClass = "bento-large";
                  else if (pos === 3 || pos === 6) bentoClass = "bento-wide";

                  return (
                    <div key={place.id} className={`bento-card ${bentoClass}`} onClick={() => handleSelectPlace(place)}>
                      <div className="bento-bg" style={{ backgroundImage: `url(${place.image})` }} />
                      <div className="bento-overlay">
                        <h3>{place.title}</h3>
                        {(bentoClass === "bento-large" || bentoClass === "bento-wide") && (
                          <p>{place.snippet}</p>
                        )}
                        <span className="read-more">Read More →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
