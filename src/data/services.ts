export type Service = {
  /** Display index shown as `//n`. */
  index: number;
  title: string;
  description: string;
};

/**
 * Services. Order here is render order.
 *
 * NOTE — deviation from the Figma: all four items are numbered `//1` in the
 * design (docs/design/00-overview.md defect 1). Featured Work numbers `//1`–`//4`
 * correctly, so this is an oversight rather than intent, and it is corrected here.
 */
export const services: Service[] = [
  {
    index: 1,
    title: "UI/UX Design",
    description:
      "Provides end-to-end web design services using Figma, Framer, and Webflow, from wireframes and mockups to responsive, high-performance websites.",
  },
  {
    index: 2,
    title: "Frontend Development",
    description:
      "Builds modern, responsive web applications using React, Next.js, Vue.js, and Tailwind CSS. Fully integrates web animation with GSAP. Delivers fast, user friendly, and accessible user interfaces with seamless API integration and optimized performance.",
  },
  {
    index: 3,
    title: "Backend Engineering",
    description:
      "Builds secure, scalable backend systems using Laravel, Node.js, RESTful APIs, MySQL, PostgreSQL, and MariaDB. Experienced with Postman for API testing, AWS cloud services, server deployment, and database design, optimization, and management.",
  },
  {
    index: 4,
    title: "System Architecture",
    description:
      "Designs scalable, secure, and maintainable system architectures that support long-term growth. Experienced in software architecture, database design, API ecosystems, cloud infrastructure, and distributed systems.",
  },
];
