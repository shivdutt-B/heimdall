interface TechItem {
  name: string;
  hoverColor: string;
}

const techList: TechItem[] = [
  {
    name: "Node.js",
    hoverColor: "group-hover:text-[#339933] group-hover:opacity-100",
  },
  {
    name: "Express.js",
    hoverColor: "group-hover:text-[#a8b9c0] group-hover:opacity-100",
  },
  {
    name: "Flask",
    hoverColor: "group-hover:text-[#cce8e1] group-hover:opacity-100",
  },
  {
    name: "Django",
    hoverColor: "group-hover:text-[#44b78b] group-hover:opacity-100",
  },
  {
    name: "FastAPI",
    hoverColor: "group-hover:text-[#05998b] group-hover:opacity-100",
  },
  {
    name: "Spring Boot",
    hoverColor: "group-hover:text-[#6db33f] group-hover:opacity-100",
  },
];

export default techList