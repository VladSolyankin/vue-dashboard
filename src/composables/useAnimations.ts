import { gsap } from "gsap";

export function useAnimations() {
  const animateProjects = () => {
    gsap.from(".project-card", {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "power2.out",
    });
  };

  return {
    animateProjects,
  };
}
