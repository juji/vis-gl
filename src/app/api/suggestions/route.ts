import { NextResponse } from "next/server";

// Sample data for autocomplete suggestions
const sampleData = [
  {
    id: "1",
    label: "React",
    value: "react",
    description: "A JavaScript library for building user interfaces",
  },
  {
    id: "2",
    label: "Next.js",
    value: "nextjs",
    description: "The React framework for production",
  },
  {
    id: "3",
    label: "TypeScript",
    value: "typescript",
    description: "JavaScript with syntax for types",
  },
  {
    id: "4",
    label: "Tailwind CSS",
    value: "tailwindcss",
    description: "A utility-first CSS framework",
  },
  {
    id: "5",
    label: "Vue.js",
    value: "vuejs",
    description: "The progressive JavaScript framework",
  },
  {
    id: "6",
    label: "Angular",
    value: "angular",
    description: "Platform for building mobile and desktop web applications",
  },
  {
    id: "7",
    label: "Svelte",
    value: "svelte",
    description: "Cybernetically enhanced web apps",
  },
  {
    id: "8",
    label: "Node.js",
    value: "nodejs",
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
  },
  {
    id: "9",
    label: "Express.js",
    value: "expressjs",
    description: "Fast, unopinionated, minimalist web framework for Node.js",
  },
  {
    id: "10",
    label: "MongoDB",
    value: "mongodb",
    description: "The database for modern applications",
  },
  {
    id: "11",
    label: "PostgreSQL",
    value: "postgresql",
    description: "The world's most advanced open source database",
  },
  {
    id: "12",
    label: "Redis",
    value: "redis",
    description: "In-memory data structure store",
  },
  {
    id: "13",
    label: "Docker",
    value: "docker",
    description: "Platform for developing, shipping, and running applications",
  },
  {
    id: "14",
    label: "Kubernetes",
    value: "kubernetes",
    description: "Production-grade container orchestration",
  },
  {
    id: "15",
    label: "AWS",
    value: "aws",
    description: "Amazon Web Services cloud platform",
  },
  {
    id: "16",
    label: "Google Cloud",
    value: "gcp",
    description: "Google's cloud computing services",
  },
  {
    id: "17",
    label: "Azure",
    value: "azure",
    description: "Microsoft's cloud computing platform",
  },
  {
    id: "18",
    label: "Vercel",
    value: "vercel",
    description: "Platform for frontend frameworks and static sites",
  },
  {
    id: "19",
    label: "Netlify",
    value: "netlify",
    description: "All-in-one platform for automating web projects",
  },
  {
    id: "20",
    label: "GraphQL",
    value: "graphql",
    description: "Query language for APIs",
  },
  {
    id: "21",
    label: "REST API",
    value: "restapi",
    description: "Architectural style for distributed hypermedia systems",
  },
  {
    id: "22",
    label: "Webpack",
    value: "webpack",
    description: "Static module bundler for modern JavaScript applications",
  },
  {
    id: "23",
    label: "Vite",
    value: "vite",
    description:
      "Build tool that aims to provide a faster development experience",
  },
  {
    id: "24",
    label: "ESLint",
    value: "eslint",
    description: "Tool for identifying and reporting patterns in JavaScript",
  },
  {
    id: "25",
    label: "Prettier",
    value: "prettier",
    description: "Opinionated code formatter",
  },
  {
    id: "26",
    label: "Jest",
    value: "jest",
    description: "JavaScript testing framework",
  },
  {
    id: "27",
    label: "Cypress",
    value: "cypress",
    description: "End-to-end testing framework",
  },
  {
    id: "28",
    label: "Storybook",
    value: "storybook",
    description: "Tool for building UI components in isolation",
  },
  {
    id: "29",
    label: "Figma",
    value: "figma",
    description: "Collaborative interface design tool",
  },
  {
    id: "30",
    label: "GitHub",
    value: "github",
    description: "Development platform for version control and collaboration",
  },
  {
    id: "31",
    label: "Python",
    value: "python",
    description: "High-level programming language",
  },
  {
    id: "32",
    label: "Django",
    value: "django",
    description: "High-level Python web framework",
  },
  {
    id: "33",
    label: "Flask",
    value: "flask",
    description: "Lightweight WSGI web application framework",
  },
  {
    id: "34",
    label: "Ruby on Rails",
    value: "rails",
    description: "Server-side web application framework",
  },
  {
    id: "35",
    label: "Laravel",
    value: "laravel",
    description: "PHP web application framework",
  },
  {
    id: "36",
    label: "Spring Boot",
    value: "springboot",
    description: "Java-based framework for creating microservices",
  },
  {
    id: "37",
    label: "Go",
    value: "golang",
    description: "Open source programming language by Google",
  },
  {
    id: "38",
    label: "Rust",
    value: "rust",
    description:
      "Systems programming language focused on safety and performance",
  },
  {
    id: "39",
    label: "Java",
    value: "java",
    description: "Object-oriented programming language",
  },
  {
    id: "40",
    label: "C#",
    value: "csharp",
    description: "Modern, object-oriented programming language",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  // Simulate API delay for realistic async behavior
  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 300 + 100),
  );

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  // Filter results based on query
  const filteredResults = sampleData.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.value.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()),
  );

  // Sort by relevance (starts with query first, then contains)
  const sortedResults = filteredResults.sort((a, b) => {
    const aStartsWith = a.label.toLowerCase().startsWith(query.toLowerCase());
    const bStartsWith = b.label.toLowerCase().startsWith(query.toLowerCase());

    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return a.label.localeCompare(b.label);
  });

  // Return up to 10 results
  return NextResponse.json(sortedResults.slice(0, 10));
}
