const courses = [
  {
    id: 1,
    title: "Complete React Development",
    category: "Web Development",
    instructor: "John Smith",
    rating: 4.8,
    lessons: 5,
    duration: "8 Hours",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500",
    description:
      "Learn React from the basics, understand components and hooks, and build interactive web applications.",

    lessonList: [
      "Introduction to React",
      "Understanding React Components",
      "JSX Fundamentals",
      "Props and State",
      "React Hooks and useState",
    ],

    lessonNotes: [
      `React is a JavaScript library used to build interactive user interfaces. It uses reusable components to organize application layouts. React updates the interface efficiently when application data changes.`,

      `Components are independent and reusable building blocks of a React application. They can contain HTML-like JSX, JavaScript logic and styling. Functional components are commonly used to create modern React applications.`,

      `JSX stands for JavaScript XML and allows developers to write HTML-like syntax inside JavaScript. JSX makes UI structures easier to understand and maintain. JavaScript expressions can be inserted using curly braces.`,

      `Props allow parent components to pass information to child components. State stores information that can change during component usage. Props are read-only, while state can be updated through React state setters.`,

      `React Hooks allow functional components to use features such as state and lifecycle-related effects. The useState hook manages changing data inside a component. Updating state triggers React to render the updated interface.`,
    ],
  },

  {
    id: 2,
    title: "JavaScript for Beginners",
    category: "Web Development",
    instructor: "Sarah Johnson",
    rating: 4.7,
    lessons: 5,
    duration: "6 Hours",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500",
    description:
      "Understand JavaScript fundamentals and learn to create interactive and dynamic web experiences.",

    lessonList: [
      "Introduction to JavaScript",
      "Variables and Data Types",
      "Operators and Expressions",
      "Conditional Statements",
      "Functions and Arrays",
    ],

    lessonNotes: [
      `JavaScript is a programming language used to make websites interactive and dynamic. It works alongside HTML and CSS to create modern web experiences. JavaScript also runs outside browsers using environments such as Node.js.`,

      `Variables store information that can be used throughout a program. JavaScript provides let, const and var for variable declarations. Common data types include strings, numbers, booleans, undefined, null and objects.`,

      `Operators perform calculations, comparisons and logical operations. Arithmetic operators include addition, subtraction, multiplication and division. Comparison and logical operators help applications evaluate conditions.`,

      `Conditional statements execute different blocks of code depending on whether a condition is true or false. JavaScript supports if, else if and else statements. The switch statement is useful when checking multiple possible values.`,

      `Functions are reusable blocks of code designed to perform specific tasks. Arrays store multiple values in an ordered collection. Array methods such as map, filter and find help process and retrieve data efficiently.`,
    ],
  },

  {
    id: 3,
    title: "Python Programming",
    category: "Programming",
    instructor: "David Wilson",
    rating: 4.9,
    lessons: 5,
    duration: "10 Hours",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500",
    description:
      "Learn Python programming from scratch, including programming fundamentals and practical applications.",

    lessonList: [
      "Introduction to Python",
      "Python Installation and Setup",
      "Variables and Data Types",
      "Conditional Statements and Loops",
      "Functions and Collections",
    ],

    lessonNotes: [
      `Python is a high-level programming language known for its readable syntax and versatility. It is used in web development, automation, data science and artificial intelligence. Python programs are generally easy for beginners to understand and write.`,

      `Python can be installed using the official Python distribution available on python.org. Development tools such as VS Code and PyCharm provide convenient coding environments. The Python interpreter executes Python source code.`,

      `Variables are names used to store values in a Python program. Python supports data types such as integers, floats, strings, booleans and lists. The type() function helps identify the data type of a value.`,

      `Conditional statements allow Python programs to make decisions using if, elif and else. Loops repeat instructions using for and while statements. The break and continue statements help control loop execution.`,

      `Functions organize reusable instructions and are defined using the def keyword. Lists and tuples store multiple values in an ordered collection. Lists can be modified, while tuples are immutable after creation.`,
    ],
  },

  {
    id: 4,
    title: "Data Science Fundamentals",
    category: "Data Science",
    instructor: "Emily Brown",
    rating: 4.6,
    lessons: 5,
    duration: "12 Hours",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500",
    description:
      "Explore data analysis, visualization and statistical concepts to understand and interpret real-world data.",

    lessonList: [
      "Introduction to Data Science",
      "Understanding and Exploring Data",
      "Python, NumPy and Pandas",
      "Data Cleaning and Preparation",
      "Exploratory Data Analysis and Statistics",
    ],

    lessonNotes: [
      `Data Science combines statistics, programming and domain knowledge to extract insights from data. It helps organizations identify patterns and make informed decisions. Common applications include forecasting, customer analysis and fraud detection.`,

      `Data exploration involves examining datasets to understand their structure and characteristics. Important properties include rows, columns, data types and missing values. Summary statistics help identify patterns and unusual observations.`,

      `Python is widely used in data science because of its extensive library ecosystem. NumPy supports efficient numerical operations using arrays. Pandas provides Series and DataFrames for organizing, filtering and analyzing structured data.`,

      `Data cleaning improves dataset quality by addressing missing values, duplicate records and inconsistent formats. Data preparation can include converting data types and handling outliers. Clean data helps produce more reliable analytical results.`,

      `Exploratory Data Analysis uses statistics and visualizations to understand datasets. Measures such as mean, median and standard deviation describe numerical distributions. Charts help identify relationships, trends and unusual values.`,
    ],
  },

  {
    id: 5,
    title: "UI/UX Design Essentials",
    category: "Design",
    instructor: "Michael Lee",
    rating: 4.8,
    lessons: 5,
    duration: "7 Hours",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=500",
    description:
      "Learn user interface and user experience design principles and create attractive, user-friendly designs.",

    lessonList: [
      "Introduction to UI and UX Design",
      "Fundamental Design Principles",
      "User Research and Personas",
      "Wireframing and Layout Design",
      "Prototyping and Usability Testing",
    ],

    lessonNotes: [
      `User Interface design focuses on the visual elements people interact with, such as buttons, layouts and typography. User Experience design focuses on the overall experience of using a product. Both work together to create useful and enjoyable digital products.`,

      `Design principles help create consistent and understandable interfaces. Important principles include visual hierarchy, contrast, alignment, balance and spacing. Consistent design patterns make applications easier to navigate.`,

      `User research helps designers understand the needs, goals and difficulties of their target audience. Interviews, surveys and observations are common research methods. User personas represent important user groups and guide design decisions.`,

      `Wireframes are simplified visual layouts showing the structure of a page or application. They help designers organize content and plan navigation before adding detailed visual styling. Low-fidelity wireframes focus on structure rather than appearance.`,

      `Prototypes simulate how users interact with a proposed design. They help teams evaluate navigation, interactions and usability before development. Usability testing identifies problems by observing real users completing tasks.`,
    ],
  },

  {
    id: 6,
    title: "Advanced Java Programming",
    category: "Programming",
    instructor: "Robert Martin",
    rating: 4.7,
    lessons: 5,
    duration: "14 Hours",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500",
    description:
      "Develop advanced Java programming skills using object-oriented concepts and modern Java features.",

    lessonList: [
      "Java Fundamentals and Advanced Features",
      "Object-Oriented Programming",
      "Inheritance and Polymorphism",
      "Abstraction and Interfaces",
      "Exception Handling and Collections",
    ],

    lessonNotes: [
      `Java is an object-oriented programming language that runs on the Java Virtual Machine. It provides features such as platform independence, strong type checking and automatic memory management. Advanced Java development builds on these core language concepts.`,

      `Object-Oriented Programming organizes software around classes and objects. Encapsulation protects internal data, while constructors initialize objects. These concepts help developers build modular and maintainable applications.`,

      `Inheritance allows a class to reuse properties and methods from another class using the extends keyword. Polymorphism allows the same method call to behave differently depending on the object. Method overriding is a common example of runtime polymorphism.`,

      `Abstraction hides unnecessary implementation details and exposes essential functionality. Abstract classes can contain both abstract and implemented methods. Interfaces define contracts that implementing classes must follow.`,

      `Exception handling manages runtime errors using try, catch and finally blocks. Java Collections provide structures such as List, Set and Map for storing data. Generics improve type safety when working with reusable collections and classes.`,
    ],
  },
];

export default courses;
