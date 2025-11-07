
import React from 'react';

export const LinguaGenieIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g>
      {/* Body */}
      <path d="M50,15 C25,15 10,40 10,65 C10,90 25,95 50,95 C75,95 90,90 90,65 C90,40 75,15 50,15 Z" fill="#50C878"/>
      {/* Belly */}
      <path d="M50,45 C35,45 25,55 25,70 C25,85 35,90 50,90 C65,90 75,85 75,70 C75,55 65,45 50,45 Z" fill="#90EE90"/>
      {/* Eyes background */}
      <circle cx="35" cy="45" r="15" fill="white"/>
      <circle cx="65" cy="45" r="15" fill="white"/>
      {/* Pupils */}
      <circle cx="38" cy="48" r="7" fill="black"/>
      <circle cx="62" cy="48" r="7" fill="black"/>
      {/* Beak */}
      <path d="M50,55 L45,65 L55,65 Z" fill="#FFD700"/>
      {/* Feet */}
      <ellipse cx="35" cy="94" rx="8" ry="4" fill="#FFD700"/>
      <ellipse cx="65" cy="94" rx="8" ry="4" fill="#FFD700"/>
      {/* Tuft */}
      <path d="M40,15 Q45,5 50,15" stroke="#4a5568" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M60,15 Q55,5 50,15" stroke="#4a5568" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </g>
  </svg>
);
