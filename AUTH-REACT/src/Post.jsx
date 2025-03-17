import { useEffect, useState } from "react";

function Post() {
  const [post, setPost] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "daniel" }) // Change username if needed
    })
      .then((res) => res.json())
      .then((data) => setToken(data.acessToken));
  }, []);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8000/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setPost(data[0])) // Assuming there's at least one post
      .catch((err) => console.error("Error fetching post:", err));
  }, [token]);

  return (
    <div style={styles.container}>
      {post ? (
        <h1 style={styles.text}>
          {post.username}: {post.title}
        </h1>
      ) : (
        <p style={styles.text}>Loading...</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#282c34"
  },
  text: {
    color: "#61dafb",
    fontSize: "2rem",
    fontWeight: "bold"
  }
};

export default Post;
