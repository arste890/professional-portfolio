/**
 * Global site metadata. Anything that appeared verbatim in more than one page
 * of the old hand-maintained HTML lives here so it has exactly one home.
 */
export default {
  url: "https://alecstevens.com",
  name: "Alec Stevens Portfolio",
  author: {
    name: "Alec R. Stevens",
    shortName: "Alec Stevens",
    alternateNames: ["Alec Stevens", "Alec R Stevens"],
    jobTitle: "Pre-Medical Student, Biochemist, Researcher, Pianist",
    credentials: [
      "Student at the University of Utah",
      "Honors Bachelor of Science in Biological Chemistry",
      "Bachelor of Music in Piano",
      "Minors in Biology, Chemistry, and Health",
    ],
    linkedin: "https://www.linkedin.com/in/arste890/",
    github: "https://github.com/arste890",
    knowsAbout: [
      "Biochemistry",
      "Classical Piano",
      "Higher Education Leadership",
      "Antibiotic Research",
      "Music Performance",
    ],
  },
  portrait: {
    alt: "Alec Stevens Utah pre-medical student and pianist portrait",
    webp320: "/images/Headshot-320x480.webp",
    webp640: "/images/Headshot-640x960.webp",
    jpg320: "/images/Headshot-320x480.jpg",
    jpg640: "/images/Headshot-640x960.jpg",
    width: 320,
    height: 480,
  },
  socialImage: "/images/profile-headshot.jpg",
  footerTagline: "Built for professional and academic presentation",
  /** Single source of truth for the primary navigation on every page. */
  nav: [
    { label: "Home", href: "/", key: "home" },
    { label: "About", href: "/#about", hash: "about" },
    { label: "Experience", href: "/#experience", hash: "experience" },
    { label: "Education", href: "/#education", hash: "education" },
    { label: "Volunteer", href: "/#volunteer", hash: "volunteer" },
    { label: "Endorsements", href: "/#endorsements", hash: "endorsements" },
    { label: "Media", href: "/media", key: "media" },
    { label: "Projects", href: "/projects", key: "projects" },
  ],
};
