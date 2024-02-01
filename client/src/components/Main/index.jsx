
import React, { useEffect, useState } from "react";
import BlogDetails from "./BlogDetails";
import styles from "./styles.module.css";
import axios from "axios";

const Main = () => {
  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(process.env.REACT_APP_BASE_URL);
        // console.log(result.data);
        setBlogData(result.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once after the initial render

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>Hacker News</h1>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <div>
        {blogData.map((ele) => (
          <div key={ele.id}>
            {/* <h1>{ele.title}</h1> */}
            <BlogDetails post={ele} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
