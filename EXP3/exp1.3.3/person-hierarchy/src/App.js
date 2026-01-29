import { Person, Student, Teacher } from "./models/Person";
import "./App.css";

function App() {
  // Creating class objects
  const person = new Person("Alex Johnson", 30);
  const student = new Student("Emma Watson", 20, "Computer Science");
  const teacher = new Teacher("Dr. James Wilson", 45, "Mathematics");

  // Store all objects together (polymorphism)
  const people = [
    { role: "Person", data: person },
    { role: "Student", data: student },
    { role: "Teacher", data: teacher }
  ];

  return (
    <div className="container">
      <h1>Person Class Hierarchy</h1>

      {people.map((item, index) => (
        <div key={index} className="card">
          <h2>
            {item.data.name} ({item.role})
          </h2>
          <p><strong>Age:</strong> {item.data.age}</p>
          <p><em>{item.data.introduce()}</em></p>

          {item.role === "Student" && (
            <p><strong>Major:</strong> {item.data.major}</p>
          )}

          {item.role === "Teacher" && (
            <p><strong>Teaching:</strong> {item.data.subject}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
