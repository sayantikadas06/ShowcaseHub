import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/api";

function App() {
  const [page, setPage] = useState("home");
  const [projects, setProjects] = useState([]);
  const [adminProjects, setAdminProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    studentName: "",
    description: "",
    tags: "",
    githubLink: "",
    liveDemoLink: "",
  });

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API}/projects/approved`, {
        params: { search, tag },
      });
      setProjects(res.data);
    } catch {
      setMessage("Unable to load projects");
    }
  };

  const fetchAdminProjects = async (authToken = token) => {
    try {
      const res = await axios.get(`${API}/projects/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setAdminProjects(res.data);
    } catch {
      setMessage("Unable to load admin submissions");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitProject = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(`${API}/projects/submit`, {
        ...form,
        tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
      });

      setMessage(res.data.message);
      setForm({
        title: "",
        studentName: "",
        description: "",
        tags: "",
        githubLink: "",
        liveDemoLink: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Submission failed");
    }
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const res = await axios.post(`${API}/admin/login`, {
      email: login.email.trim().toLowerCase(),
      password: login.password,
    });

    setToken(res.data.token);
    setPage("admin");
    await fetchAdminProjects(res.data.token);
    setMessage("Login successful!");
  } catch (error) {
    console.log("Login error:", error.response?.data || error.message);
    setMessage(error.response?.data?.message || "Login failed");
  }
};

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${API}/projects/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`Project ${status.toLowerCase()} successfully`);
      fetchAdminProjects();
      fetchProjects();
    } catch {
      setMessage("Unable to update project status");
    }
  };

  const allTags = [...new Set(projects.flatMap((p) => p.tags))];

  return (
    <div className="app">
      <header>
        <h1>ShowcaseHub</h1>
        <nav>
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("submit")}>Submit Project</button>
          <button onClick={() => setPage("login")}>Admin</button>
        </nav>
      </header>

      {message && <p className="message">{message}</p>}

      {page === "home" && (
        <main>
          <section className="hero">
            <h2>Discover Student Projects</h2>
            <p>A place to share and explore creative student work.</p>
            <button onClick={() => setPage("submit")}>Submit Your Project</button>
          </section>

          <section className="content">
            <h2>Project Gallery</h2>

            <div className="filters">
              <input
                placeholder="Search by project name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select value={tag} onChange={(e) => setTag(e.target.value)}>
                <option value="">All Tags</option>
                {allTags.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <button onClick={fetchProjects}>Search</button>
              <button onClick={() => {
                setSearch("");
                setTag("");
                setTimeout(fetchProjects, 0);
              }}>Clear</button>
            </div>

            <div className="project-grid">
              {projects.length === 0 ? (
                <p>
  {search || tag
    ? "No projects found. Try another search."
    : "No approved projects available yet."}
</p>
              ) : (
                projects.map((project) => (
                  <div className="project-card" key={project._id}>
                    <h3>{project.title}</h3>
                    <p>By {project.studentName}</p>
                    <p>{project.description}</p>
                    <div className="tags">
                      {project.tags.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                    <a href={project.githubLink} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                    {" | "}
                    <a href={project.liveDemoLink} target="_blank" rel="noreferrer">
                      Live Demo
                    </a>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      )}

      {page === "submit" && (
        <main className="content form-section">
          <h2>Submit Your Project</h2>
          <form onSubmit={submitProject}>
            <input name="title" placeholder="Project Title" value={form.title} onChange={handleFormChange} required />
            <input name="studentName" placeholder="Student Name" value={form.studentName} onChange={handleFormChange} required />
            <textarea name="description" placeholder="Project Description" value={form.description} onChange={handleFormChange} required />
            <input name="tags" placeholder="Tags (comma separated, e.g. React, Node)" value={form.tags} onChange={handleFormChange} />
            <input name="githubLink" placeholder="GitHub URL" type="url" value={form.githubLink} onChange={handleFormChange} required />
            <input name="liveDemoLink" placeholder="Live Demo URL" type="url" value={form.liveDemoLink} onChange={handleFormChange} required />
            <button type="submit">Submit Project</button>
          </form>
          <p className="hint">Your project will appear in the gallery after admin approval.</p>
        </main>
      )}

      {page === "login" && (
        <main className="content form-section">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Admin Email"
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              required
            />
            <button type="submit">Login</button>
          </form>
        </main>
      )}

      {page === "admin" && (
        <main className="content">
          <div className="admin-heading">
            <h2>Admin Dashboard</h2>
            <button onClick={() => {
              setToken("");
              setPage("home");
              setMessage("Logged out");
            }}>Logout</button>
          </div>

          {adminProjects.length === 0 ? (
            <p>No submissions yet.</p>
          ) : (
            <div className="admin-list">
              {adminProjects.map((project) => (
                <div className="admin-card" key={project._id}>
                  <h3>{project.title}</h3>
                  <p>Student: {project.studentName}</p>
                  <p>{project.description}</p>
                  <p>Tags: {project.tags.join(", ")}</p>
                  <p>
                    Status: <strong>{project.status}</strong>
                  </p>
                  <a href={project.githubLink} target="_blank" rel="noreferrer">GitHub</a>
                  {" | "}
                  <a href={project.liveDemoLink} target="_blank" rel="noreferrer">Live Demo</a>

                  {project.status === "Pending" && (
                    <div className="admin-actions">
                      <button onClick={() => updateStatus(project._id, "Approved")}>Approve</button>
                      <button onClick={() => updateStatus(project._id, "Rejected")}>Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      <footer>© 2026 ShowcaseHub | Student Project Showcase</footer>
    </div>
  );
}

export default App;